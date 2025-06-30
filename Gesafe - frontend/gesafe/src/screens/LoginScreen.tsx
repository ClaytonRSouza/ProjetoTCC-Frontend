import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema } from '../schemas/userSchema';

export default function LoginScreen({ navigation }: any) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    //Função para solicitar reset de senha - em desenvolvimento
    // const [modalVisible, setModalVisible] = useState(false);
    // const [resetEmail, setResetEmail] = useState('');

    //Função para fazer login
    const handleLogin = async () => {
        //Validação dos dados
        const parse = loginSchema.safeParse({ email, senha });

        if (!parse.success) {
            const msg = parse.error.issues.map(issue => issue.message).join('\n');
            Alert.alert('Erro', msg);
            return;
        }

        try {
            setLoading(true);
            await signIn(email, senha);
        } catch (err: any) {
            console.error('Erro ao logar:', err);
            Alert.alert('Erro', 'E-mail ou senha inválidos.');
        } finally {
            setLoading(false);
        }
    };

    //Função para solicitar redefinição de senha - Em desenvolvimento
    // const solicitarResetSenha = async () => {
    //     if (!resetEmail.trim()) {
    //         Alert.alert('Erro', 'Informe um e-mail válido.');
    //         return;
    //     }

    //     try {
    //         await api.post('/auth/solicitar-reset-senha', { email: resetEmail.trim() });
    //         Alert.alert('Sucesso', 'Um link de redefinição foi enviado para seu e-mail.');
    //         setModalVisible(false);
    //     } catch (err: any) {
    //         console.error('Erro ao solicitar redefinição:', err);
    //         Alert.alert('Erro', err.response?.data?.error || 'Erro ao solicitar redefinição de senha.');
    //     }
    // };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Image
                    source={require('../assets/logoApp.png')}
                    style={styles.logo}
                />
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
                    icon="login"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    labelStyle={{ color: '#000', fontWeight: '500', fontSize: 20 }}
                    style={styles.button}
                >
                    Entrar
                </Button>

                <Button
                    labelStyle={{ color: '#575757', fontWeight: 'bold', fontSize: 15 }}
                    onPress={() => navigation.navigate('Register')}
                >
                    Não tem conta? Criar agora
                </Button>


                {/* Reset da senha - Em desenvolvimento*/}
                {/* <Button
                    labelStyle={{ color: '#575757', fontWeight: 'bold', fontSize: 15 }}
                    onPress={() => setModalVisible(true)}
                >
                    Esqueceu a senha?
                </Button> */}

                {/* <Modal visible={modalVisible} transparent>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text>Informe seu e-mail para redefinir a senha</Text>
                            <TextInput
                                placeholder="E-mail"
                                value={resetEmail}
                                onChangeText={setResetEmail}
                                style={styles.modalInput}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Button
                                mode="contained"
                                style={styles.button}
                                labelStyle={{ color: '#000', fontWeight: '500', fontSize: 18 }}
                                onPress={solicitarResetSenha}
                            >
                                Enviar
                            </Button>
                            <Button
                                labelStyle={{ color: '#000', fontWeight: '500', fontSize: 18 }}
                                onPress={() => setModalVisible(false)}
                            >
                                Cancelar
                            </Button>
                        </View>
                    </View>
                </Modal> */}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flexGrow: 1, justifyContent: 'center' },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#28584B',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#f0f0f0',
        borderColor: '#575757',
        borderWidth: 1,
    },
    button: {
        marginVertical: 16,
        borderRadius: 10,
        backgroundColor: '#c8d7d3',
    },
    logo: {
        width: 200,
        height: 180,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 70,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalInput: {
        marginBottom: 16,
        backgroundColor: '#f0f0f0',
        borderColor: '#575757',
        borderWidth: 1,
        marginTop: 8,
    },
});
