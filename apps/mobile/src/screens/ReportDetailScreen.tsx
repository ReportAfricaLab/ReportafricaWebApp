import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { reportsAPI, followsAPI, tipsAPI, reportUpdatesAPI } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { theme } from '../theme';

export default function ReportDetailScreen({ route }: any) {
  const { id } = route.params;
  const navigation = useNavigation<any>();
  const { user } = useAppStore();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [updates, setUpdates] = useState<any[]>([]);
  const [showTip, setShowTip] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [updateText, setUpdateText] = useState('');

  useEffect(() => {
    reportsAPI.getById(id).then((res) => setReport(res.data)).finally(() => setLoading(false));
    reportUpdatesAPI.getByReport(id).then((res) => setUpdates(res.data?.data || [])).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!report?.author?.id || report.author.id === user?.id) return;
    followsAPI.isFollowing(report.author.id).then((res) => setIsFollowing(res.data)).catch(() => {});
  }, [report]);

  const handleVote = async (type: 'upvote' | 'downvote') => {
    try {
      const res = type === 'upvote' ? await reportsAPI.upvote(id) : await reportsAPI.downvote(id);
      setReport(res.data);
    } catch {}
  };

  const handleFollow = async () => {
    if (!report?.author?.id) return;
    try {
      if (isFollowing) {
        await followsAPI.unfollow(report.author.id);
        setIsFollowing(false);
      } else {
        await followsAPI.follow(report.author.id);
        setIsFollowing(true);
      }
    } catch {}
  };

  const handleTip = async () => {
    const amount = Number(tipAmount);
    if (!amount || amount < 100) { Alert.alert('Error', 'Minimum tip is ₦100'); return; }
    try {
      const res = await tipsAPI.create({ reportId: id, amount, email: user?.email || '' });
      if (res.data?.paymentUrl) {
        Alert.alert('Tip Initiated', 'Payment link generated. Complete payment to send tip.');
      }
      setShowTip(false); setTipAmount('');
    } catch { Alert.alert('Error', 'Failed to initiate tip'); }
  };

  const handlePostUpdate = async () => {
    if (!updateText.trim()) return;
    try {
      await reportUpdatesAPI.create({ reportId: id, text: updateText.trim() });
      const res = await reportUpdatesAPI.getByReport(id);
      setUpdates(res.data?.data || []);
      setUpdateText('');
    } catch { Alert.alert('Error', 'Failed to post update'); }
  };

  if (loading) return <View style={styles.center}><Text style={styles.loadingText}>Loading...</Text></View>;
  if (!report) return <View style={styles.center}><Text style={styles.loadingText}>Report not found</Text></View>;

  const isAuthor = report.authorId === user?.id || report.author?.id === user?.id;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return theme.colors.emergency;
      case 'high': return theme.colors.humanitarian;
      case 'medium': return theme.colors.secondary;
      default: return theme.colors.info;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Severity + Category */}
      <View style={styles.row}>
        <View style={[styles.badge, { backgroundColor: getSeverityColor(report.severity) }]}>
          <Text style={styles.badgeText}>{report.severity.toUpperCase()}</Text>
        </View>
        <Text style={styles.category}>{report.category.replace('_', ' ')}</Text>
        <Text style={styles.verification}>{report.verificationLevel.replace('_', ' ')}</Text>
      </View>

      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.description}>{report.description}</Text>

      {/* Location */}
      <View style={styles.locationBox}>
        <Text style={styles.locationText}>📍 {report.city || report.state || `${Number(report.latitude).toFixed(4)}, ${Number(report.longitude).toFixed(4)}`}</Text>
        <Text style={styles.countryText}>{report.country}</Text>
      </View>

      {/* Author + Follow */}
      <View style={styles.authorSection}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorLabel}>Reported by </Text>
          <Text style={styles.authorName}>{report.author?.displayName || 'Anonymous'}</Text>
        </View>
        {report.author?.id && !isAuthor && (
          <TouchableOpacity style={[styles.followBtn, isFollowing && styles.followBtnActive]} onPress={handleFollow}>
            <Text style={[styles.followBtnText, isFollowing && styles.followBtnTextActive]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.date}>{new Date(report.createdAt).toLocaleString()}</Text>

      {/* Voting */}
      <View style={styles.voteRow}>
        <TouchableOpacity style={styles.confirmBtn} onPress={() => handleVote('upvote')}>
          <Text style={styles.confirmText}>↑ Confirm ({report.upvotes})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.disputeBtn} onPress={() => handleVote('downvote')}>
          <Text style={styles.disputeText}>↓ Dispute ({report.downvotes})</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.views}>👁️ {report.viewCount} views · 💬 {report.commentCount} comments</Text>

      {/* Tip Reporter */}
      {!isAuthor && (
        <>
          <TouchableOpacity style={styles.tipBtn} onPress={() => setShowTip(!showTip)}>
            <Text style={styles.tipBtnText}>💰 Tip Reporter</Text>
          </TouchableOpacity>
          {showTip && (
            <View style={styles.tipForm}>
              <TextInput style={styles.tipInput} value={tipAmount} onChangeText={setTipAmount}
                placeholder="Amount (min ₦100)" keyboardType="numeric" />
              <TouchableOpacity style={styles.tipSendBtn} onPress={handleTip}>
                <Text style={styles.tipSendText}>Send Tip</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {/* Comments Button */}
      <TouchableOpacity style={styles.commentsBtn} onPress={() => navigation.navigate('Comments', { reportId: id })}>
        <Text style={styles.commentsBtnText}>💬 View Comments ({report.commentCount})</Text>
      </TouchableOpacity>

      {/* Report Updates */}
      <View style={styles.updatesSection}>
        <Text style={styles.updatesTitle}>📝 Updates ({updates.length})</Text>

        {isAuthor && (
          <View style={styles.updateInputRow}>
            <TextInput style={styles.updateInput} value={updateText} onChangeText={setUpdateText}
              placeholder="Post an update on this report..." multiline maxLength={500} />
            <TouchableOpacity style={styles.updatePostBtn} onPress={handlePostUpdate}>
              <Text style={styles.updatePostText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}

        {updates.map((u: any) => (
          <View key={u.id} style={styles.updateCard}>
            <Text style={styles.updateType}>{u.type === 'resolution' ? '✅' : u.type === 'escalation' ? '⚠️' : '📝'} {u.type}</Text>
            <Text style={styles.updateText}>{u.text}</Text>
            <Text style={styles.updateTime}>{new Date(u.createdAt).toLocaleString()}</Text>
          </View>
        ))}

        {updates.length === 0 && <Text style={styles.noUpdates}>No updates yet</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.light.background },
  content: { padding: 16, paddingTop: 60, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: theme.colors.light.textSecondary },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  category: { fontSize: 12, color: theme.colors.light.textSecondary, textTransform: 'capitalize' },
  verification: { marginLeft: 'auto', fontSize: 11, color: theme.colors.primary, textTransform: 'capitalize' },
  title: { fontSize: 22, fontWeight: '700', color: theme.colors.light.text, marginBottom: 10 },
  description: { fontSize: theme.fontSize.md, color: theme.colors.light.textSecondary, lineHeight: 24, marginBottom: 20 },
  locationBox: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.light.border, marginBottom: 16 },
  locationText: { fontSize: 13, color: theme.colors.light.textSecondary },
  countryText: { fontSize: 12, color: theme.colors.light.textSecondary },
  authorSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  authorInfo: { flexDirection: 'row', alignItems: 'center' },
  authorLabel: { fontSize: 13, color: theme.colors.light.textSecondary },
  authorName: { fontSize: 13, fontWeight: '600', color: theme.colors.light.text },
  followBtn: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: theme.colors.primary, borderRadius: 6 },
  followBtnActive: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: theme.colors.light.border },
  followBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  followBtnTextActive: { color: theme.colors.light.textSecondary },
  date: { fontSize: 12, color: theme.colors.light.textSecondary, marginBottom: 20 },
  voteRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  confirmBtn: { flex: 1, paddingVertical: 12, backgroundColor: '#ecfdf5', borderRadius: 8, alignItems: 'center' },
  confirmText: { fontSize: 14, fontWeight: '600', color: '#059669' },
  disputeBtn: { flex: 1, paddingVertical: 12, backgroundColor: '#fef2f2', borderRadius: 8, alignItems: 'center' },
  disputeText: { fontSize: 14, fontWeight: '600', color: '#dc2626' },
  views: { fontSize: 12, color: theme.colors.light.textSecondary, textAlign: 'center', marginBottom: 12 },
  tipBtn: { paddingVertical: 12, backgroundColor: '#fef3c7', borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  tipBtnText: { fontSize: 14, fontWeight: '600', color: '#92400e' },
  tipForm: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tipInput: { flex: 1, borderWidth: 1, borderColor: theme.colors.light.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  tipSendBtn: { paddingHorizontal: 16, backgroundColor: theme.colors.secondary, borderRadius: 8, justifyContent: 'center' },
  tipSendText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  commentsBtn: { paddingVertical: 14, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: theme.colors.light.border, alignItems: 'center', marginBottom: 20 },
  commentsBtnText: { fontSize: 14, fontWeight: '600', color: theme.colors.primary },
  updatesSection: { marginTop: 4 },
  updatesTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.light.text, marginBottom: 12 },
  updateInputRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  updateInput: { flex: 1, borderWidth: 1, borderColor: theme.colors.light.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, maxHeight: 80 },
  updatePostBtn: { paddingHorizontal: 16, backgroundColor: theme.colors.primary, borderRadius: 8, justifyContent: 'center' },
  updatePostText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  updateCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.light.border, marginBottom: 8 },
  updateType: { fontSize: 11, fontWeight: '600', color: theme.colors.primary, textTransform: 'capitalize', marginBottom: 4 },
  updateText: { fontSize: 14, color: theme.colors.light.text, lineHeight: 20 },
  updateTime: { fontSize: 11, color: theme.colors.light.textSecondary, marginTop: 6 },
  noUpdates: { fontSize: 13, color: theme.colors.light.textSecondary, textAlign: 'center', paddingVertical: 12 },
});
