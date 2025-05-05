// app/index.tsx
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-3xl font-bold text-green-700 mb-10">Bem-vindo ao Gesafe</Text>

      <TouchableOpacity
        className="w-full bg-green-700 py-4 rounded-2xl mb-4"
        onPress={() => router.push('/login')}
      >
        <Text className="text-white text-center font-semibold text-lg">Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full border border-green-700 py-4 rounded-2xl"
        onPress={() => router.push('/cadastro')}
      >
        <Text className="text-green-700 text-center font-semibold text-lg">Criar Conta</Text>
      </TouchableOpacity>
    </View>
  );
}
