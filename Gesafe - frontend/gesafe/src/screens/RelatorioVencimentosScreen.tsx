import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { api } from '../services/api';

export default function RelatorioVencimentosScreen({ navigation }: any) {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [propriedades, setPropriedades] = useState<any[]>([]);
    const [selectedPropriedade, setSelectedPropriedade] = useState<any | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const status = ["TODOS", "VENCIDO", "A VENCER"];
    const [selectedStatus, setSelectedStatus] = useState<string>("TODOS");
    const [menuStatusVisible, setMenuStatusVisible] = useState(false);

    useEffect(() => { fetchPropriedades(); fetchProdutos(); }, []);
    useEffect(() => { fetchProdutos(); }, [selectedPropriedade, selectedStatus]);

    const fetchPropriedades = async () => {
        const res = await api.get('/auth/propriedades');
        setPropriedades(res.data.propriedades);
    };

    const fetchProdutos = async () => {
        const res = await api.get('/produto/alertas-vencimento');
        let lista = res.data.produtos;

        if (selectedPropriedade) {
            lista = lista.filter((p: any) =>
                p.propriedades.some((e: any) => e.propriedade === selectedPropriedade.nome)
            );
        }
        if (selectedStatus !== "TODOS") {
            lista = lista.filter((p: any) => p.vencido === (selectedStatus === "VENCIDO"));
        }
        setProdutos(lista);
    };

    const gerarPDF = async () => {
        const html = `
      <html><body>
      <h1>Relatório de Produtos Vencidos/A Vencer</h1>
      ${produtos.map(p => `<p>${p.nome} - ${p.validade} - ${p.vencido ? 'VENCIDO' : 'A VENCER'} - ${p.propriedades.map((e: any) => e.propriedade + ' (' + e.quantidade + 'un)').join(', ')}</p>`).join('')}
      </body></html>
    `;
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri);
    };

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />
            <Text style={styles.title}>Relatório de Produtos Vencidos/A Vencer</Text>

            <Button onPress={() => setMenuVisible(true)}>{selectedPropriedade?.nome || 'Selecionar Propriedade'}</Button>
            <Menu visible={menuVisible} onDismiss={() => setMenuVisible(false)} anchor={{ x: 0, y: 0 }}>
                {propriedades.map((p) => (
                    <Menu.Item key={p.id} onPress={() => { setSelectedPropriedade(p); setMenuVisible(false); }} title={p.nome} />
                ))}
                <Menu.Item onPress={() => { setSelectedPropriedade(null); setMenuVisible(false); }} title="Todas" />
            </Menu>

            <Button onPress={() => setMenuStatusVisible(true)}>{selectedStatus}</Button>
            <Menu visible={menuStatusVisible} onDismiss={() => setMenuStatusVisible(false)} anchor={{ x: 0, y: 0 }}>
                {status.map((s) => (
                    <Menu.Item key={s} onPress={() => { setSelectedStatus(s); setMenuStatusVisible(false); }} title={s} />
                ))}
            </Menu>

            <ScrollView>
                {produtos.map((p, i) => (
                    <Text key={i}>{p.nome} - {p.embalagem.replace(/_/g, ' ')} - {p.validade} - {p.vencido ? 'VENCIDO' : 'A VENCER'} - {p.propriedades.map((e: any) => e.propriedade + ' (' + e.quantidade + 'un)').join(', ')}</Text>
                ))}
            </ScrollView>

            <Button
                onPress={gerarPDF}
                labelStyle={{ color: '#575757', fontWeight: '500', fontSize: 20 }}
                style={styles.button}
            >
                Gerar PDF
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12 },
    title: { fontSize: 18, fontWeight: 'bold' },
    button: { marginTop: 16, backgroundColor: '#c8d7d3', borderRadius: 10 },
});
