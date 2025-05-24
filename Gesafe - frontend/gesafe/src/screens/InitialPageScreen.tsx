import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function InitialPageScreen() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>

            <Image source={require('../assets/logoApp.png')} style={styles.logo} />

            <Text style={styles.title}>Seja bem vindo!</Text>

            <Button
                mode="elevated"
                icon="login"
                onPress={() => navigation.navigate('Login')}
                labelStyle={{ color: '#575757', fontWeight: '500', fontSize: 20 }}
                style={styles.button}
            >
                Entrar
            </Button>

            <Button
                mode="elevated"
                icon="account-plus"
                onPress={() => navigation.navigate('Register')}
                labelStyle={{ color: '#575757', fontWeight: '500', fontSize: 20 }}
                style={styles.button}
            >
                Criar Conta
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#28584B' },
    button: { marginBottom: 16, backgroundColor: '#C8D7D3', borderRadius: 10 },
    logo: { width: 180, height: 160, alignSelf: 'center', marginTop: 10, marginBottom: 70 },
});
