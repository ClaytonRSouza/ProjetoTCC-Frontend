import axios from 'axios';
import { getTokenFromSecureStore } from './tokenStorage';

export const api = axios.create({
    baseURL: "http://192.168.1.105:3000",
    timeout: 5000,
});

api.interceptors.request.use(
    async (config) => {
        const token = await getTokenFromSecureStore();
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
