import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Menu, Text } from 'react-native-paper';

interface Props {
    label: string;
    valores: string[];
    valorSelecionado: string | null;
    onSelecionar: (valor: string | null) => void;
}

export default function FiltroMenuSelector({
    label,
    valores,
    valorSelecionado,
    onSelecionar,
}: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.dropdown}>
            <Text style={styles.dropdownLabel}>{label}</Text>
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                    <TouchableOpacity onPress={() => setVisible(true)} style={styles.dropdownAnchor}>
                        <Text style={styles.dropdownText}>
                            {valorSelecionado ? valorSelecionado.replace(/_/g, ' ') : 'Selecionar...'}
                        </Text>
                        <IconButton icon="menu-down" size={20} />
                    </TouchableOpacity>
                }
            >
                {valores.map((item) => (
                    <Menu.Item
                        key={item}
                        onPress={() => {
                            onSelecionar(item);
                            setVisible(false);
                        }}
                        title={item.replace(/_/g, ' ')}
                    />
                ))}
                <Menu.Item
                    title="Todas"
                    onPress={() => {
                        onSelecionar(null);
                        setVisible(false);
                    }}
                />
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: { marginVertical: 8 },
    dropdownLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    dropdownAnchor: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 8,
    },
    dropdownText: { flex: 1, fontSize: 16 },
});
