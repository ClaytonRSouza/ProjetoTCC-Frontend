import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { registerSchema } from '../schemas/userSchema';
import { api } from '../services/api';

export default function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senha, setSenha] = useState('');
  const [propriedades, setPropriedades] = useState([{ nome: '' }]);
  const [loading, setLoading] = useState(false);

  //função para adicionar uma nova propriedade
  const adicionarPropriedade = () => setPropriedades([...propriedades, { nome: '' }]);

  //função para atualizar a propriedade
  const atualizarPropriedade = (index: number, nome: string) => {
    const atualizado = [...propriedades];
    atualizado[index].nome = nome;
    setPropriedades(atualizado);
  };

  //Função para cadastrar o usuário
  const handleCadastro = async () => {
    // Validação dos campos
    const parse = registerSchema.safeParse({
      nome,
      email,
      senha,
      propriedades,
    });

    if (!parse.success) {
      const msg = parse.error.issues.map(issue => issue.message).join('\n');
      Alert.alert('Erro', msg);
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
    <SafeAreaView style={styles.container}>
      <CustomAppBar navigation={navigation} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.formContainer]}
          keyboardShouldPersistTaps="handled"
        >

          <Text style={styles.title}>Criar Conta</Text>

          <TextInput label="Nome" value={nome} onChangeText={setNome} style={styles.input} />
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          <TextInput label="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />

          <Text style={styles.subtitle}>Propriedades</Text>
          {propriedades.map((prop, index) => (
            <TextInput
              key={index}
              label={`Propriedade ${index + 1}`}
              value={prop.nome}
              onChangeText={(text) => atualizarPropriedade(index, text.toUpperCase())}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { marginBottom: 16, backgroundColor: '#f0f0f0', borderColor: '#575757', borderWidth: 1 },
  button: { marginBottom: 16, backgroundColor: '#c8d7d3', borderRadius: 10 },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  formContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  }
});
