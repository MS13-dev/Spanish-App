import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, typography, radius, spacing, shadow } from '@/lib/theme';

const MESSAGES = ['¡Bien! 🎉', '¡Genial! 🌟', '¡Muy bien! 👏', '¡Perfecto! ✨', '¡Olé! 💃'];

interface Props {
  /** Change cette valeur pour déclencher une animation (ex. compteur de bonnes réponses). */
  trigger: number;
}

/** Petit message festif qui apparaît brièvement à chaque bonne réponse. */
export function Encouragement({ trigger }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const [msg, setMsg] = React.useState(MESSAGES[0]);

  React.useEffect(() => {
    if (trigger <= 0) return;
    setMsg(MESSAGES[trigger % MESSAGES.length]);
    opacity.value = withSequence(withTiming(1, { duration: 180 }), withTiming(0, { duration: 600 }));
    scale.value = withSequence(withTiming(1.1, { duration: 180 }), withTiming(1, { duration: 200 }));
  }, [trigger, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.badge, shadow.soft, style]}>
      <Text style={styles.text}>{msg}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    backgroundColor: colors.sun,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  text: { ...typography.heading, color: colors.text },
});
