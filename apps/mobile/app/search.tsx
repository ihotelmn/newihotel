import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Card } from '@ihotel/ui';
import { searchHotels, fetchHotels } from '@ihotel/api';
import { useDebounce } from '@ihotel/hooks';
import { colors, radius, fontWeights } from '@ihotel/config';
import type { Hotel } from '@ihotel/types';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setLoading(true);
    const fetch = debouncedQuery
      ? searchHotels(debouncedQuery)
      : fetchHotels();

    fetch
      .then(setHotels)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Буудал хайх</Text>
        <TextInput
          style={styles.input}
          placeholder="Нэр эсвэл хот..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <Card
                title={item.name}
                subtitle={`${item.city} · ★ ${item.avg_rating || '—'} · ₮${item.price_min.toLocaleString()}`}
                imageUrl={item.image_url}
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Илэрц олдсонгүй</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border as string,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  loader: {
    marginTop: 40,
  },
  list: {
    padding: 20,
    gap: 16,
  },
  cardWrap: {
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 40,
    fontSize: 16,
  },
});
