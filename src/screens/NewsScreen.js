import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, ScrollView, Linking } from 'react-native';
import { Card, Text, TextInput, Chip, Button, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { UI } from '../theme';

export default function NewsScreen() {
  const [category, setCategory] = useState('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSpaceNews = async (selectedCategory = category, queryText = searchQuery) => {
    setLoading(true);
    try {
      const searchParam = queryText.trim() ? `&search=${encodeURIComponent(queryText.trim())}` : '';
      const res = await fetch(`https://api.spaceflightnewsapi.net/v4/${selectedCategory}/?limit=15${searchParam}`);
      const data = await res.json();
      setItems(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaceNews(category, searchQuery);
  }, [category]);

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text variant="labelSmall" style={styles.kicker}>GLOBAL AEROSPACE DISPATCH</Text>
        <Text variant="headlineSmall" style={styles.header}>Space Industry News</Text>

        <SegmentedButtons
          value={category}
          onValueChange={setCategory}
          style={{ marginVertical: 10 }}
          buttons={[
            { value: 'articles', label: 'Articles' },
            { value: 'blogs', label: 'Blogs' },
            { value: 'reports', label: 'Reports' },
          ]}
        />

        <TextInput
          placeholder="Filter stories (ISRO, SpaceX, Mars...)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.input}
          right={<TextInput.Icon icon="magnify" onPress={() => fetchSpaceNews()} />}
          onSubmitEditing={() => fetchSpaceNews()}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'ISRO', 'SpaceX', 'NASA', 'Starship', 'Artemis'].map((topic) => (
            <Chip
              key={topic}
              style={styles.chip}
              textStyle={{ color: UI.textPrimary, fontSize: 12 }}
              onPress={() => {
                const term = topic === 'All' ? '' : topic;
                setSearchQuery(term);
                fetchSpaceNews(category, term);
              }}
            >
              {topic}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={UI.accent} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              {item.image_url ? <Card.Cover source={{ uri: item.image_url }} style={{ height: 170 }} /> : null}
              <Card.Content style={{ paddingTop: 12 }}>
                <Text style={styles.publisherPill}>
                  {item.news_site?.toUpperCase()} • {new Date(item.published_at).toLocaleDateString()}
                </Text>
                <Text variant="titleMedium" style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <Text variant="bodySmall" style={{ color: UI.textMuted, marginTop: 6, lineHeight: 18 }} numberOfLines={3}>
                  {item.summary}
                </Text>
              </Card.Content>
              {item.url ? (
                <Card.Actions style={{ justifyContent: 'flex-end' }}>
                  <Button mode="text" icon="open-in-new" textColor={UI.accent} onPress={() => Linking.openURL(item.url)}>
                    Read Article
                  </Button>
                </Card.Actions>
              ) : null}
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UI.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBox: { paddingTop: 48, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#0B1120', borderBottomWidth: 1, borderBottomColor: UI.cardBorder },
  kicker: { color: UI.accent, fontWeight: '700', letterSpacing: 1.4 },
  header: { color: UI.textPrimary, fontWeight: '800' },
  input: { marginBottom: 10, backgroundColor: UI.card },
  chip: { marginRight: 8, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  card: { backgroundColor: UI.card, marginBottom: 16, borderWidth: 1, borderColor: UI.cardBorder, overflow: 'hidden' },
  publisherPill: { color: UI.accent, fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginBottom: 4 },
  cardTitle: { color: UI.textPrimary, fontWeight: 'bold' },
});