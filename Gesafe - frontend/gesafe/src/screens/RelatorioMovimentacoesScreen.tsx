import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { api } from '../services/api';

export default function RelatorioMovimentacoesScreen({ navigation }: any) {
    const [relatorio, setRelatorio] = useState<any[]>([]);
    const [propriedades, setPropriedades] = useState<any[]>([]);
    const [selectedPropriedade, setSelectedPropriedade] = useState<any | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    const tipos = ["TODOS", "ENTRADA", "SAIDA", "DESATIVACAO"];
    const [selectedTipo, setSelectedTipo] = useState<string>("TODOS");
    const [menuTipoVisible, setMenuTipoVisible] = useState(false);

    useEffect(() => { fetchPropriedades(); }, []);
    useEffect(() => { fetchRelatorio(); }, [selectedTipo, selectedPropriedade]);

    const fetchPropriedades = async () => {
        const res = await api.get('/auth/propriedades');
        setPropriedades(res.data.propriedades);
    };

    const fetchRelatorio = async () => {
        const params: any = {};
        if (selectedPropriedade) params.propriedadeId = selectedPropriedade.id;
        if (selectedTipo !== "TODOS") params.tipo = selectedTipo;
        const res = await api.get('/produto/relatorio-movimentacoes', { params });
        setRelatorio(res.data.relatorio);
    };

    const gerarPDF = async () => {
        const html = `
      <html><body>
      <h1>Relatório de Movimentações</h1>
      ${relatorio.map(m => `<p>${m.data} - ${m.tipo} - ${m.produtoNome} - ${m.quantidade} un - ${m.propriedadeNome}</p>`).join('')}
      </body></html>
    `;
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri);
    };

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />
            <Text style={styles.title}>Relatório de Movimentações</Text>

            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                    <Button
                        mode="outlined"
                        icon="chevron-down"
                        contentStyle={{ flexDirection: 'row-reverse' }}
                        onPress={() => setMenuVisible(true)}
                        style={styles.selectorButton}
                        labelStyle={{ color: '#575757', fontWeight: 'bold', fontSize: 18 }}
                    >
                        {selectedPropriedade?.nome || 'Selecionar propriedade'}
                    </Button>
                }
            >
                {propriedades.map((p) => (
                    <Menu.Item key={p.id} onPress={() => { setSelectedPropriedade(p); setMenuVisible(false); }} title={p.nome} />
                ))}
                <Menu.Item onPress={() => { setSelectedPropriedade(null); setMenuVisible(false); }} title="Todas" />
            </Menu>

            <Button onPress={() => setMenuTipoVisible(true)}>{selectedTipo}</Button>
            <Menu
                visible={menuTipoVisible}
                onDismiss={() => setMenuTipoVisible(false)}
                anchor={
                    { x: 0, y: 0 }
                }
            >
                {tipos.map((t) => (
                    <Menu.Item key={t} onPress={() => { setSelectedTipo(t); setMenuTipoVisible(false); }} title={t} />
                ))}
            </Menu>

            <ScrollView>
                {relatorio.map((m, i) => (
                    <Text key={i}>{m.data} - {m.tipo} - {m.produtoNome} - {m.quantidade} un - {m.propriedadeNome} ({m.justificativa})</Text>
                ))}
            </ScrollView>

            <Button
                labelStyle={{ color: '#575757', fontWeight: '500', fontSize: 20 }}
                onPress={gerarPDF}
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
    selectorButton: { borderRadius: 6, borderColor: '#144734', width: '100%' },
});
