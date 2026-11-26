import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Button, Surface, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { UI } from '../theme';

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  return (
    <LinearGradient colors={['#0B132B', '#050814']} style={styles.container}>
      <View style={styles.avatarRing}>
        <Avatar.Icon size={76} icon="account-astronaut" style={{ backgroundColor: '#1E293B' }} color={UI.accent} />
      </View>
      <Text variant="titleLarge" style={{ color: UI.textPrimary, fontWeight: '800' }}>Mission Observer</Text>
      <Text variant="bodyMedium" style={{ color: UI.accent, marginTop: 2, marginBottom: 24 }}>{user?.email}</Text>

      <Surface style={styles.card} elevation={1}>
        <View style={styles.row}>
          <Text style={styles.lbl}>Authentication</Text>
          <Text style={styles.val}>Firebase Auth (Active)</Text>
        </View>
        <Divider style={styles.div} />
        <View style={styles.row}>
          <Text style={styles.lbl}>Cloud Database</Text>
          <Text style={styles.val}>Cloud Firestore</Text>
        </View>
        <Divider style={styles.div} />
        <View style={styles.row}>
          <Text style={styles.lbl}>Telemetry Feeds</Text>
          <Text style={styles.val}>NORAD TLE • SpaceDevs • SNAPI</Text>
        </View>
      </Surface>

      <Button mode="contained" icon="logout" buttonColor="#E11D48" textColor="#FFF" onPress={handleLogout} style={styles.logoutBtn}>
        Terminate Session (Sign Out)
      </Button>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 22 },
  avatarRing: { padding: 8, borderRadius: 50, borderWidth: 1.5, borderColor: UI.accent, marginBottom: 14 },
  card: { width: '100%', backgroundColor: UI.card, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: UI.cardBorder, marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  lbl: { color: UI.textMuted, fontSize: 13 },
  val: { color: UI.textPrimary, fontWeight: '700', fontSize: 13 },
  div: { backgroundColor: UI.cardBorder, marginVertical: 4 },
  logoutBtn: { width: '100%', borderRadius: 12, paddingVertical: 4 },
});