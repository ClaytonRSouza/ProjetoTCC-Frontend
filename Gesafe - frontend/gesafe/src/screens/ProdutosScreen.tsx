import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, FlatList, TouchableOpacity, Alert
} from 'react-native';
import { Text, Button, Menu, ActivityIndicator, IconButton } from 'react-native-paper';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

interface Produto {
  idEstoque: number;
  idProduto: number;
  nome: string;
  validade: string;
  quantidade: number;
}

interface Propriedade {
  id: number;
  nome: string;
}

export default function ProdutosScreen() {
  const { token } = useAuth();
  const navigation = useNavigation<any>();

  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selectedPropriedade, setSelectedPropriedade] = useState<Propriedade | null>(null);
  const [loading, setLoading] = useState(true);

  const [menuVisible, setMenuVisible] = useState(false);

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
    if (!selectedPropriedade) return;

    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/produto/${selectedPropriedade.id}`);
        setProdutos(res.data.produtos);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [selectedPropriedade]);

  const realizarSaida = async (produtoId: number) => {
    Alert.alert('Confirmar', 'Deseja realizar saída deste produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: async () => {
          try {
            const res = await api.post('/produto/saida', {
              produtoId,
              propriedadeId: selectedPropriedade?.id,
              quantidade: 1,
            });
            Alert.alert('Sucesso', res.data.message || 'Saída realizada com sucesso');
            // Atualiza a lista
            const atualizada = produtos.map(p =>
              p.idProduto === produtoId
                ? { ...p, quantidade: Math.max(0, p.quantidade - 1) }
                : p
            );
            setProdutos(atualizada);
          } catch (err: any) {
            Alert.alert('Erro', err.response?.data?.error || 'Erro ao registrar saída');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={styles.logo}>GESAFE</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton icon="menu" onPress={() => setMenuVisible(true)} />
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
        icon="plus"
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

              <Button
                mode="outlined"
                icon="arrow-right"
                style={styles.utilizarBtn}
                onPress={() => realizarSaida(item.idProduto)}
              >
                Utilizar
              </Button>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  addButton: {
    marginVertical: 16,
    borderRadius: 10,
  },
  loader: { flex: 1, justifyContent: 'center' },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  itemLabel: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  utilizarBtn: {
    marginLeft: 8,
    alignSelf: 'center',
  },
});
