import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius } from '@/lib/theme';

interface Props {
  /** Valeur entre 0 et 1. */
  value: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ value, color = colors.sun, height = 12 }: Props) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped * 100}%`, backgroundColor: color, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
