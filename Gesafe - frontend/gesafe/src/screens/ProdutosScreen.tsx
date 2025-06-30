import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert, FlatList, Modal, TextInput as RNTextInput, ScrollView, StyleSheet, TouchableOpacity, View
} from 'react-native';
import {
  ActivityIndicator, Button, IconButton,
  Text
} from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import FiltroPropriedadeSelector from '../components/FiltroPropriedadeSelector';
import { api } from '../services/api';
import { embalagens } from '../utils/embalagens';

// Define o tipo para os produtos
interface Produto {
  idEstoque: number;
  idProduto: number;
  nome: string;
  validade: string;
  quantidade: number;
  embalagem: string;
  movimentacaoId: number | null;
}

// Define o tipo para as propriedades
interface Propriedade {
  id: number;
  nome: string;
}

//Função para puxar o dia final do mês
function getLastDayOfMonth(month: number, year: number): number {
  if ([4, 6, 9, 11].includes(month)) return 30;
  if (month === 2) return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 29 : 28;
  return 31;
}

// Função para formatar a data de validade
function formatarValidadeInput(text: string, valorAtual: string): string {
  const digits = text.replace(/[^\d]/g, '');

  // Se o usuário está apagando (menos dígitos que antes)
  if (digits.length < valorAtual.replace(/[^\d]/g, '').length) return text;

  if (/^\d{6}$/.test(digits)) {
    const mes = parseInt(digits.substring(0, 2));
    const ano = parseInt(digits.substring(2));
    if (mes >= 1 && mes <= 12 && ano >= 1000 && ano <= 9999) {
      const diaFinal = getLastDayOfMonth(mes, ano);
      return `${String(diaFinal).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
    }
  }

  if (/^\d{8}$/.test(digits)) {
    const dia = digits.substring(0, 2);
    const mes = digits.substring(2, 4);
    const ano = digits.substring(4);
    if (
      parseInt(dia) >= 1 &&
      parseInt(dia) <= 31 &&
      parseInt(mes) >= 1 &&
      parseInt(mes) <= 12 &&
      parseInt(ano) >= 1000
    ) {
      return `${dia}/${mes}/${ano}`;
    }
  }

  return text;
}


export default function ProdutosScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [propriedadeId, setPropriedadeId] = useState<number | null>(null);
  const [propriedadeSelecionada, setPropriedadeSelecionada] = useState<Propriedade | null>(null);
  const [saidaModalVisible, setSaidaModalVisible] = useState(false);
  const [produtoSaida, setProdutoSaida] = useState<Produto | null>(null);
  const [quantidadeSaida, setQuantidadeSaida] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editValidade, setEditValidade] = useState('');
  const [editEmbalagem, setEditEmbalagem] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [desativarModalVisible, setDesativarModalVisible] = useState(false);
  const [produtoDesativando, setProdutoDesativando] = useState<Produto | null>(null);
  const [justificativa, setJustificativa] = useState('');

  useEffect(() => {
    // Função para buscar as propriedade 
    const fetchAndSetDefaultPropriedade = async () => {
      try {
        const response = await api.get('/auth/propriedades');
        const fetchedPropriedades: Propriedade[] = response.data.propriedades;
        // Se houver propriedades, seleciona a primeira como padrão
        if (fetchedPropriedades.length > 0) {
          setPropriedadeSelecionada(fetchedPropriedades[0]);
          setPropriedadeId(fetchedPropriedades[0].id);
        }
      } catch (error) {
        Alert.alert('Erro', 'Erro ao carregar propriedades.');
      }
    };
    fetchAndSetDefaultPropriedade();
  }, []);

  //Função para atualizar os produtos quando a propriedade selecionada mudar
  useEffect(() => {
    atualizarProdutos();
  }, [propriedadeSelecionada]);

  //Função para buscar os produtos da propriedade selecionada
  const atualizarProdutos = async () => {
    if (!propriedadeSelecionada) return;
    try {
      setLoading(true);
      const res = await api.get(`/produto/${propriedadeSelecionada.id}`);
      setProdutos(res.data.produtos);
    } catch (err) {
      console.error('Erro ao atualizar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  //função para abrir o modal de editar
  const abrirEditar = (produto: Produto) => {
    setProdutoEditando(produto);
    setEditNome(produto.nome);
    setEditValidade(produto.validade);
    setEditEmbalagem(produto.embalagem);
    setEditModalVisible(true);
  };

  //Função para confirmar a edição
  const confirmarEditar = async () => {
    if (!produtoEditando) return;
    try {
      await api.put(`/produto/${propriedadeSelecionada?.id}/${produtoEditando.idProduto}`, {
        nome: editNome,
        validade: editValidade,
        embalagem: editEmbalagem,
      });

      Alert.alert('Sucesso', 'Produto editado!');
      setEditModalVisible(false);
      atualizarProdutos();
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 400 && Array.isArray(error.response?.data?.erros)) {
        const mensagens = error.response.data.erros.map(
          (err: { campo: string; mensagem: string }) =>
            `${err.mensagem}.`
        ).join('\n');

        Alert.alert('Erro de validação', mensagens);
      } else {
        // loga apenas erros críticos
        console.error('Erro inesperado:', error);
        Alert.alert('Erro', error.response?.data?.error || 'Erro ao cadastrar o produto.');
      }
    } finally {
      setLoading(false);
    }
  };

  //Função para abrir o modal de desativação
  const abrirModalDesativar = (produto: Produto) => {
    setProdutoDesativando(produto);
    setJustificativa('');
    setDesativarModalVisible(true);
  };

  //Função para confirmar a desativação
  const confirmarDesativacao = async () => {
    if (!produtoDesativando) return;

    if (!justificativa.trim()) {
      Alert.alert('Erro', 'Informe uma justificativa!');
      return;
    }

    try {
      await api.patch(`/produto/movimentacao/${produtoDesativando.movimentacaoId}/${propriedadeSelecionada?.id}`, {
        justificativa,
      });

      Alert.alert('Sucesso', 'Produto desativado!');
      setDesativarModalVisible(false);
      atualizarProdutos();
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 400 && Array.isArray(error.response?.data?.erros)) {
        const mensagens = error.response.data.erros.map(
          (err: { campo: string; mensagem: string }) =>
            `${err.mensagem}.`
        ).join('\n');

        Alert.alert('Erro de validação', mensagens);
      } else {
        // loga apenas erros críticos
        console.error('Erro inesperado:', error);
        Alert.alert('Erro', error.response?.data?.error || 'Erro ao cadastrar o produto.');
      }
    } finally {
      setLoading(false);
    }
  };

  //Função para abrir o modal de saída
  const abrirModalSaida = (produto: Produto) => {
    setProdutoSaida(produto);
    setQuantidadeSaida('');
    setSaidaModalVisible(true);
  };

  //Função para confirmar a saída
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
        propriedadeId: propriedadeSelecionada?.id,
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

  //Atualizar os produtos sempre que a tela for focada ou propriedade mudar 
  useEffect(() => {
    if (isFocused) {
      atualizarProdutos();
    }
  }, [isFocused, propriedadeSelecionada]);

  return (
    <View style={styles.container}>
      <CustomAppBar navigation={navigation} />

      <FiltroPropriedadeSelector
        selected={propriedadeSelecionada}
        onSelect={setPropriedadeSelecionada}
        allowNull={false} // Define para false, removendo a opção "TODAS"
      />

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
                const formatado = formatarValidadeInput(text, editValidade);
                setEditValidade(formatado);
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
    maxHeight: 200,
    zIndex: 999,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

});