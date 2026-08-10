import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, TransactionService } from '../services/database';
import { STATUS_COLORS } from '../utils/constants';

export default function DashboardScreen({ navigation }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ active: 0, overdue: 0, endingToday: 0, completionRate: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const db = await getDatabase();
      const dashboardStats = await TransactionService.getDashboardStats(db);
      const recent = await TransactionService.getAll(db, { limit: 5 });
      setStats(dashboardStats || { active: 0, overdue: 0, endingToday: 0, completionRate: 0 });
      setRecentTransactions(recent || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }, [loadDashboard]);

  const StatCard = useCallback(({ title, value, icon, color }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={() => navigation.navigate('Transactions')}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  ), [navigation]);

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('welcome');
    return t('goodEvening');
  }, [t]);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{t('common.error')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDashboard}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.subtitle}>{t('dashboard.needsAttention')}</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard title={t('dashboard.activeTransactions')} value={stats.active} icon="pulse" color="#10B981" />
        <StatCard title={t('dashboard.overdueTransactions')} value={stats.overdue} icon="alert-circle" color="#EF4444" />
        <StatCard title={t('dashboard.endingToday')} value={stats.endingToday} icon="calendar" color="#F97316" />
        <StatCard title={t('dashboard.completionRate')} value={`${stats.completionRate}%`} icon="checkmark-circle" color="#3B82F6" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('dashboard.newInbox')}</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : recentTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={48} color="#D1D5DB" />
            <Text>{t('common.noData')}</Text>
          </View>
        ) : (
          recentTransactions.map((tx) => (
            <TouchableOpacity 
              key={tx?.id?.toString() || Math.random().toString()} 
              style={styles.transactionCard} 
              onPress={() => navigation.navigate('TransactionDetail', { id: tx.id })}
            >
              <View style={styles.txHeader}>
                <Text style={styles.txNumber}>{tx?.transaction_number || ''}</Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[tx?.status] || '#6B7280' }]}>
                  <Text style={styles.badgeText}>{tx?.status || ''}</Text>
                </View>
              </View>
              <Text style={styles.txSubject} numberOfLines={2}>{tx?.subject || ''}</Text>
              <Text style={styles.txSender}>{tx?.sender || ''}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: '#fff', padding: 16, borderRadius: 12, borderLeftWidth: 4 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginTop: 8 },
  statTitle: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  transactionCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  txNumber: { fontSize: 12, color: '#6B7280' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  txSubject: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  txSender: { fontSize: 14, color: '#6B7280' },
  emptyState: { padding: 32, alignItems: 'center', backgroundColor: '#fff', borderRadius: 12 },
  loadingContainer: { padding: 32, alignItems: 'center', backgroundColor: '#fff', borderRadius: 12 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 16, color: '#EF4444', marginTop: 16, textAlign: 'center' },
  retryButton: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#3B82F6', borderRadius: 8 },
  retryButtonText: { color: '#fff', fontWeight: '600' },
});
