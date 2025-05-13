import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProdutosScreen from '../screens/ProdutosScreen';
import MovimentacoesScreen from '../screens/MovimentacoesScreen';
import VencimentosScreen from '../screens/VencimentosScreen';
import RelatoriosScreen from '../screens/RelatoriosScreen';
import CadastrarProdutoScreen from '../screens/CadastrarProdutoScreen'

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Produtos" component={ProdutosScreen} />
      <Stack.Screen name="Movimentacoes" component={MovimentacoesScreen} />
      <Stack.Screen name="Vencimentos" component={VencimentosScreen} />
      <Stack.Screen name="Relatorios" component={RelatoriosScreen} />
      <Stack.Screen name="CadastrarProduto" component={CadastrarProdutoScreen} />
    </Stack.Navigator>
  );
}
