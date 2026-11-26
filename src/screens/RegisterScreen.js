import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { UI } from '../theme';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || password.length < 6) return Alert.alert('Invalid Input', 'Use a valid email & 6+ char password.');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace('MainTabs');
    } catch (err) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#050814', '#0F172A']} style={styles.container}>
      <View style={styles.brandBox}>
        <MaterialCommunityIcons name="rocket-launch-outline" size={44} color={UI.accent} />
        <Text variant="headlineMedium" style={styles.header}>Observer Registration</Text>
        <Text variant="bodySmall" style={styles.sub}>Create your cloud-synced skywatch profile</Text>
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
          label="Password (min 6 characters)"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          left={<TextInput.Icon icon="lock-plus-outline" />}
          secureTextEntry
          style={styles.input}
        />
        <Button mode="contained" onPress={handleRegister} loading={loading} contentStyle={{ height: 48 }} style={styles.btn}>
          Create Account
        </Button>
      </Surface>

      <Button mode="text" onPress={() => navigation.goBack()} textColor={UI.accent} style={{ marginTop: 12 }}>
        Already Registered? Sign In
      </Button>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 22 },
  brandBox: { alignItems: 'center', marginBottom: 28 },
  header: { color: UI.textPrimary, fontWeight: 'bold', marginTop: 8 },
  sub: { color: UI.textMuted, marginTop: 4 },
  card: { backgroundColor: UI.card, padding: 20, borderRadius: 18, borderWidth: 1, borderColor: UI.cardBorder },
  input: { marginBottom: 14, backgroundColor: '#0B1120' },
  btn: { marginTop: 6, borderRadius: 12 },
});