import { Alert } from 'react-native';

export function showAlert(titulo: string, mensagem: string): Promise<void> {
    return new Promise((resolve) => {
        Alert.alert(titulo, mensagem, [{ text: 'OK', onPress: () => resolve() }], { cancelable: false });
    });
}

