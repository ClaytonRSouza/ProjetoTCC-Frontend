import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, IconButton, Text } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import FiltroPropriedadeSelector from '../components/FiltroPropriedadeSelector';
import { api } from '../services/api';

//Interface para as propriedades
interface Propriedade {
    id: number;
    nome: string;
}

//Interface para as movimentações
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

    const [propriedadeId, setPropriedadeId] = useState<number | null>(null);
    const [propriedadeSelecionada, setPropriedadeSelecionada] = useState<Propriedade | null>(null);;
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalJustificativaVisible, setModalJustificativaVisible] = useState(false);
    const [justificativaSelecionada, setJustificativaSelecionada] = useState<string>('');

    useEffect(() => {
        const fetchAndSetDefaultPropriedade = async () => {
            try {
                const response = await api.get('/auth/propriedades');
                const fetchedPropriedades: Propriedade[] = response.data.propriedades;
                // Se houver propriedades, seleciona a primeira como padrão
                if (fetchedPropriedades.length > 0) {
                    setPropriedadeSelecionada(fetchedPropriedades[0]);
                    setPropriedadeId(fetchedPropriedades[0].id);
                }
            } catch (error) {
                Alert.alert('Erro', 'Erro ao carregar propriedades.');
            }
        };
        fetchAndSetDefaultPropriedade();
    }, []);

    useEffect(() => {
        if (propriedadeSelecionada) {
            fetchMovimentacoes();
        }
    }, [propriedadeSelecionada]);

    //função para buscar as movimentações
    const fetchMovimentacoes = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/produto/relatorio-movimentacoes`, {
                params: { propriedadeId: propriedadeSelecionada?.id }
            });
            setMovimentacoes(res.data.relatorio);
        } catch (error) {
            console.error('Erro ao buscar movimentações:', error);
        } finally {
            setLoading(false);
        }
    };

    //função para definir o icone de acordo com o tipo da movimentação
    const renderIcon = (tipo: string) => {
        switch (tipo) {
            case 'ENTRADA': return 'arrow-up-bold-circle';
            case 'SAIDA': return 'arrow-down-bold-circle';
            case 'DESATIVACAO': return 'close-circle-outline';
            default: return 'help-circle';
        }
    };

    //função para definir a cor do icone de acordo com o tipo da movimentação
    const renderIconColor = (tipo: string) => {
        switch (tipo) {
            case 'ENTRADA': return 'green';
            case 'SAIDA': return 'red';
            case 'DESATIVACAO': return 'grey';
            default: return 'black';
        }
    };

    //função para abrir o modal de justificativa
    const abrirJustificativa = (justificativa: string) => {
        setJustificativaSelecionada(justificativa);
        setModalJustificativaVisible(true);
    };

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />

            <FiltroPropriedadeSelector
                selected={propriedadeSelecionada}
                onSelect={setPropriedadeSelecionada}
                allowNull={false} // Define para false, removendo a opção "TODAS"
            />

            {loading ? (
                <ActivityIndicator animating style={styles.loader} />
            ) : (
                <FlatList
                    data={movimentacoes}
                    keyExtractor={(item) => item.movimentacaoId.toString()}
                    renderItem={({ item }) => (
                        <Card style={styles.item}>
                            <Card.Title
                                title={`${item.produtoNome.toUpperCase()}  ${item.embalagem.replace(/_/g, ' ')}`}
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
