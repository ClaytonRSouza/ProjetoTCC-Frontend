import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CadastrarProdutoScreen from '../screens/CadastrarProdutoScreen';
import CadastrarPropriedadeScreen from '../screens/CadastrarPropriedadeScreen';
import HomeScreen from '../screens/HomeScreen';
import MovimentacoesScreen from '../screens/MovimentacoesScreen';
import ProdutosScreen from '../screens/ProdutosScreen';
import ProdutosVencimentoScreen from '../screens/ProdutosVencimentoScreen';
import RelatorioEstoqueScreen from '../screens/RelatorioEstoqueScreen';
import RelatorioMovimentacoesScreen from '../screens/RelatorioMovimentacoesScreen';
import RelatoriosScreen from '../screens/RelatoriosScreen';
import RelatorioVencimentosScreen from '../screens/RelatorioVencimentosScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Produtos" component={ProdutosScreen} />
      <Stack.Screen name="Movimentacoes" component={MovimentacoesScreen} />
      <Stack.Screen name="Relatorios" component={RelatoriosScreen} />
      <Stack.Screen name="CadastrarProduto" component={CadastrarProdutoScreen} />
      <Stack.Screen name="CadastrarPropriedade" component={CadastrarPropriedadeScreen} />
      <Stack.Screen name="ProdutosVencimento" component={ProdutosVencimentoScreen} />
      <Stack.Screen name="RelatorioEstoque" component={RelatorioEstoqueScreen} />
      <Stack.Screen name="RelatorioMovimentacoes" component={RelatorioMovimentacoesScreen} />
      <Stack.Screen name="RelatorioVencimentos" component={RelatorioVencimentosScreen} />
    </Stack.Navigator>
  );
}
