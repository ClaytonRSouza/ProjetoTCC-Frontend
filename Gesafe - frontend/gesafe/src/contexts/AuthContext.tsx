import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api';
import {
    getTokenFromSecureStore,
    removeTokenFromSecureStore,
    saveTokenToSecureStore,
} from '../services/tokenStorage';

//defijne os tipos de dados que serão utilizados no contexto
interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    userName: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    atualizarPerfil: () => Promise<void>;
}

//cria o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    //função para atualizar o perfil do usuário
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = await getTokenFromSecureStore();
                console.log('Token recuperado do SecureStore:', storedToken);

                // Verifica se o token existe
                if (storedToken) {
                    setToken(storedToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    await atualizarPerfil();
                }
            } catch (error) {
                console.error('Erro ao carregar token do SecureStore:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    //verifica se o token existe e atualiza o header da api
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Header Authorization setado com token.');
        } else {
            delete api.defaults.headers.common['Authorization'];
            console.log('Token removido do header.');
        }
    }, [token]);

    //função para realizar o login
    const signIn = async (email: string, senha: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, senha });

            const receivedToken = response.data.token;

            if (!receivedToken) throw new Error('Token ausente da resposta');

            //salva o token no secure store
            await saveTokenToSecureStore(receivedToken);
            setToken(receivedToken);

            //chama função para atualizar perfil
            await atualizarPerfil();

            //chama função para verificar produtos a vencer
            await verificarProdutosAVencer();

            console.log('Login realizado com sucesso. Token salvo.');

        } catch (error: any) {
            console.error('Erro no login:', error?.response?.data || error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    //atualiza o estado do nome do usuário
    const atualizarPerfil = async () => {
        if (!token) return;
        try {
            const res = await api.get('/auth/perfil');
            const nomeAtualizado = res.data.usuario.nome;
            setUserName(nomeAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
        }
    };

    //verifica se existem produtos a vencer
    const verificarProdutosAVencer = async () => {
        try {
            const res = await api.get('/produto/alertas-vencimento');
            const vencidos = res.data.produtos.filter((p: any) => p.vencido).length;
            const proximos = res.data.produtos.length - vencidos;

            if (res.data.produtos.length > 0) {
                Alert.alert(
                    'Atenção!',
                    `Você possui ${proximos} produto(s) próximo(s) do vencimento e ${vencidos} vencido(s).`
                );
            }
        } catch (err) {
            console.error('Erro ao verificar produtos a vencer:', err);
        }
    };

    //função para realizar o logout
    const signOut = async () => {
        try {
            await removeTokenFromSecureStore();
            setToken(null);
            setUserName(null);
            console.log('Token removido. Usuário deslogado.');
        } catch (error) {
            console.error('Erro ao sair:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: !!token,
                isLoading,
                userName,
                signIn,
                signOut,
                atualizarPerfil,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
};
