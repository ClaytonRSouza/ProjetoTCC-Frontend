import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { api } from '../services/api';

export default function RelatorioVencimentosScreen({ navigation }: any) {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRelatorio();
    }, []);

    const fetchRelatorio = async () => {
        setLoading(true);
        const res = await api.get('/produto/alertas-vencimento');
        setProdutos(res.data.produtos);
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />
            <Text style={styles.title}>Relatório de Vencimentos</Text>
            {loading ? <ActivityIndicator /> :
                <FlatList
                    data={produtos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text>{item.nome}</Text>
                            <Text style={{ color: item.vencido ? 'red' : 'black' }}>{item.validade}</Text>
                            {item.propriedades.map((prop: any, idx: number) => (
                                <Text key={idx}>{prop.propriedade}: {prop.quantidade} un</Text>
                            ))}
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
