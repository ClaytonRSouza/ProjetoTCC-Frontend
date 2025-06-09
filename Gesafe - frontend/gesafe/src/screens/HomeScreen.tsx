import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Appbar, Card, Menu, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { signOut, userName } = useAuth();
    const { atualizarPerfil } = useAuth();
    const isFocused = useIsFocused();
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        if (isFocused) {
            atualizarPerfil();
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appBar}>
                <View style={{ width: 70, height: 70 }}></View>

                <Image
                    source={require('../assets/logoBarra.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Menu
                    visible={menuVisible}
                    onDismiss={() => setMenuVisible(false)}
                    anchor={
                        <Appbar.Action
                            icon="account-circle"
                            size={35}
                            onPress={() => setMenuVisible(true)}
                        />
                    }
                >
                    <Menu.Item
                        onPress={() => {
                            setMenuVisible(false);
                            navigation.navigate('EditarPerfil');
                        }}
                        title="Editar Perfil"
                        leadingIcon="account-edit"
                    />
                    <Menu.Item
                        onPress={() => {
                            setMenuVisible(false);
                            signOut();
                        }}
                        title="Sair"
                        leadingIcon="logout"
                    />
                </Menu>
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

                <Card style={styles.optionCard} onPress={() => navigation.navigate('ProdutosVencimento')}>
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

                <Card style={styles.optionCard} onPress={() => navigation.navigate('CadastrarPropriedade')}>
                    <Card.Content style={styles.cardContent}>
                        <Image source={require('../assets/ic_propriedade.png')} style={styles.icon} />
                        <Text style={styles.optionText}>Propriedades</Text>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    appBar: { backgroundColor: '#f5f5f5', justifyContent: 'space-between' },
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
        gap: 10,
        marginTop: 10
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
    icon: { width: 45, height: 45, marginBottom: 8, marginTop: 8, resizeMode: 'contain' },
    optionText: { fontSize: 16, color: '#144734', fontWeight: '600' },
});
