import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Text, Chip, TextInput, ActivityIndicator, Divider, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UI } from '../theme';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('ISS');
  const [selectedSat, setSelectedSat] = useState(null);
  const [issLive, setIssLive] = useState(null);
  const [missionInfo, setMissionInfo] = useState(null);
  const [crewList, setCrewList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const parseTLE = (line2) => {
    if (!line2 || line2.length < 63) return null;
    const inclination = parseFloat(line2.substring(8, 16).trim()).toFixed(2);
    const eccentricity = '0.' + line2.substring(26, 33).trim();
    const meanMotion = parseFloat(line2.substring(52, 63).trim());
    const periodMins = meanMotion > 0 ? (1440 / meanMotion).toFixed(1) : 'N/A';
    return { inclination, eccentricity, revsPerDay: meanMotion.toFixed(2), periodMins };
  };

  const searchEverything = async (queryText = searchQuery) => {
    const q = queryText.trim();
    if (!q) return;
    setLoading(true);
    setErrorMsg('');
    setSelectedSat(null);
    setIssLive(null);
    setMissionInfo(null);
    setCrewList([]);

    try {
      const [tleRes, launchRes, astroRes] = await Promise.all([
        fetch(`https://tle.ivanstanojevic.me/api/tle?search=${encodeURIComponent(q)}`).then((r) => r.json()).catch(() => ({})),
        fetch(`https://lldev.thespacedevs.com/2.2.0/launch/?search=${encodeURIComponent(q)}&limit=3`).then((r) => r.json()).catch(() => ({})),
        fetch(`https://lldev.thespacedevs.com/2.2.0/astronaut/?search=${encodeURIComponent(q)}&limit=5`).then((r) => r.json()).catch(() => ({})),
      ]);

      const satList = tleRes.member || [];
      if (satList.length > 0) {
        const primarySat = satList[0];
        setSelectedSat(primarySat);
        if (primarySat.satelliteId === 25544 || q.toUpperCase() === 'ISS') {
          const liveData = await fetch('https://api.wheretheiss.at/v1/satellites/25544').then((r) => r.json()).catch(() => null);
          if (liveData && liveData.latitude) setIssLive(liveData);
        }
      }

      const launches = launchRes.results || [];
      if (launches.length > 0) setMissionInfo(launches[0]);

      let astronauts = astroRes.results || [];
      if (q.toUpperCase() === 'ISS' || q.toUpperCase().includes('TIAN')) {
        const inSpaceRes = await fetch('https://lldev.thespacedevs.com/2.2.0/astronaut/?in_space=true&limit=8')
          .then((r) => r.json())
          .catch(() => ({}));
        if (inSpaceRes.results?.length > 0) astronauts = inSpaceRes.results;
      }
      setCrewList(astronauts);

      if (satList.length === 0 && launches.length === 0 && astronauts.length === 0) {
        setErrorMsg(`No telemetry or mission data found for "${q}".`);
      }
    } catch {
      setErrorMsg('Connection lost. Check network and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchEverything('ISS');
  }, []);

  const orbit = selectedSat ? parseTLE(selectedSat.line2) : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <LinearGradient colors={['#0B132B', '#050814']} style={styles.headerBanner}>
        <View style={styles.topRow}>
          <View>
            <Text variant="labelSmall" style={styles.kicker}>ORBITALWATCH TELEMETRY</Text>
            <Text variant="headlineSmall" style={styles.title}>Mission Control</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE FEED</Text>
          </View>
        </View>

        <TextInput
          placeholder="Search ISS, Chandrayaan, Falcon 9, Hubble..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="radar" color={UI.accent} />}
          right={<TextInput.Icon icon="magnify" onPress={() => searchEverything()} />}
          onSubmitEditing={() => searchEverything()}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['ISS', 'Chandrayaan', 'Falcon 9', 'Tiangong', 'Hubble', 'Artemis'].map((preset) => {
            const active = searchQuery.toUpperCase() === preset.toUpperCase();
            return (
              <Chip
                key={preset}
                selected={active}
                style={[styles.chip, active && styles.chipActive]}
                textStyle={{ color: active ? '#050814' : UI.textPrimary, fontWeight: '600' }}
                onPress={() => {
                  setSearchQuery(preset);
                  searchEverything(preset);
                }}
              >
                {preset}
              </Chip>
            );
          })}
        </ScrollView>
      </LinearGradient>

      <View style={{ paddingHorizontal: 16 }}>
        {loading ? (
          <ActivityIndicator size="large" color={UI.accent} style={{ marginTop: 48 }} />
        ) : errorMsg ? (
          <Surface style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#F43F5E" />
            <Text style={{ color: '#FDA4AF', marginLeft: 10, flex: 1 }}>{errorMsg}</Text>
          </Surface>
        ) : (
          <>
            {/* 2x2 LIVE GPS TELEMETRY GRID */}
            {issLive && (
              <View style={styles.grid}>
                <Surface style={styles.metricTile}>
                  <Text style={styles.metricLabel}>LATITUDE</Text>
                  <Text style={styles.metricValue}>{issLive.latitude.toFixed(3)}°</Text>
                </Surface>
                <Surface style={styles.metricTile}>
                  <Text style={styles.metricLabel}>LONGITUDE</Text>
                  <Text style={styles.metricValue}>{issLive.longitude.toFixed(3)}°</Text>
                </Surface>
                <Surface style={styles.metricTile}>
                  <Text style={styles.metricLabel}>ALTITUDE</Text>
                  <Text style={styles.metricValue}>{issLive.altitude.toFixed(1)} km</Text>
                </Surface>
                <Surface style={styles.metricTile}>
                  <Text style={styles.metricLabel}>VELOCITY</Text>
                  <Text style={styles.metricValue}>{Math.round(issLive.velocity)} km/h</Text>
                </Surface>
              </View>
            )}

            {/* ORBITAL ELEMENTS CARD */}
            {selectedSat && (
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeaderRow}>
                    <Text variant="labelSmall" style={styles.sectionTag}>ORBITAL TELEMETRY</Text>
                    <Text style={styles.noradPill}>NORAD #{selectedSat.satelliteId}</Text>
                  </View>
                  <Text variant="titleLarge" style={styles.value}>{selectedSat.name}</Text>

                  {orbit && (
                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Text style={styles.statVal}>{orbit.inclination}°</Text>
                        <Text style={styles.statLbl}>Inclination</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statVal}>{orbit.periodMins}m</Text>
                        <Text style={styles.statLbl}>Period</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statVal}>{orbit.revsPerDay}</Text>
                        <Text style={styles.statLbl}>Orbits/Day</Text>
                      </View>
                    </View>
                  )}
                </Card.Content>
              </Card>
            )}

            {/* ROCKET & MISSION CARD */}
            {missionInfo && (
              <Card style={styles.card}>
                {missionInfo.image ? <Card.Cover source={{ uri: missionInfo.image }} style={{ height: 180 }} /> : null}
                <Card.Content style={{ marginTop: 14 }}>
                  <View style={styles.cardHeaderRow}>
                    <Text variant="labelSmall" style={styles.sectionTag}>MISSION & VEHICLE</Text>
                    <Text style={styles.statusPill}>{missionInfo.status?.abbrev || 'ACTIVE'}</Text>
                  </View>
                  <Text variant="titleLarge" style={styles.value}>{missionInfo.name}</Text>
                  <Divider style={styles.divider} />
                  <Text style={styles.metaLine}>
                    <Text style={styles.bold}>Agency: </Text>{missionInfo.launch_service_provider?.name || 'N/A'}
                  </Text>
                  <Text style={styles.metaLine}>
                    <Text style={styles.bold}>Rocket: </Text>{missionInfo.rocket?.configuration?.full_name || 'N/A'}
                  </Text>
                  <Text style={styles.metaLine}>
                    <Text style={styles.bold}>Launch Site: </Text>{missionInfo.pad?.location?.name || 'N/A'}
                  </Text>
                  <Text variant="bodySmall" style={{ color: UI.textMuted, marginTop: 10, lineHeight: 19 }}>
                    {missionInfo.mission?.description || 'Mission telemetry and payload details scheduled.'}
                  </Text>
                </Card.Content>
              </Card>
            )}

            {/* CREW / ASTRONAUTS CARD */}
            {crewList.length > 0 && (
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="labelSmall" style={styles.sectionTag}>
                    {searchQuery.toUpperCase() === 'ISS' ? 'CREW CURRENTLY IN ORBIT' : 'MISSION CREW & ASTRONAUTS'}
                  </Text>
                  {crewList.map((astro) => (
                    <View key={astro.id} style={styles.astroRow}>
                      <Image
                        source={{ uri: astro.profile_image_thumbnail || 'https://via.placeholder.com/60' }}
                        style={styles.avatar}
                      />
                      <View style={{ flex: 1 }}>
                        <Text variant="titleSmall" style={styles.value}>{astro.name}</Text>
                        <Text variant="labelSmall" style={{ color: UI.accent, marginTop: 2 }}>
                          {astro.agency?.abbrev || astro.agency?.name} • {astro.nationality}
                        </Text>
                        <Text variant="bodySmall" style={{ color: UI.textMuted, marginTop: 2 }} numberOfLines={2}>
                          {astro.bio}
                        </Text>
                      </View>
                    </View>
                  ))}
                </Card.Content>
              </Card>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UI.bg },
  headerBanner: { paddingTop: 48, paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: UI.cardBorder, marginBottom: 14 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  kicker: { color: UI.accent, letterSpacing: 1.5, fontWeight: '700' },
  title: { color: UI.textPrimary, fontWeight: '800' },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.14)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.4)' },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: UI.success, marginRight: 6 },
  liveText: { color: UI.success, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  input: { marginBottom: 12, backgroundColor: '#0F172A' },
  chip: { marginRight: 8, backgroundColor: '#1E293B', borderColor: '#334155', borderWidth: 1 },
  chipActive: { backgroundColor: UI.accent, borderColor: UI.accent },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 6 },
  metricTile: { width: '48.5%', backgroundColor: UI.card, padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: UI.cardBorder },
  metricLabel: { color: UI.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  metricValue: { color: UI.accent, fontSize: 19, fontWeight: '800', marginTop: 4, fontVariant: ['tabular-nums'] },
  card: { backgroundColor: UI.card, marginBottom: 14, borderWidth: 1, borderColor: UI.cardBorder, overflow: 'hidden' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  sectionTag: { color: UI.accent, fontWeight: '800', letterSpacing: 1.2 },
  noradPill: { color: UI.textMuted, fontSize: 11, backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusPill: { color: UI.success, fontSize: 11, fontWeight: '700', backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  value: { color: UI.textPrimary, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: UI.cardBorder },
  statItem: { alignItems: 'center', flex: 1 },
  statVal: { color: UI.textPrimary, fontSize: 16, fontWeight: '800' },
  statLbl: { color: UI.textMuted, fontSize: 11, marginTop: 2 },
  divider: { backgroundColor: UI.cardBorder, marginVertical: 10 },
  metaLine: { color: '#CBD5E1', fontSize: 13, marginBottom: 4 },
  bold: { color: UI.textPrimary, fontWeight: '700' },
  astroRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: UI.cardBorder },
  avatar: { width: 54, height: 54, borderRadius: 27, marginRight: 12, borderWidth: 1.5, borderColor: UI.accent },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(244, 63, 94, 0.12)', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(244, 63, 94, 0.4)' },
});