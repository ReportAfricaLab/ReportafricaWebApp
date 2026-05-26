import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { reportsAPI } from '../services/api';
import { getCurrentLocation } from '../services/location';
import { theme } from '../theme';

interface MapReport {
  id: string;
  title: string;
  category: string;
  severity: string;
  latitude: number;
  longitude: number;
}

export default function MapScreen() {
  const [reports, setReports] = useState<MapReport[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const loc = await getCurrentLocation();
        if (loc) {
          setLocation({ latitude: loc.latitude, longitude: loc.longitude });
          const res = await reportsAPI.getNearby(loc.latitude, loc.longitude, 15);
          setReports(res.data);
        }
      } catch (err) {
        console.log('Location error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return theme.colors.emergency;
      case 'high': return theme.colors.humanitarian;
      case 'medium': return theme.colors.secondary;
      default: return theme.colors.info;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 Nearby Incidents</Text>
        <Text style={styles.headerSub}>
          {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Detecting location...'}
        </Text>
      </View>

      {/* Report List */}
      {loading ? (
        <View style={styles.center}><Text style={styles.loadingText}>Finding nearby reports...</Text></View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}><Text style={styles.emptyText}>No incidents nearby</Text></View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardRow}>
                <View style={[styles.dot, { backgroundColor: getSeverityColor(item.severity) }]} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.cardMeta}>{item.category.replace('_', ' ')} · {item.severity}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.light.background },
  header: { paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: theme.colors.light.border },
  headerTitle: { fontSize: theme.fontSize.xl, fontWeight: '700', color: theme.colors.light.text },
  headerSub: { fontSize: theme.fontSize.xs, color: theme.colors.light.textSecondary, marginTop: 4 },
  list: { padding: 16, gap: 10 },
  card: { backgroundColor: '#fff', borderRadius: theme.borderRadius.md, padding: 14, borderWidth: 1, borderColor: theme.colors.light.border },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: theme.fontSize.sm, fontWeight: '600', color: theme.colors.light.text },
  cardMeta: { fontSize: theme.fontSize.xs, color: theme.colors.light.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  loadingText: { color: theme.colors.light.textSecondary },
  emptyText: { color: theme.colors.light.textSecondary, fontSize: theme.fontSize.md },
});
