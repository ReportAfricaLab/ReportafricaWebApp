import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';
import api from '../services/api';

export default function SubscriptionScreen() {
  const { token, user, userCountry } = useAppStore();
  const [plans, setPlans] = useState<any[]>([]);
  const [mySub, setMySub] = useState<any>(null);

  useEffect(() => {
    api.get(`/subscription/plans?country=${userCountry}`).then(r => setPlans(r.data)).catch(() => {});
    if (token) api.get('/subscription/my').then(r => setMySub(r.data)).catch(() => {});
  }, []);

  const handleSubscribe = async (tier: string) => {
    try {
      const res = await api.post('/subscription/subscribe', { tier, email: user?.email });
      if (res.data?.paymentUrl) Linking.openURL(res.data.paymentUrl);
    } catch {}
  };

  const tierIcons: Record<string, string> = { pro: '🔵', elite: '💜', legend: '👑' };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>⭐ Premium Reporter</Text>
      <Text style={styles.sub}>Verified badge, priority ranking, pro tools.</Text>

      {mySub?.active && (
        <View style={styles.activeBanner}>
          <Text style={styles.activeText}>✓ Active: {mySub.tier.toUpperCase()}</Text>
          <Text style={styles.activeExpiry}>Expires: {new Date(mySub.expires).toLocaleDateString()}</Text>
        </View>
      )}

      {plans.map((p: any) => (
        <View key={p.tier} style={[styles.planCard, p.tier === 'elite' && styles.planHighlight]}>
          <Text style={styles.planIcon}>{tierIcons[p.tier]}</Text>
          <Text style={styles.planName}>{p.label}</Text>
          <Text style={styles.planPrice}>{p.currency} {p.price.toLocaleString()}/mo</Text>
          <View style={styles.featureList}>
            {p.features.map((f: string, i: number) => <Text key={i} style={styles.feature}>{f}</Text>)}
          </View>
          <TouchableOpacity style={[styles.subBtn, mySub?.tier === p.tier && mySub?.active && styles.subBtnDisabled]} onPress={() => handleSubscribe(p.tier)} disabled={mySub?.tier === p.tier && mySub?.active}>
            <Text style={styles.subBtnText}>{mySub?.tier === p.tier && mySub?.active ? 'Current Plan' : 'Subscribe'}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.light.background },
  content: { padding: 16, paddingTop: 60, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '700', color: theme.colors.light.text },
  sub: { fontSize: 13, color: theme.colors.light.textSecondary, marginBottom: 20 },
  activeBanner: { backgroundColor: '#ecfdf5', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#a7f3d0', marginBottom: 16 },
  activeText: { fontSize: 14, fontWeight: '700', color: '#065f46' },
  activeExpiry: { fontSize: 11, color: '#059669', marginTop: 2 },
  planCard: { backgroundColor: '#fff', borderRadius: 14, padding: 20, borderWidth: 2, borderColor: theme.colors.light.border, marginBottom: 14, alignItems: 'center' },
  planHighlight: { borderColor: '#8b5cf6' },
  planIcon: { fontSize: 28, marginBottom: 4 },
  planName: { fontSize: 18, fontWeight: '700', color: theme.colors.light.text },
  planPrice: { fontSize: 24, fontWeight: '700', color: theme.colors.light.text, marginTop: 4 },
  featureList: { marginTop: 14, alignSelf: 'stretch' },
  feature: { fontSize: 12, color: theme.colors.light.textSecondary, lineHeight: 20 },
  subBtn: { marginTop: 16, paddingVertical: 12, paddingHorizontal: 32, backgroundColor: '#1f2937', borderRadius: 8 },
  subBtnDisabled: { opacity: 0.4 },
  subBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
