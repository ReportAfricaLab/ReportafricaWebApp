import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { theme } from '../theme';

const FEATURES = [
  { title: 'Live Reporting', desc: 'Go live instantly from any incident scene. Broadcast events in real time.', emoji: '📡' },
  { title: 'Geo-Based Map', desc: 'Interactive incident map showing live events, traffic, and emergencies near you.', emoji: '🗺️' },
  { title: 'AI Verification', desc: 'AI-powered content verification to combat fake news and misinformation.', emoji: '🤖' },
  { title: 'Emergency SOS', desc: 'One-tap emergency reporting with automatic location sharing and alerts.', emoji: '🚨' },
  { title: 'Community Support', desc: 'Help fellow citizens through verified humanitarian fundraising campaigns.', emoji: '🤝' },
  { title: 'Anonymous Reports', desc: 'Report safely with identity protection, face blur, and voice masking.', emoji: '🛡️' },
];

const CATEGORIES = ['Traffic', 'Police & Security', 'Government', 'Construction', 'Elections', 'Emergency', 'Environmental', 'Market & Consumer'];

export default function LandingScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Africa's Real-Time Citizen Reporting Network</Text>
        </View>
        <Text style={styles.heroTitle}>
          See It. Report It.{'\n'}
          <Text style={styles.heroHighlight}>Change It.</Text>
        </Text>
        <Text style={styles.heroDesc}>
          Empower your community with real-time reporting. Report traffic, emergencies, corruption, and more — instantly from your phone.
        </Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.ctaBtnText}>Start Reporting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryBtnText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Platform Features</Text>
        <View style={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureCard}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Report Categories</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <View key={cat} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{cat}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Image source={require('../../assets/logo.png')} style={styles.footerLogo} resizeMode="contain" />
        <View style={styles.footerLinks}>
          {['About', 'FAQ', 'Privacy', 'Terms', 'Contact'].map((page) => (
            <TouchableOpacity key={page} onPress={() => navigation.navigate('Info', { page })}>
              <Text style={styles.footerLink}>{page}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.footerText}>© 2024 ReportAfrica. Africa's Citizen-Powered Reporting Platform.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingBottom: 40 },
  hero: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, paddingBottom: 40 },
  logo: { width: 200, height: 55, marginBottom: 20 },
  badge: { backgroundColor: 'rgba(15,123,108,0.1)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
  badgeText: { fontSize: 11, fontWeight: '600', color: theme.colors.primary },
  heroTitle: { fontSize: 36, fontWeight: '800', color: '#111', textAlign: 'center', lineHeight: 44, marginBottom: 16 },
  heroHighlight: { color: theme.colors.primary },
  heroDesc: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24, marginBottom: 30, paddingHorizontal: 10 },
  ctaBtn: { backgroundColor: theme.colors.primary, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 12, marginBottom: 14 },
  ctaBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  secondaryBtn: { paddingVertical: 10 },
  secondaryBtnText: { color: theme.colors.primary, fontSize: 14, fontWeight: '600' },
  section: { paddingHorizontal: 20, paddingVertical: 30 },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#111', textAlign: 'center', marginBottom: 20 },
  featuresGrid: { gap: 12 },
  featureCard: { backgroundColor: '#fff', borderRadius: 12, padding: 18, borderWidth: 1, borderColor: '#F3F4F6' },
  featureEmoji: { fontSize: 24, marginBottom: 8 },
  featureTitle: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 4 },
  featureDesc: { fontSize: 13, color: '#6B7280', lineHeight: 19 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  categoryChip: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 18, borderWidth: 1, borderColor: '#F3F4F6' },
  categoryText: { fontSize: 13, fontWeight: '500', color: '#374151' },
  footer: { alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20, backgroundColor: '#1F2937', marginTop: 20 },
  footerLogo: { width: 140, height: 36, marginBottom: 10 },
  footerLinks: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 12 },
  footerLink: { fontSize: 12, color: '#9CA3AF' },
  footerText: { fontSize: 12, color: '#9CA3AF', textAlign: 'center' },
});
