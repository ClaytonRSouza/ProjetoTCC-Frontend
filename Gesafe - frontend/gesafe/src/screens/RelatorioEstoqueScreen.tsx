import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { api } from '../services/api';

interface Produto { nome: string; quantidade: number; validade: string; embalagem: string; }
interface Propriedade { id: number; nome: string; }

export default function RelatorioEstoqueScreen({ navigation }: any) {
    const [relatorio, setRelatorio] = useState<Record<string, Produto[]>>({});
    const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
    const [selectedPropriedade, setSelectedPropriedade] = useState<Propriedade | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const embalagens = [
        'SACARIA', 'BAG_1TN', 'BAG_750KG', 'LITRO', 'GALAO_2L', 'GALAO_5L',
        'GALAO_10L', 'BALDE_20L', 'TAMBOR_200L', 'IBC_1000L',
        'PACOTE_1KG', 'PACOTE_5KG', 'PACOTE_10KG', 'PACOTE_15KG',
        'PACOTE_500G', 'OUTROS'
    ];
    const [selectedEmbalagem, setSelectedEmbalagem] = useState<string | null>(null);
    const [menuEmbalagemVisible, setMenuEmbalagemVisible] = useState(false);

    useEffect(() => { fetchPropriedades(); fetchRelatorio(); }, []);
    useEffect(() => { fetchRelatorio(); }, [selectedPropriedade]);

    const fetchPropriedades = async () => {
        const res = await api.get('/auth/propriedades');
        setPropriedades(res.data.propriedades);
    };

    const fetchRelatorio = async () => {
        const params: any = {};
        if (selectedPropriedade) params.propriedadeId = selectedPropriedade.id;
        const res = await api.get('/produto/relatorio-geral', { params });
        setRelatorio(res.data.relatorio);
    };

    const gerarPDF = async () => {
        const html = `
      <html><body>
      <h1>Relatório de Estoque</h1>
      ${Object.entries(relatorio).map(([prop, produtos]) => `
        <h2>${prop}</h2>
        ${produtos.filter(p => !selectedEmbalagem || p.embalagem === selectedEmbalagem)
                .map(p => `<p>${p.nome} - ${p.quantidade} un - Venc: ${p.validade}</p>`).join('')}
      `).join('')}
      </body></html>
    `;
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri);
    };

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />
            <Text style={styles.title}>Relatório de Estoque</Text>

            <Button onPress={() => setMenuVisible(true)}>{selectedPropriedade?.nome || 'Selecionar Propriedade'}</Button>
            <Menu visible={menuVisible} onDismiss={() => setMenuVisible(false)} anchor={{ x: 0, y: 0 }}>
                {propriedades.map((p) => (
                    <Menu.Item key={p.id} onPress={() => { setSelectedPropriedade(p); setMenuVisible(false); }} title={p.nome} />
                ))}
                <Menu.Item onPress={() => { setSelectedPropriedade(null); setMenuVisible(false); }} title="Todas" />
            </Menu>

            <Button onPress={() => setMenuEmbalagemVisible(true)}>{selectedEmbalagem || 'Selecionar Embalagem'}</Button>
            <Menu visible={menuEmbalagemVisible} onDismiss={() => setMenuEmbalagemVisible(false)} anchor={{ x: 0, y: 0 }}>
                {embalagens.map((e) => (
                    <Menu.Item key={e} onPress={() => { setSelectedEmbalagem(e); setMenuEmbalagemVisible(false); }} title={e} />
                ))}
                <Menu.Item onPress={() => { setSelectedEmbalagem(null); setMenuEmbalagemVisible(false); }} title="Todas" />
            </Menu>

            <ScrollView>
                {Object.entries(relatorio).map(([prop, produtos]) => (
                    <View key={prop}>
                        <Text style={styles.propTitle}>{prop}</Text>
                        {produtos.filter(p => !selectedEmbalagem || p.embalagem === selectedEmbalagem)
                            .map((p, i) => (
                                <Text key={i}>{p.nome} - {p.embalagem.replace(/_/g, ' ')} - {p.quantidade} un - Venc: {p.validade}</Text>
                            ))}
                    </View>
                ))}
            </ScrollView>

            <Button onPress={gerarPDF} style={styles.button}>Gerar PDF</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12 },
    title: { fontSize: 18, fontWeight: 'bold' },
    propTitle: { marginTop: 12, fontWeight: 'bold' },
    button: { marginTop: 16 }
});
