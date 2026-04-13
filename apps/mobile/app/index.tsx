import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { Button, useHaptic } from '@ihotel/ui';
import {
  colors,
  fontWeights,
  spacing,
  animation,
  easing,
} from '@ihotel/config';

/* ─── decorative pattern (top-left mongolian motif) ─── */

function DecorativePattern() {
  return (
    <View style={patternStyles.container} pointerEvents="none">
      <View style={[patternStyles.ring, patternStyles.ring1]} />
      <View style={[patternStyles.ring, patternStyles.ring2]} />
      <View style={[patternStyles.ring, patternStyles.ring3]} />
    </View>
  );
}

const patternStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 200,
    height: 200,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: colors.primary,
    opacity: 0.04,
  },
  ring1: {
    width: 120,
    height: 120,
    borderRadius: 32,
    top: 40,
    left: 40,
    transform: [{ rotate: '45deg' }],
  },
  ring2: {
    width: 160,
    height: 160,
    borderRadius: 44,
    top: 20,
    left: 20,
    transform: [{ rotate: '22.5deg' }],
  },
  ring3: {
    width: 200,
    height: 200,
    borderRadius: 56,
    top: 0,
    left: 0,
    transform: [{ rotate: '11.25deg' }],
  },
});

/* ─── welcome screen ─── */

export default function WelcomeScreen() {
  const router = useRouter();
  const haptic = useHaptic();
  const [isLoading, setIsLoading] = useState(false);

  // entrance shared values
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const titleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(14);
  const subtitleOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.95);
  const buttonOpacity = useSharedValue(0);
  const footerOpacity = useSharedValue(0);

  // logo tap bounce
  const logoTapScale = useSharedValue(1);

  useEffect(() => {
    const logoSpring = { damping: 15, stiffness: 100 };

    // T=0 — logo
    logoScale.value = withSpring(1, logoSpring);
    logoOpacity.value = withSpring(1, logoSpring);

    // T=500 — title
    titleTranslateY.value = withDelay(500, withSpring(0, easing.out));
    titleOpacity.value = withDelay(
      500,
      withTiming(1, { duration: animation.base }),
    );

    // T=750 — subtitle
    subtitleTranslateY.value = withDelay(750, withSpring(0, easing.outSoft));
    subtitleOpacity.value = withDelay(
      750,
      withTiming(1, { duration: animation.base }),
    );

    // T=1050 — buttons
    buttonScale.value = withDelay(1050, withSpring(1, easing.out));
    buttonOpacity.value = withDelay(
      1050,
      withTiming(1, { duration: animation.fast }),
    );

    // T=1200 — footer
    footerOpacity.value = withDelay(
      1200,
      withTiming(0.4, { duration: animation.slow }),
    );
  }, []);

  // animated styles
  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const animatedLogoTapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoTapScale.value }],
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
    opacity: titleOpacity.value,
  }));

  const animatedSubtitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subtitleTranslateY.value }],
    opacity: subtitleOpacity.value,
  }));

  const animatedButtonsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  const animatedFooterStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  // handlers
  const handleLogoTap = useCallback(() => {
    haptic.light();
    logoTapScale.value = withSequence(
      withSpring(0.9, { damping: 10, stiffness: 200 }),
      withSpring(1.0, easing.bounce),
    );
  }, []);

  const handleStart = useCallback(() => {
    haptic.medium();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/(guest)/search');
      setIsLoading(false);
    }, 150);
  }, []);

  const handleDemo = useCallback(() => {
    toast('Push notification удахгүй идэвхжинэ', {
      duration: 3000,
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#F8F7F3', '#FFFFFF']}
        style={StyleSheet.absoluteFill}
      />

      <DecorativePattern />

      <View style={styles.container}>
        {/* hero */}
        <View style={styles.hero}>
          <Animated.View style={[styles.logoShadow, animatedLogoStyle]}>
            <Pressable onPress={handleLogoTap}>
              <Animated.View style={[styles.logoBox, animatedLogoTapStyle]}>
                <Text style={styles.logoText}>i</Text>
              </Animated.View>
            </Pressable>
          </Animated.View>

          <Animated.View style={animatedTitleStyle}>
            <Text style={styles.greeting}>Сайн байна уу!</Text>
          </Animated.View>

          <Animated.View style={animatedSubtitleStyle}>
            <Text style={styles.subtitle}>
              Хайж олох, чатлаж асуух, залгаж захиалах — бүгд нэг app-д
            </Text>
          </Animated.View>
        </View>

        {/* actions */}
        <Animated.View style={[styles.actions, animatedButtonsStyle]}>
          <Button
            title="Эхлэх"
            loading={isLoading}
            onPress={handleStart}
          />
          <View style={styles.spacer} />
          <Button
            title="Host-аас мессеж демо"
            variant="ghost"
            onPress={handleDemo}
          />
        </Animated.View>

        {/* footer */}
        <Animated.View style={[styles.footer, animatedFooterStyle]}>
          <Text style={styles.footerText}>
            Powered by AI · Made in Mongolia 🇲🇳
          </Text>
        </Animated.View>
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
    paddingBottom: spacing.xl,
  },

  /* hero */
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoShadow: {
    marginBottom: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoBox: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoText: {
    fontSize: 42,
    fontWeight: fontWeights.medium as '500',
    color: '#FFFFFF',
  },
  greeting: {
    fontSize: 32,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    letterSpacing: -0.96,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: fontWeights.regular as '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },

  /* actions */
  actions: {
    paddingBottom: 0,
  },
  spacer: {
    height: spacing.md,
  },

  /* footer */
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  footerText: {
    fontSize: 12,
    fontWeight: fontWeights.regular as '400',
    color: colors.textSecondary,
  },
});
