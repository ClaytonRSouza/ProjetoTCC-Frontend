import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, IconButton, Menu, Text } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface Propriedade {
    id: number;
    nome: string;
}

interface Movimentacao {
    tipo: string;
    quantidade: number;
    data: string;
    produtoNome: string;
    propriedadeNome: string;
    embalagem: string;
    movimentacaoId: number;
    justificativa: string;
}

export default function MovimentacoesScreen({ navigation }: any) {
    const { token } = useAuth();

    const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
    const [selectedPropriedade, setSelectedPropriedade] = useState<Propriedade | null>(null);

    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
    const [loading, setLoading] = useState(false);

    const [menuVisible, setMenuVisible] = useState(false);

    const [modalJustificativaVisible, setModalJustificativaVisible] = useState(false);
    const [justificativaSelecionada, setJustificativaSelecionada] = useState<string>('');

    useEffect(() => {
        const fetchPropriedades = async () => {
            try {
                const res = await api.get('/auth/propriedades');
                setPropriedades(res.data.propriedades);
                if (res.data.propriedades.length > 0) {
                    setSelectedPropriedade(res.data.propriedades[0]);
                }
            } catch (error) {
                console.error('Erro ao buscar propriedades:', error);
            }
        };
        fetchPropriedades();
    }, []);

    useEffect(() => {
        if (selectedPropriedade) {
            fetchMovimentacoes();
        }
    }, [selectedPropriedade]);

    const fetchMovimentacoes = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/produto/relatorio-movimentacoes`, {
                params: { propriedadeId: selectedPropriedade?.id }
            });
            setMovimentacoes(res.data.relatorio);
        } catch (error) {
            console.error('Erro ao buscar movimentações:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderIcon = (tipo: string) => {
        switch (tipo) {
            case 'ENTRADA': return 'arrow-up-bold-circle';
            case 'SAIDA': return 'arrow-down-bold-circle';
            case 'DESATIVACAO': return 'close-circle-outline';
            default: return 'help-circle';
        }
    };

    const renderIconColor = (tipo: string) => {
        switch (tipo) {
            case 'ENTRADA': return 'green';
            case 'SAIDA': return 'red';
            case 'DESATIVACAO': return 'grey';
            default: return 'black';
        }
    };

    const abrirJustificativa = (justificativa: string) => {
        setJustificativaSelecionada(justificativa);
        setModalJustificativaVisible(true);
    };

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />

            <View style={styles.selectorWrapper}>
                <Button
                    mode="outlined"
                    icon="chevron-down"
                    onPress={() => setMenuVisible(true)}
                    labelStyle={{ color: '#575757', fontWeight: 'bold', fontSize: 18 }}
                    style={styles.selectorButton}
                >
                    {selectedPropriedade?.nome || 'Selecionar propriedade'}
                </Button>

                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={{ x: 0, y: 0 }}
                >
                    {propriedades.map((p) => (
                        <Menu.Item
                            key={p.id}
                            onPress={() => {
                                setSelectedPropriedade(p);
                                setMenuVisible(false);
                            }}
                            title={p.nome}
                        />
                    ))}
                </Menu>
            </View>

            {loading ? (
                <ActivityIndicator animating style={styles.loader} />
            ) : (
                <FlatList
                    data={movimentacoes}
                    keyExtractor={(item) => item.movimentacaoId.toString()}
                    renderItem={({ item }) => (
                        <Card style={styles.item}>
                            <Card.Title
                                title={`${item.produtoNome}  (${item.embalagem})`}
                                subtitle={`Data: ${item.data} - Qtd: ${item.quantidade}`}
                                left={(props) => (
                                    <IconButton
                                        {...props}
                                        icon={renderIcon(item.tipo)}
                                        iconColor={renderIconColor(item.tipo)}
                                    />
                                )}
                            />
                            {item.tipo === 'DESATIVACAO' && (
                                <Card.Actions>
                                    <Button
                                        mode='elevated'
                                        onPress={() => abrirJustificativa(item.justificativa)}
                                        labelStyle={{ color: '#575757', fontWeight: '500', fontSize: 15 }}
                                    >
                                        Ver justificativa
                                    </Button>
                                </Card.Actions>
                            )}
                        </Card>
                    )}
                />
            )}

            <Modal visible={modalJustificativaVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ marginBottom: 10 }}>Justificativa da desativação:</Text>
                        <Text>{justificativaSelecionada}</Text>
                        <Button
                            onPress={() => setModalJustificativaVisible(false)}
                            style={{ marginTop: 10 }}
                        >
                            Fechar
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
    selectorWrapper: { marginVertical: 12 },
    selectorButton: { borderRadius: 6 },
    loader: { flex: 1, justifyContent: 'center' },
    item: {
        marginBottom: 8,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        elevation: 5
    },
});
