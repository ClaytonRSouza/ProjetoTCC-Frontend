import React, { useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: any) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        try {
            setLoading(true);
            await signIn(email, senha);
            // Navegação controlada via RootNavigator (isAuthenticated)
        } catch (err: any) {
            console.error('Erro ao logar:', err);
            Alert.alert('Erro', 'E-mail ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/logoApp.png')} style={styles.logo} />
            <Text style={styles.title}>Entrar no Gesafe</Text>

            <TextInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                label="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                style={styles.input}
            />

            <Button
                mode="elevated"
                icon='login'
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                labelStyle={{ color: '#575757', fontWeight: '500', fontSize: 20 }}
                style={styles.button}
            >
                Entrar
            </Button>

            <Button onPress={() => navigation.navigate('Register')}>
                Não tem conta? Criar agora
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#28584B' },
    input: { marginBottom: 16, backgroundColor: '#f0f0f0', borderColor: '#575757', borderWidth: 1 },
    button: { marginBottom: 16, backgroundColor: '#c8d7d3', borderRadius: 10 },
    logo: { width: 180, height: 160, alignSelf: 'center', marginTop: 10, marginBottom: 70 },
});
