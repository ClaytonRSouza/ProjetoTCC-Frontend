import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { api } from '../services/api';

export default function CadastrarPropriedadeScreen() {
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();

    const handleCadastrar = async () => {
        if (!nome.trim()) {
            Alert.alert('Erro', 'Informe o nome da propriedade.');
            return;
        }

        try {
            setLoading(true);
            await api.post('/auth/propriedade', { nome });
            Alert.alert('Sucesso', 'Propriedade cadastrada com sucesso!');
            navigation.goBack();
        } catch (error: any) {
            console.error('Erro ao cadastrar propriedade:', error);
            Alert.alert('Erro', error.response?.data?.error || 'Erro ao cadastrar propriedade');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />
            <View style={styles.form}>
                <Text style={styles.title}>Nova Propriedade</Text>
                <TextInput
                    label="Nome da Propriedade"
                    mode="outlined"
                    value={nome}
                    onChangeText={(text) => setNome(text.toUpperCase())}
                    style={styles.input}
                />
                <Button
                    mode="elevated"
                    icon='content-save-outline'
                    onPress={handleCadastrar}
                    loading={loading}
                    disabled={loading}
                    labelStyle={{ color: '#575757', fontWeight: '500', fontSize: 20 }}
                    style={styles.button}
                >
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
    form: { padding: 10, paddingTop: 40 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    input: { marginBottom: 16, backgroundColor: '#fff' },
    button: { marginTop: 10, backgroundColor: '#c8d7d3', borderRadius: 10 },
});
