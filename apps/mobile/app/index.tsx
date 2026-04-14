import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = useRef(new Animated.Value(24)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(180, [
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(titleTranslateY, { toValue: 0, duration: 450, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(buttonsTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(buttonsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(footerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePrimary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(guest)/search');
  };

  const handleSecondary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Push notification', 'Push notification удахгүй идэвхжинэ');
  };

  return (
    <LinearGradient colors={['#F8F7F3', '#FFFFFF']} style={s.gradient}>
      <View style={s.hero}>
        <Animated.View
          style={[
            s.logo,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Text style={s.logoText}>i</Text>
        </Animated.View>

        <Animated.Text
          style={[
            s.title,
            { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] },
          ]}
        >
          {'Сайн байна уу!'}
        </Animated.Text>

        <Animated.Text
          style={[
            s.subtitle,
            { opacity: subtitleOpacity, transform: [{ translateY: subtitleTranslateY }] },
          ]}
        >
          {'Хайж олох, чатлаж асуух, залгаж захиалах\n— бүгд нэг app-д'}
        </Animated.Text>
      </View>

      <Animated.View
        style={[
          s.actions,
          { opacity: buttonsOpacity, transform: [{ translateY: buttonsTranslateY }] },
        ]}
      >
        <Pressable
          style={({ pressed }) => [s.primaryBtn, pressed && s.primaryBtnPressed]}
          onPress={handlePrimary}
        >
          <Text style={s.primaryText}>Эхлэх</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [s.ghostBtn, pressed && s.ghostBtnPressed]}
          onPress={handleSecondary}
        >
          <Text style={s.ghostText}>Host-аас мессеж демо</Text>
        </Pressable>
      </Animated.View>

      <Animated.Text style={[s.footer, { opacity: footerOpacity }]}>
        {'Powered by AI  ·  Made in Mongolia \u{1F1F2}\u{1F1F3}'}
      </Animated.Text>

      <Animated.View style={{ opacity: footerOpacity }}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/(hotel)/leads' as any);
          }}
          style={({ pressed }) => [s.hotelLink, pressed && { opacity: 0.6 }]}
        >
          <Text style={s.hotelLinkText}>{'Буудлын эзэн \u2192'}</Text>
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 60,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '300',
    color: '#FFF',
    marginTop: -2,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#5F5E5A',
    textAlign: 'center',
    lineHeight: 23,
  },
  actions: {
    paddingHorizontal: 28,
    paddingBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#0F6E56',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  primaryText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  ghostBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFF',
  },
  ghostBtnPressed: {
    backgroundColor: '#F5F5F5',
  },
  ghostText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  footer: {
    fontSize: 12,
    color: '#5F5E5A',
    textAlign: 'center',
    paddingBottom: 12,
    opacity: 0.45,
  },
  hotelLink: {
    alignItems: 'center',
    paddingBottom: 44,
  },
  hotelLinkText: {
    fontSize: 13,
    color: '#0F6E56',
    fontWeight: '500',
  },
});
