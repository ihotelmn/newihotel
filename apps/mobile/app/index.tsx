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
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>i</Text>
          </View>
          <Text style={styles.greeting}>Сайн байна уу!</Text>
          <Text style={styles.subtitle}>
            Хайж олох, чатлаж асуух, залгаж захиалах — бүгд нэг app-д
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Эхлэх"
            onPress={() => router.push('/(guest)/search')}
          />
          <View style={styles.spacer} />
          <Button
            title="🔔 Host-аас мессеж демо"
            variant="secondary"
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
    paddingHorizontal: 28,
    paddingTop: 0,
    paddingBottom: 40,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logoText: {
    fontSize: 42,
    fontWeight: fontWeights.medium as '500',
    color: '#FFFFFF',
  },
  greeting: {
    fontSize: 30,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: fontWeights.regular as '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  actions: {
    paddingBottom: 20,
  },
  spacer: {
    height: 12,
  },
});
