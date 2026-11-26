import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text, IconButton, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { UI } from '../theme';

export default function LogScreen() {
  const [target, setTarget] = useState('');
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'observations'), where('uid', '==', auth.currentUser.uid));
    return onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const addLog = async () => {
    if (!target.trim()) return Alert.alert('Target Required', 'Enter a satellite, planet, or mission name.');
    await addDoc(collection(db, 'observations'), {
      uid: auth.currentUser.uid,
      target: target.trim(),
      notes: notes.trim() || 'Clear sky observation logged',
      date: new Date().toLocaleDateString(),
    });
    setTarget('');
    setNotes('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text variant="labelSmall" style={styles.kicker}>FIRESTORE CLOUD SYNC</Text>
        <Text variant="headlineSmall" style={styles.header}>Skywatch Logbook</Text>
      </View>

      <Surface style={styles.formCard} elevation={1}>
        <TextInput label="Target (e.g., ISS Pass, Jupiter, Chandrayaan)" value={target} onChangeText={setTarget} mode="outlined" style={styles.input} />
        <TextInput label="Observation Notes & Sky Conditions" value={notes} onChangeText={setNotes} mode="outlined" style={styles.input} />
        <Button mode="contained" icon="cloud-upload-outline" onPress={addLog} style={{ borderRadius: 10 }}>
          Record Sighting
        </Button>
      </Surface>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="telescope" size={36} color={UI.textMuted} />
            <Text style={{ color: UI.textMuted, marginTop: 8 }}>No sightings logged yet. Record your first above!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.target}
              subtitle={`${item.date} • ${item.notes}`}
              titleStyle={{ color: UI.textPrimary, fontWeight: 'bold' }}
              subtitleStyle={{ color: UI.textMuted }}
              left={(props) => <MaterialCommunityIcons {...props} name="star-four-points" size={24} color={UI.accent} />}
              right={(props) => <IconButton {...props} icon="trash-can-outline" iconColor="#F43F5E" onPress={() => deleteDoc(doc(db, 'observations', item.id))} />}
            />
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UI.bg },
  headerBox: { paddingTop: 48, paddingHorizontal: 16, paddingBottom: 12 },
  kicker: { color: UI.accent, fontWeight: '700', letterSpacing: 1.4 },
  header: { color: UI.textPrimary, fontWeight: '800' },
  formCard: { marginHorizontal: 16, marginBottom: 16, padding: 14, borderRadius: 16, backgroundColor: UI.card, borderWidth: 1, borderColor: UI.cardBorder },
  input: { marginBottom: 10, backgroundColor: '#050814' },
  card: { backgroundColor: UI.card, marginBottom: 10, borderWidth: 1, borderColor: UI.cardBorder },
  emptyBox: { alignItems: 'center', marginTop: 40, opacity: 0.8 },
});