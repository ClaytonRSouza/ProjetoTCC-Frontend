import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import FiltroMenuSelector from '../components/FiltroMenuSelector';
import FiltroPropriedadeSelector from '../components/FiltroPropriedadeSelector';
import RelatorioLayout from '../components/RelatorioLayout';
import { api } from '../services/api';
import { gerarPdfRelatorio } from '../utils/gerarPdfRelatorio';

interface Produto {
    nome: string;
    quantidade: number;
    validade: string;
    embalagem: string;
}

interface Propriedade {
    id: number;
    nome: string;
}

export default function RelatorioEstoqueScreen({ navigation }: any) {
    const [relatorio, setRelatorio] = useState<Record<string, Produto[]>>({});
    const [selectedPropriedade, setSelectedPropriedade] = useState<Propriedade | null>(null);
    const [selectedEmbalagem, setSelectedEmbalagem] = useState<string | null>(null);

    const embalagens = [
        'SACARIA', 'BAG_1TN', 'BAG_750KG', 'LITRO', 'GALAO_2L', 'GALAO_5L',
        'GALAO_10L', 'BALDE_20L', 'TAMBOR_200L', 'IBC_1000L',
        'PACOTE_1KG', 'PACOTE_5KG', 'PACOTE_10KG', 'PACOTE_15KG',
        'PACOTE_500G', 'OUTROS'
    ];

    useEffect(() => {
        fetchRelatorio();
    }, [selectedPropriedade, selectedEmbalagem]);

    const fetchRelatorio = async () => {
        const params: any = {};
        if (selectedPropriedade) params.propriedadeId = selectedPropriedade.id;
        const res = await api.get('/produto/relatorio-geral', { params });
        setRelatorio(res.data.relatorio);
    };

    const handleGerarPDF = () => {
        const dadosFormatados = Object.entries(relatorio).flatMap(([propriedadeNome, produtos]) =>
            produtos
                .filter(p => !selectedEmbalagem || p.embalagem === selectedEmbalagem)
                .map(p => ({
                    produto: p.nome,
                    embalagem: p.embalagem.replace(/_/g, ' '),
                    propriedade: propriedadeNome,
                    quantidade: p.quantidade,
                    validade: p.validade,
                }))
        );

        gerarPdfRelatorio('Relatório Geral de Estoque', dadosFormatados);
    };

    return (
        <RelatorioLayout
            navigation={navigation}
            titulo="Relatório Geral de Estoque"
            filtros={
                <>
                    <FiltroPropriedadeSelector selected={selectedPropriedade} onSelect={setSelectedPropriedade} />
                    <FiltroMenuSelector
                        label="Selecionar Embalagem"
                        valores={embalagens}
                        valorSelecionado={selectedEmbalagem}
                        onSelecionar={setSelectedEmbalagem}
                    />
                </>
            }
            rodape={
                <View style={{ marginTop: 16 }}>
                    <Button
                        icon="file-pdf-box"
                        mode="elevated"
                        onPress={handleGerarPDF}
                        style={styles.button}
                        labelStyle={{ color: '#000', fontWeight: '500', fontSize: 20 }}
                    >
                        Gerar PDF
                    </Button>
                </View>
            }
        >
            {Object.entries(relatorio).map(([prop, produtos]) => (
                <View key={prop} style={styles.propBox}>
                    <Text style={styles.propTitle}>{prop}</Text>
                    {produtos
                        .filter(p => !selectedEmbalagem || p.embalagem === selectedEmbalagem)
                        .map((p, i) => (
                            <Text key={i}>
                                {p.nome} - {p.embalagem.replace(/_/g, ' ')} - {p.quantidade} un - Venc: {p.validade}
                            </Text>
                        ))}
                </View>
            ))}
        </RelatorioLayout>
    );
}

const styles = StyleSheet.create({
    propBox: { marginBottom: 12 },
    propTitle: { marginTop: 12, fontWeight: 'bold' },
    button: {
        marginVertical: 16,
        borderRadius: 10,
        backgroundColor: '#c8d7d3',
    },
});
