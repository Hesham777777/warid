import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, TransactionService } from '../services/database';
import { STATUS_COLORS } from '../utils/constants';

export default function DashboardScreen({ navigation }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ active: 0, overdue: 0, endingToday: 0, completionRate: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      const db = await getDatabase();
      const dashboardStats = await TransactionService.getDashboardStats(db);
      const recent = await TransactionService.getAll(db, { limit: 5 });
      setStats(dashboardStats);
      setRecentTransactions(recent || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, icon, color }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={() => navigation.navigate('Transactions')}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('welcome');
    return t('goodEvening');
  };

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
        {recentTransactions.length === 0 ? (
          <View style={styles.emptyState}><Text>{t('common.noData')}</Text></View>
        ) : (
          recentTransactions.map((tx) => (
            <TouchableOpacity key={tx.id} style={styles.transactionCard} onPress={() => navigation.navigate('TransactionDetail', { id: tx.id })}>
              <View style={styles.txHeader}>
                <Text style={styles.txNumber}>{tx.transaction_number}</Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[tx.status] || '#6B7280' }]}><Text style={styles.badgeText}>{tx.status}</Text></View>
              </View>
              <Text style={styles.txSubject}>{tx.subject}</Text>
              <Text style={styles.txSender}>{tx.sender}</Text>
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
});
