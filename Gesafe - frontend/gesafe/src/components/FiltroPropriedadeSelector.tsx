import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Menu, Text } from 'react-native-paper';
import { api } from '../services/api';

interface Propriedade {
    id: number;
    nome: string;
}

interface Props {
    selected: Propriedade | null;
    onSelect: (p: Propriedade | null) => void;
}

export default function FiltroPropriedadeSelector({ selected, onSelect }: Props) {
    const [visible, setVisible] = useState(false);
    const [propriedades, setPropriedades] = useState<Propriedade[]>([]);

    useEffect(() => {
        api.get('/auth/propriedades')
            .then(res => setPropriedades(res.data.propriedades))
            .catch(console.error);
    }, []);

    return (
        <View style={styles.dropdown}>
            <Text style={styles.dropdownLabel}>Propriedade</Text>
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                    <TouchableOpacity onPress={() => setVisible(true)} style={styles.dropdownAnchor}>
                        <Text style={styles.dropdownText}>
                            {selected?.nome || 'Selecionar...'}
                        </Text>
                        <IconButton icon="menu-down" size={20} />
                    </TouchableOpacity>
                }
            >
                {propriedades.map((p) => (
                    <Menu.Item
                        key={p.id}
                        title={p.nome}
                        onPress={() => {
                            onSelect(p);
                            setVisible(false);
                        }}
                    />
                ))}
                <Menu.Item title="Todas" onPress={() => { onSelect(null); setVisible(false); }} />
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
