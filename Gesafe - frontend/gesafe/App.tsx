import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

//Componente principal da aplicação
export default function App() {
    return (
        //provider do react native paper
        <PaperProvider>
            {/* provider que gerencia o estado de autenticação*/}
            <AuthProvider>
                {/* container de navegação que engloba toda estrutura de rotas*/}
                <NavigationContainer>
                    {/* renderiza o fluxo de nabegação baseado no estado de login (AppStack ou AuthStack)*/}
                    <RootNavigator />
                </NavigationContainer>
            </AuthProvider>
        </PaperProvider>
    );
}
