// src/components/CustomAppBar.tsx
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

interface Props {
    navigation: any;
}

export default function CustomAppBar({ navigation }: Props) {
    const { signOut } = useAuth();

    return (
        <Appbar.Header style={styles.appBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Appbar.BackAction />
            </TouchableOpacity>

            <Image
                source={require('../assets/logoBarra.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Appbar.Action icon="logout" onPress={signOut} />
        </Appbar.Header>
    );
}

const styles = StyleSheet.create({
    appBar: {
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    logo: {
        height: 40,
        width: 100,
        alignSelf: 'center',
    },
});
