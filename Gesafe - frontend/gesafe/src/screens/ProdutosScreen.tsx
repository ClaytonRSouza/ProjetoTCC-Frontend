import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert, FlatList, Modal, TextInput as RNTextInput, ScrollView, StyleSheet, TouchableOpacity, View
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

  const [saidaModalVisible, setSaidaModalVisible] = useState(false);
  const [produtoSaida, setProdutoSaida] = useState<Produto | null>(null);
  const [quantidadeSaida, setQuantidadeSaida] = useState('');

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editValidade, setEditValidade] = useState('');
  const [editEmbalagem, setEditEmbalagem] = useState('');
  const [embalagemMenuVisible, setEmbalagemMenuVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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

  const abrirModalSaida = (produto: Produto) => {
    setProdutoSaida(produto);
    setQuantidadeSaida('');
    setSaidaModalVisible(true);
  };

  const confirmarSaida = async () => {
    if (!produtoSaida) return;

    const qtd = parseInt(quantidadeSaida);
    if (isNaN(qtd) || qtd <= 0) {
      Alert.alert('Erro', 'Informe uma quantidade válida!');
      return;
    }

    if (qtd > produtoSaida.quantidade) {
      Alert.alert('Erro', 'Quantidade superior ao disponível!');
      return;
    }

    try {
      await api.post('/produto/saida', {
        produtoId: produtoSaida.idProduto,
        propriedadeId: selectedPropriedade?.id,
        quantidade: qtd
      });
      Alert.alert('Sucesso', 'Saída registrada!');
      atualizarProdutos();
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao registrar saída');
    } finally {
      setSaidaModalVisible(false);
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
        labelStyle={{ color: '#000', fontWeight: '500', fontSize: 18 }}
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
                <Text style={styles.itemLabel}>Produto </Text>
                <Text style={styles.itemProduct}>{item.nome.toUpperCase()} - {item.embalagem.replace(/_/g, ' ')}</Text>
                <Text style={styles.itemLabel}>Vencimento</Text>
                <Text style={styles.itemProduct}>{item.validade}</Text>
                <Text style={styles.itemLabel}>Quantidade</Text>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{item.quantidade}</Text>
              </View>
              <View style={styles.actions}>
                <IconButton icon="pencil" size={30} onPress={() => abrirEditar(item)} />
                <IconButton icon="close" mode='outlined' size={30} iconColor='red' onPress={() => abrirModalDesativar(item)} />
                <IconButton icon="arrow-right" mode='contained-tonal' size={30} iconColor='green' onPress={() => abrirModalSaida(item)} />
              </View>
            </View>
          )}
        />
      )}

      {/* modal de edição*/}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Produto</Text>

            <RNTextInput
              placeholder="Nome do Produto"
              value={editNome}
              onChangeText={(text) => setEditNome(text.toUpperCase())}
              style={styles.modalInput}
            />

            <RNTextInput
              placeholder="Validade"
              keyboardType="numeric"
              value={editValidade}
              onChangeText={(text) => {
                const digits = text.replace(/[^\d]/g, '');
                if (/^\d{6}$/.test(digits)) {
                  const mes = parseInt(digits.substring(0, 2));
                  const ano = parseInt(digits.substring(2));
                  const lastDay = new Date(ano, mes, 0).getDate();
                  setEditValidade(`${String(lastDay).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`);
                } else if (/^\d{8}$/.test(digits)) {
                  const dia = digits.substring(0, 2);
                  const mes = digits.substring(2, 4);
                  const ano = digits.substring(4);
                  setEditValidade(`${dia}/${mes}/${ano}`);
                } else {
                  setEditValidade(text);
                }
              }}
              style={styles.modalInput}
            />

            {/* menu das embalagens*/}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ marginBottom: 6, fontWeight: 'bold', color: '#555' }}>Embalagem</Text>
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                style={styles.dropdownAnchor}
              >
                <Text style={styles.dropdownText}>
                  {editEmbalagem ? editEmbalagem.replace(/_/g, ' ') : 'Selecionar...'}
                </Text>
                <IconButton icon={showDropdown ? "menu-up" : "menu-down"} size={20} />
              </TouchableOpacity>

              {showDropdown && (
                <ScrollView
                  style={styles.dropdownList}
                  nestedScrollEnabled
                  contentContainerStyle={{ paddingVertical: 6 }}
                >
                  {embalagens.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        setEditEmbalagem(item);
                        setShowDropdown(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownText}>{item.replace(/_/g, ' ')}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

              )}
            </View>

            <View>
              <Button
                mode="contained"
                labelStyle={{ color: '#000', fontWeight: '500', fontSize: 18 }}
                style={[styles.addButton]}
                onPress={confirmarEditar}
              >
                Confirmar
              </Button>
              <Button
                labelStyle={{ color: '#000', fontWeight: '500', fontSize: 18 }}
                onPress={() => setEditModalVisible(false)}
              >
                Cancelar
              </Button>
            </View>
          </View>
        </View>
      </Modal>


      {/* modal de desativação*/}
      <Modal visible={desativarModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 15, fontWeight: 700 }}>Justificativa da Desativação</Text>
            <RNTextInput
              placeholder="Descreva o motivo"
              value={justificativa}
              onChangeText={setJustificativa}
              style={styles.modalInput}
              multiline
            />
            <Button
              mode="contained"
              labelStyle={{ color: '#000', fontWeight: '500', fontSize: 18 }}
              style={styles.addButton}
              onPress={confirmarDesativacao}
            >
              Confirmar
            </Button>
            <Button
              labelStyle={{ color: '#000', fontWeight: '500', fontSize: 18 }}
              onPress={() => setDesativarModalVisible(false)}
            >
              Cancelar</Button>
          </View>
        </View>
      </Modal>

      {/* modal de saida*/}
      <Modal visible={saidaModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Retirada de Produto
            </Text>

            <Text style={{ marginTop: 10, fontSize: 16 }}>
              Quantidade disponível: {produtoSaida?.quantidade}
            </Text>

            <RNTextInput
              placeholder="Quantidade a retirar"
              keyboardType="numeric"
              value={quantidadeSaida}
              onChangeText={setQuantidadeSaida}
              style={styles.modalInput}
            />

            <Button
              mode="contained"
              style={styles.addButton}
              labelStyle={{ color: '#000', fontWeight: '500', fontSize: 18 }}
              onPress={confirmarSaida}
            >
              Confirmar
            </Button>

            <Button
              labelStyle={{ color: '#000', fontWeight: '500', fontSize: 18 }}
              onPress={() => setSaidaModalVisible(false)}
            >
              Cancelar
            </Button>
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
  itemLabel: { fontWeight: 'bold', fontSize: 15, color: '#555', marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10, },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalInput: { borderBottomWidth: 1, fontSize: 18, borderBottomColor: '#ccc', marginBottom: 12, padding: 8 },
  itemProduct: { fontSize: 14, fontWeight: 'bold' },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
  dropdownList: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 6,
    maxHeight: 200, // 👈 limita a altura visível
    zIndex: 999,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

});
