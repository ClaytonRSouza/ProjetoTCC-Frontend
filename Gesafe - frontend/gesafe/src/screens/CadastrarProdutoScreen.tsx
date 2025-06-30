import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import {
  Button,
  TextInput
} from 'react-native-paper';
import CustomAppBar from '../components/CustomAppBar';
import FiltroMenuSelector from '../components/FiltroMenuSelector';
import FiltroPropriedadeSelector from '../components/FiltroPropriedadeSelector';
import { api } from '../services/api';
import { embalagens } from '../utils/embalagens';

//Cria a interface para a propriedade
interface Propriedade {
  id: number;
  nome: string;
}

//cria a tipagem utilizada no navigation
type CadastrarProdutoScreenProps = {
  navigation: {
    goBack: () => void;
  };
};

export default function CadastrarProdutoScreen({ navigation }: CadastrarProdutoScreenProps) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [validade, setValidade] = useState('');
  const [embalagemSelecionada, setEmbalagemSelecionada] = useState<string | null>(null);
  const [propriedadeId, setPropriedadeId] = useState<number | null>(null);
  const [propriedadeSelecionada, setPropriedadeSelecionada] = useState<Propriedade | null>(null);
  const [loading, setLoading] = useState(false);


  // atualiza o propriedadeId quando propriedadeSelecionada muda
  useEffect(() => {
    if (propriedadeSelecionada) {
      setPropriedadeId(propriedadeSelecionada.id);
    } else {
      // a propriedade é obrigatória, então este else não deve ser atingido
      setPropriedadeId(null);
    }
  }, [propriedadeSelecionada]);

  // função para obter o último dia do mês
  const getLastDayOfMonth = (month: number, year: number): number => {
    if ([4, 6, 9, 11].includes(month)) return 30; // Abril, Junho, Setembro, Novembro
    if (month === 2) {
      return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 29 : 28;
    }
    return 31;
  };

  // função para tratar a entrada da data de validade
  const handleValidadeInput = (text: string) => {
    const digits = text.replace(/[^\d]/g, '');

    // Se o usuário está apagando (menos dígitos que antes), não forçamos formatação
    if (digits.length < validade.replace(/[^\d]/g, '').length) {
      setValidade(text);
      return;
    }

    // MMYYYY → converte para último dia do mês
    if (/^\d{6}$/.test(digits)) {
      const mes = parseInt(digits.substring(0, 2));
      const ano = parseInt(digits.substring(2));

      // valida mês e ano antes de aplicar
      if (mes >= 1 && mes <= 12 && ano >= 1000 && ano <= 9999) {
        const diaFinal = getLastDayOfMonth(mes, ano);
        setValidade(`${String(diaFinal).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`);
        return;
      }
    }

    // DDMMYYYY → formatado
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
        setValidade(`${dia}/${mes}/${ano}`);
        return;
      }
    }

    // padrão: mantém conforme digitado
    setValidade(text);
  };

  // função para cadastrar o produto
  const handleCadastrar = async () => {
    if (
      !nome.trim() ||
      !quantidade.trim() ||
      !validade.trim() ||
      !embalagemSelecionada ||
      !propriedadeId
    ) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente!');
      return;
    }

    const quantidadeNum = Number(quantidade);

    // cria o payload para enviar para a API
    const payload = {
      nome,
      quantidade: quantidadeNum,
      validade,
      embalagem: embalagemSelecionada,
      propriedadeId,
    };

    try {
      setLoading(true);
      await api.post('/produto/cadastrar', payload);
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      navigation.goBack();
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


  return (
    <View style={styles.container}>
      <CustomAppBar navigation={navigation} />

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          label="Nome do Produto"
          mode="outlined"
          value={nome}
          onChangeText={(text) => setNome(text.toUpperCase())}
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
          label="Validade (DD/MM/AAAA ou MM/AAAA)"
          mode="outlined"
          value={validade}
          onChangeText={handleValidadeInput}
          keyboardType="numeric"
          placeholder="DD/MM/AAAA ou MM/AAAA"
          style={styles.input}
        />

        <FiltroMenuSelector
          label="Embalagem"
          valores={embalagens}
          valorSelecionado={embalagemSelecionada}
          onSelecionar={setEmbalagemSelecionada}
          allowNull={false} // Define para false, removendo a opção "Nenhum filtro"
        />

        <FiltroPropriedadeSelector
          selected={propriedadeSelecionada}
          onSelect={setPropriedadeSelecionada}
          allowNull={false} // Define para false, removendo a opção "TODAS"
        />

        <Button
          mode="elevated"
          icon="content-save-outline"
          onPress={handleCadastrar}
          loading={loading}
          disabled={loading}
          labelStyle={{ color: '#000', fontWeight: '500', fontSize: 20 }}
          style={styles.button}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 12 },
  form: { padding: 10, paddingBottom: 50 },
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
    marginVertical: 16,
    borderRadius: 10,
    backgroundColor: '#c8d7d3',
  },
});
