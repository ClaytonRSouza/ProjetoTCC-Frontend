import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import FiltroMenuSelector from '../components/FiltroMenuSelector';
import FiltroPropriedadeSelector from '../components/FiltroPropriedadeSelector';
import RelatorioLayout from '../components/RelatorioLayout';
import { api } from '../services/api';
import { gerarPdfRelatorio } from '../utils/gerarPdfRelatorio';

export default function RelatorioVencimentosScreen({ navigation }: any) {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [selectedPropriedade, setSelectedPropriedade] = useState<any | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>("TODOS");

    const status = ["TODOS", "VENCIDO", "A VENCER"];

    useEffect(() => {
        fetchProdutos();
    }, [selectedPropriedade, selectedStatus]);

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

    const handleGerarPDF = () => {
        const dadosFormatados = produtos.flatMap((p) =>
            p.propriedades.map((prop: any) => ({
                propriedade: prop.propriedade,
                produto: p.nome,
                embalagem: p.embalagem.replace(/_/g, ' '),
                quantidade: prop.quantidade,
                validade: p.validade,
            }))
        );

        gerarPdfRelatorio("Relatório de Vencimentos", dadosFormatados);
    };

    return (
        <RelatorioLayout
            navigation={navigation}
            titulo="Relatório de Produtos Vencidos/A Vencer"
            filtros={
                <>
                    <FiltroPropriedadeSelector selected={selectedPropriedade} onSelect={setSelectedPropriedade} />
                    <FiltroMenuSelector
                        label="Status"
                        valores={status}
                        valorSelecionado={selectedStatus}
                        onSelecionar={setSelectedStatus}
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
            {produtos.map((p, i) => (
                <Text key={i}>
                    {p.nome} - {p.embalagem.replace(/_/g, ' ')} - {p.validade} - {p.vencido ? 'VENCIDO' : 'A VENCER'} - {p.propriedades.map((e: any) => e.propriedade + ' (' + e.quantidade + 'un)').join(', ')}
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
