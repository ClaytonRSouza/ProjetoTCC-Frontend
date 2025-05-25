import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';

export default function RelatoriosScreen() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />
            <Text style={styles.title}>Emissão de relatórios</Text>

            <Card style={[styles.card, { backgroundColor: '#00FFFF' }]} onPress={() => navigation.navigate('RelatorioEstoque')}>
                <Card.Content>
                    <Text style={styles.cardTitle}>Estoque geral/propriedade</Text>
                    <Text style={styles.cardDesc}>Relatório geral estoque físico{'\n'}produto, data de vencimento e quantidade</Text>
                </Card.Content>
            </Card>

            <Card style={[styles.card, { backgroundColor: '#00FF00' }]} onPress={() => navigation.navigate('RelatorioMovimentacoes')}>
                <Card.Content>
                    <Text style={styles.cardTitle}>Entradas/saídas</Text>
                    <Text style={styles.cardDesc}>Relatório geral das entradas no estoque{'\n'}produto, data de movimentação e quantidade</Text>
                </Card.Content>
            </Card>

            <Card style={[styles.card, { backgroundColor: '#FF3333' }]} onPress={() => navigation.navigate('RelatorioVencimentos')}>
                <Card.Content>
                    <Text style={styles.cardTitle}>Vencimentos</Text>
                    <Text style={styles.cardDesc}>Relatório geral das Baixas do estoque{'\n'}produto, data de movimentação e quantidade</Text>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    card: { borderRadius: 10, marginBottom: 20 },
    cardTitle: { fontWeight: 'bold', fontSize: 18 },
    cardDesc: { fontSize: 14, marginTop: 8 },
});
