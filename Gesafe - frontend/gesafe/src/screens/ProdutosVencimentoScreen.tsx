import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { api } from '../services/api';

interface ProdutoVencimento {
    id: number;
    nome: string;
    validade: string;
    vencido: boolean;
    embalagem: string;
    propriedades: {
        propriedade: string;
        quantidade: number;
    }[];
}

export default function ProdutosVencimentoScreen({ navigation }: any) {
    const [produtos, setProdutos] = useState<ProdutoVencimento[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProdutos = async () => {
        try {
            setLoading(true);
            const res = await api.get('/produto/alertas-vencimento');
            setProdutos(res.data.produtos);
        } catch (err) {
            console.error('Erro ao buscar produtos próximos ao vencimento:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />

            {loading ? (
                <ActivityIndicator animating style={styles.loader} />
            ) : (
                <FlatList
                    data={produtos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text style={styles.produtoNome}>{item.nome.toUpperCase()} {item.embalagem.replace(/_/g, ' ')}</Text>
                                <Text
                                    style={[
                                        styles.validade,
                                        { color: item.vencido ? 'red' : '#555' },
                                    ]}
                                >
                                    Validade: {item.validade}
                                </Text>
                                {item.propriedades.map((p, idx) => (
                                    <Text
                                        style={styles.propriedade}
                                        key={idx}
                                    >
                                        {p.propriedade}: {p.quantidade}
                                    </Text>

                                ))}
                            </Card.Content>
                        </Card>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
    loader: { flex: 1, justifyContent: 'center' },
    card: {
        margin: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    produtoNome: { fontWeight: 'bold', fontSize: 20, marginBottom: 4 },
    validade: { fontSize: 18, marginBottom: 4, fontWeight: 'bold' },
    propriedade: { fontSize: 18, marginBottom: 4, color: '#555', fontWeight: '600' },
});
