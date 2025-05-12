import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import {
    getTokenFromSecureStore,
    removeTokenFromSecureStore,
    saveTokenToSecureStore,
} from '../services/tokenStorage';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Inicializa token salvo
    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await getTokenFromSecureStore();
                if (storedToken) {
                    setToken(storedToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                }
            } catch (error) {
                console.error('Erro ao carregar token:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    // Atualiza header se token mudar
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const signIn = async (email: string, senha: string) => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/login', { email, senha });
            const receivedToken = response.data.token;

            if (response.status === 200 && receivedToken) {
                await saveTokenToSecureStore(receivedToken);
                setToken(receivedToken);
            } else {
                throw new Error('Token não encontrado na resposta');
            }
        } catch (error: any) {
            console.error('Erro no login:', error.response ? error.response.data : error.message);
            throw error;  // Lança o erro para que o componente que chamou a função saiba do problema
        } finally {
            setIsLoading(false);
        }
    };


    const signOut = async () => {
        await removeTokenFromSecureStore();
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: !!token,
                isLoading,
                signIn,
                signOut,
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
