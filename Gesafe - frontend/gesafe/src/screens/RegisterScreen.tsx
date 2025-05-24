import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { api } from '../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [propriedades, setPropriedades] = useState([{ nome: '' }]);
  const [loading, setLoading] = useState(false);

  const adicionarPropriedade = () => setPropriedades([...propriedades, { nome: '' }]);

  const atualizarPropriedade = (index: number, nome: string) => {
    const atualizado = [...propriedades];
    atualizado[index].nome = nome;
    setPropriedades(atualizado);
  };

  const handleCadastro = async () => {
    if (!nome || !email || !senha || propriedades.some(p => !p.nome)) {
      Alert.alert('Erro', 'Preencha todos os campos e ao menos uma propriedade.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/register', {
        nome,
        email,
        senha,
        propriedade: propriedades,
      });
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput label="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />

      <Text style={styles.subtitle}>Propriedades</Text>
      {propriedades.map((prop, index) => (
        <TextInput
          key={index}
          label={`Propriedade ${index + 1}`}
          value={prop.nome}
          onChangeText={(text) => atualizarPropriedade(index, text)}
          style={styles.input}
        />
      ))}

      <Button
        mode="outlined"
        icon='plus-circle-outline'
        onPress={adicionarPropriedade}
        labelStyle={{ color: '#575757', fontWeight: '500', fontSize: 20 }}
        style={styles.button}
      >
        Adicionar Propriedade
      </Button>

      <Button
        mode="elevated"
        icon='content-save-outline'
        onPress={handleCadastro}
        loading={loading}
        disabled={loading}
        labelStyle={{ color: '#575757', fontWeight: '500', fontSize: 20 }}
        style={styles.button}
      >
        Cadastrar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { marginBottom: 16, backgroundColor: '#f0f0f0', borderColor: '#575757', borderWidth: 1 },
  button: { marginBottom: 16, backgroundColor: '#c8d7d3', borderRadius: 10 },
});
