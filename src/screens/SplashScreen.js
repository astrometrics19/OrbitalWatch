import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { UI } from '../theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAuthStateChanged(auth, (user) => {
        navigation.replace(user ? 'MainTabs' : 'Login');
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#050814', '#0B132B', '#050814']} style={styles.container}>
      <View style={styles.orbitRing}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
      </View>
      <Text variant="headlineMedium" style={styles.title}>ORBITALWATCH</Text>
      <Text variant="labelMedium" style={styles.subtitle}>MISSION CONTROL & TELEMETRY</Text>
      <ActivityIndicator animating={true} color={UI.accent} style={{ marginTop: 32 }} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orbitRing: {
    padding: 14,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    backgroundColor: 'rgba(56, 189, 248, 0.06)',
    marginBottom: 20,
  },
  logo: { width: 100, height: 100, borderRadius: 24 },
  title: { color: UI.textPrimary, fontWeight: '800', letterSpacing: 3 },
  subtitle: { color: UI.accent, marginTop: 6, letterSpacing: 1.5 },
});