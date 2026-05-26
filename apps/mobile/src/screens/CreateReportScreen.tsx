import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { reportsAPI } from '../services/api';
import { getCurrentLocation } from '../services/location';
import { theme } from '../theme';
import { REPORT_CATEGORY_LABELS } from '../constants';

const SEVERITY_OPTIONS = ['low', 'medium', 'high', 'critical'] as const;

export default function CreateReportScreen() {
  const { country } = useAppStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState<string>('medium');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const loc = await getCurrentLocation();
      if (loc) {
        setLatitude(loc.latitude);
        setLongitude(loc.longitude);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !category) {
      Alert.alert('Missing Fields', 'Please fill in title, description, and category.');
      return;
    }
    if (!latitude || !longitude) {
      Alert.alert('Location Required', 'Please enable location to tag your report.');
      return;
    }

    setSubmitting(true);
    try {
      await reportsAPI.create({ title, description, category, severity, latitude, longitude, isAnonymous });
      Alert.alert('Report Submitted', 'Your report has been submitted successfully.');
      setTitle('');
      setDescription('');
      setCategory('');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Create Report</Text>
      <Text style={styles.subheading}>Report what&apos;s happening around you</Text>

      {/* Category Selection */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryGrid}>
        {Object.entries(REPORT_CATEGORY_LABELS).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.categoryChip, category === key && styles.categoryChipActive]}
            onPress={() => setCategory(key)}
          >
            <Text style={[styles.categoryChipText, category === key && styles.categoryChipTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Brief title of the incident" maxLength={200} />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Describe what is happening..." multiline numberOfLines={5} maxLength={5000} />

      {/* Severity */}
      <Text style={styles.label}>Severity</Text>
      <View style={styles.severityRow}>
        {SEVERITY_OPTIONS.map((s) => (
          <TouchableOpacity key={s} style={[styles.severityChip, severity === s && styles.severityChipActive]} onPress={() => setSeverity(s)}>
            <Text style={[styles.severityChipText, severity === s && styles.severityChipTextActive]}>{s.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Anonymous Toggle */}
      <TouchableOpacity style={styles.anonymousRow} onPress={() => setIsAnonymous(!isAnonymous)}>
        <View style={[styles.checkbox, isAnonymous && styles.checkboxActive]} />
        <Text style={styles.anonymousText}>Report anonymously</Text>
      </TouchableOpacity>

      {/* Location Status */}
      <View style={styles.locationRow}>
        <Text style={styles.locationText}>
          📍 {latitude && longitude ? `Location detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})` : 'Detecting location...'}
        </Text>
      </View>

      {/* Submit */}
      <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit Report'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.light.background },
  content: { padding: 16, paddingTop: 60 },
  heading: { fontSize: theme.fontSize.xl, fontWeight: '700', color: theme.colors.light.text },
  subheading: { fontSize: theme.fontSize.sm, color: theme.colors.light.textSecondary, marginBottom: 24 },
  label: { fontSize: theme.fontSize.sm, fontWeight: '600', color: theme.colors.light.text, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: theme.colors.light.border, borderRadius: theme.borderRadius.sm, padding: 12, fontSize: theme.fontSize.md },
  textArea: { height: 120, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: theme.colors.light.border },
  categoryChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  categoryChipText: { fontSize: theme.fontSize.xs, color: theme.colors.light.textSecondary },
  categoryChipTextActive: { color: '#fff', fontWeight: '600' },
  severityRow: { flexDirection: 'row', gap: 8 },
  severityChip: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: theme.colors.light.border, alignItems: 'center' },
  severityChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  severityChipText: { fontSize: 11, fontWeight: '600', color: theme.colors.light.textSecondary },
  severityChipTextActive: { color: '#fff' },
  anonymousRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: theme.colors.light.border },
  checkboxActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  anonymousText: { fontSize: theme.fontSize.sm, color: theme.colors.light.text },
  locationRow: { marginTop: 16, padding: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: theme.colors.light.border },
  locationText: { fontSize: theme.fontSize.sm, color: theme.colors.light.textSecondary },
  submitBtn: { marginTop: 24, backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: theme.borderRadius.md, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: theme.fontSize.md, fontWeight: '700' },
});
