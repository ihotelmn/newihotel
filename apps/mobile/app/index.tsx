import { View, Text, Pressable, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.hero}>
        <View style={s.logo}>
          <Text style={s.logoText}>i</Text>
        </View>
        <Text style={s.title}>Сайн байна уу!</Text>
        <Text style={s.subtitle}>
          Хайж олох, чатлаж асуух, залгаж захиалах — бүгд нэг app-д
        </Text>
      </View>
      <View style={s.actions}>
        <Pressable style={s.primaryBtn} onPress={() => router.push('/(guest)/search')}>
          <Text style={s.primaryText}>Эхлэх</Text>
        </Pressable>
        <Pressable style={s.ghostBtn} onPress={() => Alert.alert('Мэдэгдэл', 'Push notification удахгүй идэвхжинэ')}>
          <Text style={s.ghostText}>Host-аас мессеж демо</Text>
        </Pressable>
        <Text style={s.footer}>Powered by AI · Made in Mongolia 🇲🇳</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  logo: { width: 84, height: 84, borderRadius: 24, backgroundColor: '#0F6E56', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  logoText: { fontSize: 42, fontWeight: '500', color: '#FFF' },
  title: { fontSize: 32, fontWeight: '500', color: '#1A1A1A', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#5F5E5A', textAlign: 'center', lineHeight: 21 },
  actions: { paddingHorizontal: 28, paddingBottom: 40 },
  primaryBtn: { backgroundColor: '#0F6E56', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  primaryText: { fontSize: 16, fontWeight: '500', color: '#FFF' },
  ghostBtn: { paddingVertical: 14, alignItems: 'center' },
  ghostText: { fontSize: 16, fontWeight: '500', color: '#1A1A1A' },
  footer: { fontSize: 12, color: '#5F5E5A', textAlign: 'center', marginTop: 16, opacity: 0.4 },
});
