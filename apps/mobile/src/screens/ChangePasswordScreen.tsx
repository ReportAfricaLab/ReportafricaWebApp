import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';

const API_URL = __DEV__ ? 'http://10.162.41.17:3001/api/v1' : 'https://api.reportafrica.africa/api/v1';

export default function ChangePasswordScreen({ navigation }: any) {
  const { token } = useAppStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) { Alert.alert('Error', 'All fields are required'); return; }
    if (newPassword.length < 8) { Alert.alert('Error', 'New password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { Alert.alert('Error', 'New passwords do not match'); return; }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/change-password`, { currentPassword, newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      Alert.alert('Success', 'Password changed successfully. Please log in again.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <TextInput style={styles.input} value={currentPassword} onChangeText={setCurrentPassword} placeholder="Current Password" secureTextEntry />
      <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="New Password (min 8 chars)" secureTextEntry />
      <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm New Password" secureTextEntry />
      <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Changing...' : 'Change Password'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.light.background, padding: 20, paddingTop: 40 },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.light.text, marginBottom: 24 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: theme.colors.light.border, borderRadius: 10, padding: 14, fontSize: 15, marginBottom: 14 },
  btn: { backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
