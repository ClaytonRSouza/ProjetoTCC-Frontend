import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { useAuth } from '../contexts/AuthContext';
import { editarPerfilSchema } from '../schemas/userSchema';
import { api } from '../services/api';


export default function EditarPerfilScreen({ navigation }: any) {
    const { atualizarPerfil } = useAuth(); //Função para atualizar o perfil após a edição
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPerfil();
    }, []);

    //Função para buscar os dados do perfil
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

    //Função para atualizar os dados perfil
    const handleSalvar = async () => {
        //Validação dos dados
        const parse = editarPerfilSchema.safeParse({ nome, email });

        if (!parse.success) {
            const msg = parse.error.issues.map(issue => issue.message).join('\n');
            Alert.alert('Erro', msg);
            return;
        }


        try {
            //Atualização dos dados do perfil
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
                icon={'content-save'}
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
