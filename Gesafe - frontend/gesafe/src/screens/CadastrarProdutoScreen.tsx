import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  IconButton,
  Menu,
  Text,
  TextInput,
} from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
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
    'PACOTE_500G', 'OUTROS',
  ];

  useEffect(() => {
    const fetchPropriedades = async () => {
      try {
        const response = await api.get('/auth/propriedades');
        setPropriedades(response.data.propriedades);
        if (response.data.propriedades.length > 0) {
          setPropriedadeId(response.data.propriedades[0].id);
        }
      } catch (error) {
        Alert.alert('Erro', 'Erro ao carregar propriedades.');
      }
    };
    fetchPropriedades();
  }, []);

  const handleCadastrar = async () => {
    const quantidadeNum = parseInt(quantidade);

    if (
      !nome.trim() ||
      isNaN(quantidadeNum) ||
      quantidadeNum <= 0 ||
      !validade.trim() ||
      !embalagem ||
      !propriedadeId
    ) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente!');
      return;
    }

    const payload = {
      nome,
      quantidade: quantidadeNum,
      validade,
      embalagem,
      propriedadeId,
    };

    try {
      setLoading(true);
      await api.post('/produto/cadastrar', payload);
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.error || 'Erro ao cadastrar o produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomAppBar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          label="Nome do Produto"
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

        {/* ⬇️ Embalagem */}
        <View style={styles.dropdown}>
          <Text style={styles.dropdownLabel}>Embalagem</Text>
          <Menu
            visible={embalagemMenuVisible}
            onDismiss={() => setEmbalagemMenuVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setEmbalagemMenuVisible(true)}
                style={styles.dropdownAnchor}
              >
                <Text style={styles.dropdownText}>
                  {embalagem ? embalagem.replace(/_/g, ' ') : 'Selecionar...'}
                </Text>
                <IconButton icon="menu-down" size={20} />
              </TouchableOpacity>
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
        </View>

        {/* ⬇️ Propriedade */}
        <View style={styles.dropdown}>
          <Text style={styles.dropdownLabel}>Propriedade</Text>
          <Menu
            visible={propriedadeMenuVisible}
            onDismiss={() => setPropriedadeMenuVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setPropriedadeMenuVisible(true)}
                style={styles.dropdownAnchor}
              >
                <Text style={styles.dropdownText}>
                  {propriedadeId
                    ? propriedades.find((p) => p.id === propriedadeId)?.nome
                    : 'Selecionar...'}
                </Text>
                <IconButton icon="menu-down" size={20} />
              </TouchableOpacity>
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
        </View>

        <Button
          mode="contained"
          onPress={handleCadastrar}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  form: { padding: 20, paddingBottom: 50 },
  input: { marginBottom: 16, backgroundColor: '#fff' },
  dropdown: { marginBottom: 16 },
  dropdownLabel: {
    marginBottom: 4,
    fontSize: 14,
    color: '#555',
  },
  dropdownAnchor: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#c9e3dc',
  },
});
