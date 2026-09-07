import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radii } from '../theme/tokens';
import { ColorVariant } from '../types';

interface Props {
  variant: ColorVariant;
  selected: boolean;
  onPress: () => void;
}

export function ColorSwatch({ variant, selected, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.wrapper} hitSlop={8}>
      <View
        style={[
          styles.swatch,
          { backgroundColor: variant.hex, borderColor: selected ? colors.primary : colors.border },
          selected && styles.selected,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 2,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    borderWidth: 2,
  },
  selected: {
    borderWidth: 3,
  },
});
