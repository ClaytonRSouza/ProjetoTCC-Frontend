import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface ProdutoRelatorio {
    nome: string;
    quantidade: number;
    validade: string;
    embalagem: string;
}

export default function RelatorioEstoqueScreen({ navigation }: any) {
    const { token } = useAuth();

    const [relatorio, setRelatorio] = useState<Record<string, ProdutoRelatorio[]>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRelatorio();
    }, []);

    const fetchRelatorio = async () => {
        try {
            setLoading(true);
            const res = await api.get('/produto/relatorio-geral');
            setRelatorio(res.data.relatorio);
        } catch (error) {
            console.error('Erro ao buscar relatório:', error);
        } finally {
            setLoading(false);
        }
    };

    const gerarPDF = async () => {
        const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #144734; }
            h2 { margin-top: 20px; }
            p { margin-left: 10px; }
          </style>
        </head>
        <body>
          <h1>Relatório de Estoque</h1>
          ${Object.entries(relatorio).map(([prop, produtos]) => `
            <h2>${prop}</h2>
            ${produtos.map(p => `
              <p>${p.nome} - ${p.quantidade} un - ${p.embalagem.replace(/_/g, ' ')} - Venc: ${p.validade || 'Sem validade'}</p>
            `).join('')}
          `).join('')}
        </body>
      </html>
    `;

        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri);
    };

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />
            <Text style={styles.title}>Relatório de Estoque</Text>

            {loading ? (
                <ActivityIndicator animating style={styles.loader} />
            ) : (
                <ScrollView>
                    {Object.entries(relatorio).map(([propriedade, produtos]) => (
                        <View key={propriedade} style={styles.propContainer}>
                            <Text style={styles.propTitle}>{propriedade}</Text>
                            {produtos.map((p, idx) => (
                                <Text key={idx}>
                                    {p.nome} - {p.quantidade} un - {p.embalagem.replace(/_/g, ' ')} - Venc: {p.validade || 'Sem validade'}
                                </Text>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            )}

            <Button mode="contained" style={styles.button} onPress={gerarPDF}>
                Gerar PDF
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: '#f5f5f5' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    loader: { flex: 1, justifyContent: 'center' },
    propContainer: { marginBottom: 12 },
    propTitle: { fontSize: 16, fontWeight: 'bold', color: '#144734' },
    button: { marginTop: 16, backgroundColor: '#144734' },
});
