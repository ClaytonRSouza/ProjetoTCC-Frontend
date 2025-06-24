import React from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

interface Props {
    navigation: any;
}

export default function CustomAppBar({ navigation }: Props) {
    const { signOut } = useAuth();

    return (
        <SafeAreaView style={{ backgroundColor: '#f5f5f5' }}>
            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Appbar.BackAction />
                </TouchableOpacity>

                <Image
                    source={require('../assets/logoBarra.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <View style={{ width: 50, height: 50 }}></View>
                {/* <Appbar.Action icon="logout" onPress={signOut} /> */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    appBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 18,
        backgroundColor: '#f5f5f5',
    },
    logo: {
        height: 40,
        width: 100,
        alignSelf: 'center',
    },
});
