import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@ihotel/ui';
import { colors, fontWeights } from '@ihotel/config';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.logo}>iHotel</Text>
          <Text style={styles.tagline}>
            Монголын зочид буудлын удирдлагын систем
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Буудал хайх"
            onPress={() => router.push('/search')}
          />
          <View style={{ height: 12 }} />
          <Button
            title="Нэвтрэх"
            variant="outline"
            onPress={() => {}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: fontWeights.medium as '500',
    color: colors.primary,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    fontWeight: fontWeights.regular as '400',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actions: {
    paddingBottom: 20,
  },
});
