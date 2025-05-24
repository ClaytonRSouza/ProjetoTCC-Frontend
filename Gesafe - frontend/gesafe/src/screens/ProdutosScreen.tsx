import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert, FlatList, Modal, TextInput as RNTextInput, StyleSheet, View
} from 'react-native';
import {
  ActivityIndicator, Button, IconButton, Menu, Text
} from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface Produto {
  idEstoque: number;
  idProduto: number;
  nome: string;
  validade: string;
  quantidade: number;
  embalagem: string;
  movimentacaoId: number | null;
}

interface Propriedade {
  id: number;
  nome: string;
}

export default function ProdutosScreen() {
  const { token } = useAuth();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [selectedPropriedade, setSelectedPropriedade] = useState<Propriedade | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editValidade, setEditValidade] = useState('');
  const [editEmbalagem, setEditEmbalagem] = useState('');
  const embalagens = [
    'SACARIA', 'BAG_1TN', 'BAG_750KG', 'LITRO', 'GALAO_2L', 'GALAO_5L',
    'GALAO_10L', 'BALDE_20L', 'TAMBOR_200L', 'IBC_1000L',
    'PACOTE_1KG', 'PACOTE_5KG', 'PACOTE_10KG', 'PACOTE_15KG',
    'PACOTE_500G', 'OUTROS'
  ];

  const [desativarModalVisible, setDesativarModalVisible] = useState(false);
  const [produtoDesativando, setProdutoDesativando] = useState<Produto | null>(null);
  const [justificativa, setJustificativa] = useState('');

  useEffect(() => {
    const fetchPropriedades = async () => {
      try {
        const res = await api.get('/auth/propriedades');
        setPropriedades(res.data.propriedades);
        if (res.data.propriedades.length > 0) {
          setSelectedPropriedade(res.data.propriedades[0]);
        }
      } catch (err) {
        console.error('Erro ao buscar propriedades:', err);
      }
    };
    fetchPropriedades();
  }, []);

  useEffect(() => {
    atualizarProdutos();
  }, [selectedPropriedade]);

  const atualizarProdutos = async () => {
    if (!selectedPropriedade) return;
    try {
      setLoading(true);
      const res = await api.get(`/produto/${selectedPropriedade.id}`);
      setProdutos(res.data.produtos);
    } catch (err) {
      console.error('Erro ao atualizar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  const realizarSaida = async (produto: Produto) => {
    try {
      await api.post('/produto/saida', {
        produtoId: produto.idProduto,
        propriedadeId: selectedPropriedade?.id,
        quantidade: 1
      });
      Alert.alert('Sucesso', 'Saída registrada!');
      atualizarProdutos();
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao registrar saída');
    }
  };

  const abrirEditar = (produto: Produto) => {
    setProdutoEditando(produto);
    setEditNome(produto.nome);
    setEditValidade(produto.validade);
    setEditEmbalagem(produto.embalagem);
    setEditModalVisible(true);
  };

  const confirmarEditar = async () => {
    if (!produtoEditando) return;
    try {
      await api.put(`/produto/${selectedPropriedade?.id}/${produtoEditando.idProduto}`, {
        nome: editNome,
        validade: editValidade,
        embalagem: editEmbalagem
      });
      Alert.alert('Sucesso', 'Produto editado!');
      atualizarProdutos();
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao editar produto');
    } finally {
      setEditModalVisible(false);
    }
  };

  const abrirModalDesativar = (produto: Produto) => {
    setProdutoDesativando(produto);
    setJustificativa('');
    setDesativarModalVisible(true);
  };

  const confirmarDesativacao = async () => {
    if (!produtoDesativando) return;

    if (!justificativa.trim()) {
      Alert.alert('Erro', 'Informe uma justificativa!');
      return;
    }

    try {
      await api.patch(`/produto/movimentacao/${produtoDesativando.movimentacaoId}/${selectedPropriedade?.id}`, {
        justificativa
      });
      Alert.alert('Sucesso', 'Produto desativado!');
      atualizarProdutos();
    } catch (err: any) {
      console.error('Erro ao desativar produto:', err);
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao desativar produto');
    } finally {
      setDesativarModalVisible(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      atualizarProdutos();
    }
  }, [isFocused, selectedPropriedade]);

  return (
    <View style={styles.container}>
      <CustomAppBar navigation={navigation} />

      <View style={styles.selectorWrapper}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              icon="chevron-down"
              contentStyle={{ flexDirection: 'row-reverse' }}
              onPress={() => setMenuVisible(true)}
              labelStyle={{ color: '#575757', fontWeight: 'bold', fontSize: 18 }}
              style={styles.selectorButton}
            >
              {selectedPropriedade?.nome || 'Selecionar propriedade'}
            </Button>
          }
        >
          {propriedades.map((p) => (
            <Menu.Item
              key={p.id}
              onPress={() => {
                setSelectedPropriedade(p);
                setMenuVisible(false);
              }}
              title={p.nome}
            />
          ))}
        </Menu>
      </View>


      <Button
        mode="elevated"
        icon='plus-circle-outline'
        labelStyle={{ color: '#575757', fontWeight: '500', fontSize: 18 }}
        style={styles.addButton}
        onPress={() => navigation.navigate('CadastrarProduto')}
      >
        Adicionar novo produto
      </Button>

      {loading ? (
        <ActivityIndicator animating style={styles.loader} />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.idEstoque.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemLabel}>Produto</Text>
                <Text>{item.nome}</Text>
                <Text style={styles.itemLabel}>Vencimento</Text>
                <Text>{item.validade}</Text>
                <Text style={styles.itemLabel}>Quantidade</Text>
                <Text>{item.quantidade}</Text>
              </View>
              <View style={styles.actions}>
                <IconButton icon="pencil" onPress={() => abrirEditar(item)} />
                <IconButton icon="close" onPress={() => abrirModalDesativar(item)} />
                <IconButton icon="arrow-right" onPress={() => realizarSaida(item)} />
              </View>
            </View>
          )}
        />
      )}

      {/* Modal Editar */}
      <Modal visible={editModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Editar Produto</Text>
            <RNTextInput
              placeholder="Nome"
              value={editNome}
              onChangeText={setEditNome}
              style={styles.modalInput}
            />
            <RNTextInput
              placeholder="Validade (DD/MM/AAAA)"
              value={editValidade}
              onChangeText={setEditValidade}
              style={styles.modalInput}
            />
            <RNTextInput
              placeholder="Embalagem"
              value={editEmbalagem}
              onChangeText={setEditEmbalagem}
              style={styles.modalInput}
            />
            <Button mode="contained" onPress={confirmarEditar}>
              Confirmar
            </Button>
            <Button onPress={() => setEditModalVisible(false)}>Cancelar</Button>
          </View>
        </View>
      </Modal>

      {/* Modal Desativar */}
      <Modal visible={desativarModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Justificativa da Desativação</Text>
            <RNTextInput
              placeholder="Descreva o motivo"
              value={justificativa}
              onChangeText={setJustificativa}
              style={styles.modalInput}
              multiline
            />
            <Button mode="contained" onPress={confirmarDesativacao}>
              Confirmar
            </Button>
            <Button onPress={() => setDesativarModalVisible(false)}>Cancelar</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
  selectorWrapper: { marginTop: 12, marginBottom: 8 },
  selectorButton: { borderRadius: 6, borderColor: '#144734', width: '100%' },
  addButton: { marginVertical: 16, borderRadius: 10, backgroundColor: '#c8d7d3' },
  loader: { flex: 1, justifyContent: 'center' },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemInfo: { flex: 1, paddingRight: 8 },
  itemLabel: { fontWeight: 'bold', fontSize: 12, color: '#555', marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalInput: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 12, padding: 8 }
});
