import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Menu,
  Text,
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
}

interface Propriedade {
  id: number;
  nome: string;
}

export default function ProdutosScreen() {
  const { token, isLoading: authLoading } = useAuth();
  const navigation = useNavigation<any>();

  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [selectedPropriedade, setSelectedPropriedade] = useState<Propriedade | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
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
    if (!selectedPropriedade || !token || authLoading) return;

    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/produto/${selectedPropriedade.id}`);
        setProdutos(res.data.produtos);
      } catch (err) {
        Alert.alert('Erro', 'Erro ao buscar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [selectedPropriedade, token, authLoading]);

  const realizarSaida = async (produtoId: number) => {
    Alert.alert('Confirmar', 'Deseja realizar saída deste produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: async () => {
          try {
            await api.post('/produto/saida', {
              produtoId,
              propriedadeId: selectedPropriedade?.id,
              quantidade: 1,
            });

            setProdutos((prev) =>
              prev.map((p) =>
                p.idProduto === produtoId
                  ? { ...p, quantidade: Math.max(0, p.quantidade - 1) }
                  : p
              )
            );
            Alert.alert('Sucesso', 'Saída registrada com sucesso!');
          } catch (err: any) {
            Alert.alert('Erro', err.response?.data?.error || 'Erro ao registrar saída');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomAppBar navigation={navigation} />

      {/* ⬇️ Seletor de propriedade posicionado logo abaixo da AppBar */}
      <View style={styles.selectorWrapper}>
        <Button
          mode="outlined"
          icon="chevron-down"
          contentStyle={{ flexDirection: 'row-reverse' }}
          onPress={() => setMenuVisible(true)}
          style={styles.selectorButton}
        >
          {selectedPropriedade?.nome || 'Selecionar propriedade'}
        </Button>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={{ x: 0, y: 0 }}
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
        onPress={() => navigation.navigate('CadastrarProduto', {
          propriedadeSelecionada: selectedPropriedade,
        })}
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
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
  selectorWrapper: {
    marginTop: 12,
    marginBottom: 8,
  },
  selectorButton: {
    borderRadius: 6,
    borderColor: '#144734',
    width: '100%',
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
