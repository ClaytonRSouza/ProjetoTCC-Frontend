import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';


export default function EditarPerfilScreen({ navigation }: any) {
    const { token } = useAuth();
    const { atualizarPerfil } = useAuth();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPerfil();
    }, []);

    const fetchPerfil = async () => {
        try {
            const res = await api.get('/auth/perfil');
            setNome(res.data.usuario.nome);
            setEmail(res.data.usuario.email);
        } catch (err) {
            console.error('Erro ao buscar perfil:', err);
            Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
        }
    };

    const validarEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSalvar = async () => {
        if (!nome || !email) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        if (!validarEmail(email)) {
            setEmailError('O email deve ser válido');
            return;
        }

        try {
            setLoading(true);
            await api.put('/auth/perfil', { nome, email });
            await atualizarPerfil();
            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            navigation.goBack();
        } catch (err: any) {
            console.error('Erro ao atualizar perfil:', err);
            Alert.alert('Erro', err.response?.data?.error || 'Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />

            <Text style={styles.title}>Editar Perfil</Text>

            <TextInput
                label="Nome"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                error={!!emailError}
            />
            {emailError ? <Text style={styles.error}>{emailError}</Text> : null}


            <Button
                mode="contained"
                labelStyle={{ color: '#000', fontWeight: '500', fontSize: 18 }}
                onPress={handleSalvar}
                loading={loading}
                disabled={loading}
                style={styles.button}
            >
                Salvar
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { marginBottom: 16, backgroundColor: '#fff' },
    button: { marginVertical: 16, borderRadius: 10, backgroundColor: '#c8d7d3' },
    error: {
        color: 'red',
        marginBottom: 10,
        fontSize: 14,
    },
});
