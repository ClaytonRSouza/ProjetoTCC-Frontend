import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { api } from '../services/api';

interface Propriedade {
    id: number;
    nome: string;
}

// Interface para definir as propriedades do componente
interface Props {
    selected: Propriedade | null;
    onSelect: (p: Propriedade | null) => void;
    //propriedade para controlar se a opção nula é permitida
    allowNull?: boolean;
}

export default function FiltroPropriedadeSelector({ selected, onSelect, allowNull = true }: Props) {
    const [visible, setVisible] = useState(false);
    const [propriedades, setPropriedades] = useState<Propriedade[]>([]);

    // Carrega as propriedades do servidor
    useEffect(() => {
        api.get('/auth/propriedades')
            .then(res => setPropriedades(res.data.propriedades))
            .catch(console.error);
    }, []);

    return (
        <View style={styles.dropdown}>
            <Text style={styles.dropdownLabel}>Propriedade</Text>

            <TouchableOpacity
                onPress={() => setVisible(true)}
                style={styles.dropdownAnchor}
            >
                <Text style={styles.dropdownText}>
                    {selected?.nome || 'Selecionar...'}
                </Text>
                <IconButton icon="menu-down" size={20} />
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView>
                            {propriedades.map((p) => (
                                <TouchableOpacity
                                    key={p.id}
                                    style={styles.modalItem}
                                    onPress={() => {
                                        onSelect(p);
                                        setVisible(false);
                                    }}
                                >
                                    <Text>{p.nome}</Text>
                                </TouchableOpacity>
                            ))}

                            {/* Renderiza a opção "TODAS" somente se allowNull for true */}
                            {allowNull && (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        onSelect(null);
                                        setVisible(false);
                                    }}
                                >
                                    <Text>TODAS</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: { marginVertical: 8 },
    dropdownLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    dropdownAnchor: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
        padding: 4,
        borderRadius: 10,
        borderWidth: 1,
    },
    dropdownText: {
        color: '#000',
        fontWeight: '500',
        fontSize: 18
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        maxHeight: '70%',
    },
    modalItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    cancelButton: {
        marginTop: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        color: '#e74c3c',
        fontWeight: '600',
    },
});
