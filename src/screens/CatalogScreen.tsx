import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors, fontSizes, spacing } from '../theme/tokens';
import { CATEGORY_LABELS, getProductsByCategory } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useAppStore } from '../state/store';

type Props = NativeStackScreenProps<RootStackParamList, 'Catalog'>;

export function CatalogScreen({ route, navigation }: Props) {
  const { category } = route.params;
  const products = getProductsByCategory(category);
  const { favorites, toggleFavorite } = useAppStore((s) => ({
    favorites: s.favorites,
    toggleFavorite: s.toggleFavorite,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{CATEGORY_LABELS[category]}</Text>
        <Text style={styles.subtitle}>Tap a style to try it on</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.lg }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isFavorite={favorites.includes(item.id)}
            onPress={() => navigation.navigate('TryOn', { productId: item.id })}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md },
  title: { color: colors.text, fontSize: fontSizes.xl, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: fontSizes.sm, marginTop: 4 },
});
