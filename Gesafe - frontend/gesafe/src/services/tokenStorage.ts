import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_auth_token_gesafe';

//função para salvar e recuperar o token do SecureStore
export const saveTokenToSecureStore = async (token: string): Promise<void> => {
    try {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
        console.error('Error saving token to SecureStore', error);
        // Você pode querer lançar o erro para que o chamador possa lidar com ele
        throw error;
    }
};

//função para recuperar o token do SecureStore
export const getTokenFromSecureStore = async (): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error('Error getting token from SecureStore', error);
        return null;
    }
};

//função para remover o token do SecureStore
export const removeTokenFromSecureStore = async (): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error('Error removing token from SecureStore', error);
        // Você pode querer lançar o erro
        throw error;
    }
};