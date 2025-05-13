import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Menu, Provider as PaperProvider } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export default function CadastrarProdutoScreen({ navigation }: any) {
  const { token } = useAuth();

  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [validade, setValidade] = useState('');
  const [embalagem, setEmbalagem] = useState('');
  const [propriedadeId, setPropriedadeId] = useState<number | null>(null);
  const [propriedades, setPropriedades] = useState<{ id: number; nome: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [embalagemMenuVisible, setEmbalagemMenuVisible] = useState(false);
  const [propriedadeMenuVisible, setPropriedadeMenuVisible] = useState(false);

  const embalagens = [
    'SACARIA', 'BAG_1TN', 'BAG_750KG', 'LITRO', 'GALAO_2L', 'GALAO_5L',
    'GALAO_10L', 'BALDE_20L', 'TAMBOR_200L', 'IBC_1000L',
    'PACOTE_1KG', 'PACOTE_5KG', 'PACOTE_10KG', 'PACOTE_15KG',
    'PACOTE_500G', 'OUTROS'
  ];

  useEffect(() => {
    const fetchPropriedades = async () => {
      try {
        const response = await api.get('/auth/propriedades');
        setPropriedades(response.data.propriedades);
      } catch (error) {
        console.error('Erro ao carregar propriedades', error);
      }
    };
    fetchPropriedades();
  }, []);

  const handleCadastrar = async () => {
    if (!nome || !quantidade || !validade || !embalagem || !propriedadeId) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const payload = {
      nome,
      quantidade: parseInt(quantidade),
      validade,
      embalagem,
      propriedadeId
    };

    try {
      setLoading(true);
      await api.post('/produto/cadastrar', payload);
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>

        <Text style={styles.title}>Cadastro de produtos</Text>

        <TextInput
          label="Descrição"
          mode="outlined"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        <TextInput
          label="Quantidade"
          mode="outlined"
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
          style={styles.input}
        />

        <TextInput
          label="Validade (DD/MM/AAAA)"
          mode="outlined"
          value={validade}
          onChangeText={setValidade}
          style={styles.input}
        />

        <Menu
          visible={embalagemMenuVisible}
          onDismiss={() => setEmbalagemMenuVisible(false)}
          anchor={
            <TextInput
              label="Embalagem"
              mode="outlined"
              value={embalagem.replace(/_/g, ' ')}
              onFocus={() => setEmbalagemMenuVisible(true)}
              style={styles.input}
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
            />
          }
        >
          {embalagens.map((item) => (
            <Menu.Item
              key={item}
              onPress={() => {
                setEmbalagem(item);
                setEmbalagemMenuVisible(false);
              }}
              title={item.replace(/_/g, ' ')}
            />
          ))}
        </Menu>

        <Menu
          visible={propriedadeMenuVisible}
          onDismiss={() => setPropriedadeMenuVisible(false)}
          anchor={
            <TextInput
              label="Propriedade"
              mode="outlined"
              value={
                propriedadeId
                  ? propriedades.find((p) => p.id === propriedadeId)?.nome || ''
                  : ''
              }
              onFocus={() => setPropriedadeMenuVisible(true)}
              style={styles.input}
              editable={false}
              right={<TextInput.Icon icon="menu-down" />}
            />
          }
        >
          {propriedades.map((item) => (
            <Menu.Item
              key={item.id}
              onPress={() => {
                setPropriedadeId(item.id);
                setPropriedadeMenuVisible(false);
              }}
              title={item.nome}
            />
          ))}
        </Menu>

        <Button
          mode="contained"
          onPress={handleCadastrar}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  button: {
    marginTop: 10,
    backgroundColor: '#c9e3dc',
    borderRadius: 10
  }
});
