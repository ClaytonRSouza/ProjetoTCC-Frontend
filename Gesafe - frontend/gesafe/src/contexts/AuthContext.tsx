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
    userName: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
            const receivedName = response.data.nome;

            if (response.status === 200 && receivedToken) {
                await saveTokenToSecureStore(receivedToken);
                setToken(receivedToken);
                setUserName(receivedName || null);
            } else {
                throw new Error('Token não encontrado na resposta');
            }
        } catch (error: any) {
            console.error('Erro no login:', error.response ? error.response.data : error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        await removeTokenFromSecureStore();
        setToken(null);
        setUserName(null);
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
