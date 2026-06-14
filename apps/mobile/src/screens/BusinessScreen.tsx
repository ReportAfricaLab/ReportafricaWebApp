import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';
import api from '../services/api';

const CATEGORIES = ['restaurant', 'clinic', 'shop', 'bank', 'fuel_station', 'hotel', 'pharmacy', 'school', 'salon', 'logistics', 'other'];

export default function BusinessScreen() {
  const { token, user, userCountry } = useAppStore();
  const [tab, setTab] = useState<'plans' | 'register' | 'my'>('plans');
  const [plans, setPlans] = useState<any[]>([]);
  const [myBusinesses, setMyBusinesses] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/businesses/plans?country=${userCountry}`).then(r => setPlans(r.data)).catch(() => {});
    if (token) api.get('/businesses/my').then(r => setMyBusinesses(r.data)).catch(() => {});
  }, []);

  const handleRegister = async () => {
    if (!name || !category) { Alert.alert('Error', 'Name and category required'); return; }
    setLoading(true);
    try {
      const res = await api.post('/businesses/register', { name, category, phone, address });
      setMyBusinesses(prev => [res.data, ...prev]);
      setTab('my');
      Alert.alert('Success', 'Business registered! Subscribe for verification badge.');
      setName(''); setCategory(''); setPhone(''); setAddress('');
    } catch (err: any) { Alert.alert('Error', err?.response?.data?.message || 'Failed'); }
    setLoading(false);
  };

  const handleSubscribe = async (businessId: string, tier: string) => {
    try {
      const res = await api.post('/businesses/subscribe', { businessId, tier, email: user?.email });
      if (res.data?.paymentUrl) Linking.openURL(res.data.paymentUrl);
      else Alert.alert('Error', 'Failed to start subscription');
    } catch { Alert.alert('Error', 'Failed'); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>🏪 Business Trust Badges</Text>
      <Text style={styles.sub}>Get verified, respond to reports, build trust.</Text>

      <View style={styles.tabs}>
        {(['plans', 'register', 'my'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'plans' ? '💎 Plans' : t === 'register' ? '📝 Register' : '🏢 My'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'plans' && plans.map((p: any) => (
        <View key={p.tier} style={[styles.planCard, p.tier === 'pro' && styles.planCardHighlight]}>
          {p.tier === 'pro' && <Text style={styles.popular}>MOST POPULAR</Text>}
          <Text style={styles.planName}>{p.label}</Text>
          <Text style={styles.planPrice}>{p.currency} {p.price.toLocaleString()}/mo</Text>
          <Text style={styles.planFeatures}>✓ Verified badge{'\n'}✓ Respond to reports{p.tier !== 'basic' ? '\n✓ Promoted in feed\n✓ Analytics' : ''}{p.tier === 'enterprise' ? '\n✓ Priority alerts\n✓ Dedicated support' : ''}</Text>
          <TouchableOpacity style={styles.planBtn} onPress={() => setTab('register')}><Text style={styles.planBtnText}>Get Started</Text></TouchableOpacity>
        </View>
      ))}

      {tab === 'register' && (
        <View style={styles.form}>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Business Name" />
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c} style={[styles.catChip, category === c && styles.catChipActive]} onPress={() => setCategory(c)}>
                <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>{c.replace('_', ' ')}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Address" />
          <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading}>
            <Text style={styles.submitBtnText}>{loading ? '...' : 'Register Business'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {tab === 'my' && (
        <View>
          {myBusinesses.length === 0 && <Text style={styles.empty}>No businesses yet</Text>}
          {myBusinesses.map((b: any) => (
            <View key={b.id} style={styles.bizCard}>
              <View style={styles.bizHeader}>
                <Text style={styles.bizName}>{b.name}</Text>
                {b.isVerified && <Text style={styles.verifiedBadge}>✓ Verified</Text>}
              </View>
              <Text style={styles.bizCategory}>{b.category.replace('_', ' ')}</Text>
              {b.subscriptionTier === 'none' && plans.map((p: any) => (
                <TouchableOpacity key={p.tier} style={styles.subBtn} onPress={() => handleSubscribe(b.id, p.tier)}>
                  <Text style={styles.subBtnText}>{p.label} — {p.currency} {p.price.toLocaleString()}/mo</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.light.background },
  content: { padding: 16, paddingTop: 60, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '700', color: theme.colors.light.text },
  sub: { fontSize: 13, color: theme.colors.light.textSecondary, marginBottom: 20 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
  tabActive: { backgroundColor: theme.colors.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: theme.colors.light.textSecondary },
  tabTextActive: { color: '#fff' },
  planCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: theme.colors.light.border, marginBottom: 12, alignItems: 'center' },
  planCardHighlight: { borderColor: theme.colors.primary, borderWidth: 2 },
  popular: { fontSize: 9, fontWeight: '700', color: theme.colors.primary, marginBottom: 4 },
  planName: { fontSize: 18, fontWeight: '700', color: theme.colors.light.text },
  planPrice: { fontSize: 22, fontWeight: '700', color: theme.colors.light.text, marginTop: 4 },
  planFeatures: { fontSize: 12, color: theme.colors.light.textSecondary, marginTop: 12, lineHeight: 20 },
  planBtn: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 24, backgroundColor: theme.colors.primary, borderRadius: 8 },
  planBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: theme.colors.light.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  catChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f3f4f6' },
  catChipActive: { backgroundColor: theme.colors.primary },
  catChipText: { fontSize: 11, color: theme.colors.light.textSecondary },
  catChipTextActive: { color: '#fff', fontWeight: '600' },
  submitBtn: { paddingVertical: 14, backgroundColor: theme.colors.primary, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  empty: { textAlign: 'center', color: theme.colors.light.textSecondary, paddingVertical: 30 },
  bizCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.light.border, marginBottom: 12 },
  bizHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  bizName: { fontSize: 16, fontWeight: '700', color: theme.colors.light.text },
  verifiedBadge: { fontSize: 10, color: '#059669', backgroundColor: '#ecfdf5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: '600' },
  bizCategory: { fontSize: 12, color: theme.colors.light.textSecondary, textTransform: 'capitalize', marginBottom: 10 },
  subBtn: { paddingVertical: 10, backgroundColor: theme.colors.primary, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  subBtnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
});
