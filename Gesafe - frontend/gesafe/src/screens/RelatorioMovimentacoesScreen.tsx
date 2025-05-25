import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Menu, Text } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { api } from '../services/api';

export default function RelatorioMovimentacoesScreen({ navigation }: any) {
    const [relatorio, setRelatorio] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [tipo, setTipo] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        fetchRelatorio();
    }, [tipo]);

    const fetchRelatorio = async () => {
        setLoading(true);
        const res = await api.get('/produto/relatorio-movimentacoes', {
            params: { tipo }
        });
        setRelatorio(res.data.relatorio);
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />
            <Text style={styles.title}>Relatório de Movimentações</Text>

            <Button onPress={() => setMenuVisible(true)}>Filtrar Tipo</Button>
            <Menu visible={menuVisible} onDismiss={() => setMenuVisible(false)} anchor={{ x: 0, y: 0 }}>
                {['ENTRADA', 'SAIDA', 'DESATIVACAO'].map(t => (
                    <Menu.Item key={t} title={t} onPress={() => { setTipo(t); setMenuVisible(false); }} />
                ))}
            </Menu>

            {loading ? <ActivityIndicator /> :
                <FlatList
                    data={relatorio}
                    keyExtractor={(item) => item.movimentacaoId.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text>{item.produtoNome} - {item.tipo}</Text>
                            <Text>{item.quantidade} un - {item.data}</Text>
                            <Text>Justificativa: {item.justificativa}</Text>
                        </View>
                    )}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontWeight: 'bold', fontSize: 20, marginBottom: 10 },
    card: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
});
