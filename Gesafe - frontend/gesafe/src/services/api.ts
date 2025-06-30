import axios from 'axios';
import { getTokenFromSecureStore } from './tokenStorage';

//Cria uma instância do Axios com configurações padrão da API
export const api = axios.create({
    baseURL: "http://192.168.1.106:3000",
    timeout: 5000,
});

//Interceptor que adiciona o token JWT no cabeçalho Authorization antes de cada requisição
api.interceptors.request.use(
    async (config) => {
        ///Obtém o token JWT do armazenamento seguro
        const token = await getTokenFromSecureStore();

        //Se existir o token e o header ainda não estiver definido, adiciona o Bearer token
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
