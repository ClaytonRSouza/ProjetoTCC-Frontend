import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function InitialPageScreen() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Bem-vindo ao Gesafe</Text>

            <Button
                mode="contained"
                onPress={() => navigation.navigate('Login')}
                style={styles.button}
            >
                Entrar
            </Button>

            <Button
                mode="outlined"
                onPress={() => navigation.navigate('Register')}
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
    button: { marginBottom: 16, backgroundColor: '#C8D7D3', textDecorationColor: '#575757' },
});
