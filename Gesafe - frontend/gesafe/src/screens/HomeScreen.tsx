import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Card, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { signOut, userName } = useAuth();

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Appbar.BackAction />
                </TouchableOpacity>

                <Image
                    source={require('../assets/logoBarra.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Appbar.Action icon="logout" onPress={signOut} />
            </Appbar.Header>

            <Text style={styles.greeting}>
                Olá, <Text style={styles.bold}>{userName || 'Usuário'}</Text>
            </Text>

            <View style={styles.optionsContainer}>
                <Card style={styles.optionCard} onPress={() => navigation.navigate('Produtos')}>
                    <Card.Content style={styles.cardContent}>
                        <Image source={require('../assets/ic_produtos.png')} style={styles.icon} />
                        <Text style={styles.optionText}>Produtos</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.optionCard} onPress={() => navigation.navigate('Movimentacoes')}>
                    <Card.Content style={styles.cardContent}>
                        <Image source={require('../assets/ic_movimentacoes.png')} style={styles.icon} />
                        <Text style={styles.optionText}>Movimentações</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.optionCard} onPress={() => navigation.navigate('Vencimentos')}>
                    <Card.Content style={styles.cardContent}>
                        <Image source={require('../assets/ic_vencimentos.png')} style={styles.icon} />
                        <Text style={styles.optionText}>Vencimentos</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.optionCard} onPress={() => navigation.navigate('Relatorios')}>
                    <Card.Content style={styles.cardContent}>
                        <Image source={require('../assets/ic_relatorios.png')} style={styles.icon} />
                        <Text style={styles.optionText}>Relatórios</Text>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    appBar: { backgroundColor: 'white', justifyContent: 'space-between' },
    logo: { height: 40, width: 100, alignSelf: 'center' },
    greeting: {
        fontSize: 24,
        margin: 24,
        color: '#333',
    },
    bold: { fontWeight: 'bold' },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    optionCard: {
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
        marginBottom: 16,
        width: '40%',
        height: 120,
        justifyContent: 'center',
    },
    cardContent: { alignItems: 'center', justifyContent: 'center' },
    icon: { width: 40, height: 40, marginBottom: 8 },
    optionText: { fontSize: 16, color: '#144734', fontWeight: '500' },
});
