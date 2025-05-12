import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import InitialPageScreen from '../screens/InitialPageScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

export type AuthStackParamList = {
    Initial: undefined;
    Login: undefined;
    Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
    return (
        <Stack.Navigator initialRouteName="Initial" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Initial" component={InitialPageScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

