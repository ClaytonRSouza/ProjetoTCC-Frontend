import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import CustomAppBar from './CustomAppBar';

interface Props {
    navigation: any;
    titulo: string;
    filtros: React.ReactNode;
    children: React.ReactNode;
    rodape?: React.ReactNode;
}

export default function RelatorioLayout({ navigation, titulo, filtros, children, rodape }: Props) {
    return (
        <View style={styles.container}>
            <CustomAppBar navigation={navigation} />
            <Text style={styles.title}>{titulo}</Text>
            {filtros}
            <ScrollView style={styles.scroll}>{children}</ScrollView>
            {rodape}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    scroll: { marginTop: 10 },
});
