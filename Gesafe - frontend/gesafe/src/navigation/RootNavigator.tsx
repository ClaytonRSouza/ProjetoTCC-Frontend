import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default function RootNavigator() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size="large" color="#22c55e" />
            </View>
        );
    }

    return isAuthenticated ? <AppStack /> : <AuthStack />;
}
