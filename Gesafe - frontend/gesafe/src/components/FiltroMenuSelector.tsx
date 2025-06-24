import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { IconButton } from 'react-native-paper';

interface Props {
    label: string;
    valores: string[];
    valorSelecionado: string | null;
    onSelecionar: (valor: string | null) => void;
    // Nova propriedade para controlar se a opção nula é permitida
    allowNull?: boolean;
}

export default function FiltroMenuSelector({
    label,
    valores,
    valorSelecionado,
    onSelecionar,
    allowNull = true, // Valor padrão como true para ser compatível com relatórios
}: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.dropdown}>
            <Text style={styles.dropdownLabel}>{label}</Text>

            <TouchableOpacity
                onPress={() => setVisible(true)}
                style={styles.dropdownAnchor}
            >
                <Text style={styles.dropdownText}>
                    {valorSelecionado ? valorSelecionado.replace(/_/g, ' ') : 'Selecionar...'}
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
                            {valores.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={styles.modalItem}
                                    onPress={() => {
                                        onSelecionar(item);
                                        setVisible(false);
                                    }}
                                >
                                    <Text>{item.replace(/_/g, ' ')}</Text>
                                </TouchableOpacity>
                            ))}

                            {/* Renderiza a opção "Nenhum filtro" somente se allowNull for true */}
                            {allowNull && (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        onSelecionar(null);
                                        setVisible(false);
                                    }}
                                >
                                    <Text>Nenhum filtro</Text>
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
        color: '#575757',
        fontWeight: 'bold',
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
