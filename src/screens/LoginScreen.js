import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { UI } from '../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Missing Fields', 'Enter your email and password.');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace('MainTabs');
    } catch (err) {
      Alert.alert('Authentication Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#050814', '#0F172A']} style={styles.container}>
      <View style={styles.brandBox}>
        <MaterialCommunityIcons name="orbit" size={44} color={UI.accent} />
        <Text variant="headlineMedium" style={styles.header}>OrbitalWatch</Text>
        <Text variant="bodySmall" style={styles.sub}>Sign in to access live satellite telemetry</Text>
      </View>

      <Surface style={styles.card} elevation={2}>
        <TextInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          left={<TextInput.Icon icon="email-outline" />}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          left={<TextInput.Icon icon="lock-outline" />}
          secureTextEntry
          style={styles.input}
        />
        <Button mode="contained" onPress={handleLogin} loading={loading} contentStyle={{ height: 48 }} style={styles.btn}>
          Launch Console
        </Button>
      </Surface>

      <Button mode="text" onPress={() => navigation.navigate('Register')} textColor={UI.accent} style={{ marginTop: 12 }}>
        New Observer? Create an Account
      </Button>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 22 },
  brandBox: { alignItems: 'center', marginBottom: 28 },
  header: { color: UI.textPrimary, fontWeight: 'bold', marginTop: 8, letterSpacing: 1 },
  sub: { color: UI.textMuted, marginTop: 4 },
  card: { backgroundColor: UI.card, padding: 20, borderRadius: 18, borderWidth: 1, borderColor: UI.cardBorder },
  input: { marginBottom: 14, backgroundColor: '#0B1120' },
  btn: { marginTop: 6, borderRadius: 12 },
});