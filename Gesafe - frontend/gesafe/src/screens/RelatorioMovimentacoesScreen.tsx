import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import FiltroMenuSelector from '../components/FiltroMenuSelector';
import FiltroPropriedadeSelector from '../components/FiltroPropriedadeSelector';
import RelatorioLayout from '../components/RelatorioLayout';
import { api } from '../services/api';
import { gerarPdfRelatorio } from '../utils/gerarPdfRelatorio';

export default function RelatorioMovimentacoesScreen({ navigation }: any) {
    const [relatorio, setRelatorio] = useState<any[]>([]);
    const [selectedPropriedade, setSelectedPropriedade] = useState<any | null>(null);
    const [selectedTipo, setSelectedTipo] = useState<string | null>("TODOS");

    const tipos = ["ENTRADA", "SAIDA", "DESATIVACAO", "AJUSTE"];

    useEffect(() => {
        fetchRelatorio();
    }, [selectedTipo, selectedPropriedade]);

    const fetchRelatorio = async () => {
        const params: any = {};
        if (selectedPropriedade) params.propriedadeId = selectedPropriedade.id;
        if (selectedTipo && selectedTipo !== "TODOS") params.tipo = selectedTipo;
        const res = await api.get('/produto/relatorio-movimentacoes', { params });
        setRelatorio(res.data.relatorio);
    };

    const handleGerarPDF = () => {
        const dadosFormatados = relatorio.map((m: any) => ({
            propriedade: m.propriedadeNome,
            produto: m.produtoNome,
            embalagem: m.embalagem,
            quantidade: m.quantidade,
            tipo: m.tipo,
            justificativa: m.justificativa,
            validade: "", // não aplicável
        }));

        gerarPdfRelatorio("Relatório de Movimentações", dadosFormatados);
    };

    return (
        <RelatorioLayout
            navigation={navigation}
            titulo="Relatório de Movimentações"
            filtros={
                <>
                    <FiltroPropriedadeSelector selected={selectedPropriedade} onSelect={setSelectedPropriedade} />
                    <FiltroMenuSelector
                        label="Tipo de Movimentação"
                        valores={["TODOS", ...tipos]}
                        valorSelecionado={selectedTipo}
                        onSelecionar={setSelectedTipo}
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
            {relatorio.map((m, i) => (
                <Text key={i}>
                    {m.data} - {m.tipo} - {m.produtoNome} - {m.quantidade} un - {m.propriedadeNome} ({m.justificativa})
                </Text>
            ))}
        </RelatorioLayout>
    );
}

const styles = StyleSheet.create({
    total: { fontWeight: 'bold', fontSize: 16 },
    button: {
        marginVertical: 16,
        borderRadius: 10,
        backgroundColor: '#c8d7d3',
    },
});
