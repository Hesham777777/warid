/**
 * شاشة لوحة التحكم - وارد 3.0
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES, SPACING } from '../utils/constants';
import { Card, CustomButton, StatusBadge, LoadingScreen, EmptyState } from '../components/Common';
import databaseService from '../services/database';

const DashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completedToday: 0,
    late: 0,
    pending: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * تحميل بيانات لوحة التحكم
   */
  const loadDashboardData = async () => {
    try {
      const dashboardStats = await databaseService.getDashboardStats();
      setStats(dashboardStats);

      const transactions = await databaseService.getAllTransactions({});
      setRecentTransactions(transactions.slice(0, 5)); // آخر 5 معاملات
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * سحب للتحديث
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  /**
   * بطاقة إحصائية
   */
  const StatCard = ({ title, value, color, icon }) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        {icon && <View style={styles.statIcon}>{icon}</View>}
      </View>
    </Card>
  );

  if (loading) {
    return <LoadingScreen message={t('loading')} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* العنوان */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('dashboard.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* الإحصائيات */}
      <View style={styles.statsGrid}>
        <StatCard
          title={t('dashboard.totalTransactions')}
          value={stats.total}
          color={COLORS.primary}
        />
        <StatCard
          title={t('dashboard.activeTransactions')}
          value={stats.active}
          color={COLORS.statusActive}
        />
        <StatCard
          title={t('dashboard.completedToday')}
          value={stats.completedToday}
          color={COLORS.success}
        />
        <StatCard
          title={t('dashboard.lateTransactions')}
          value={stats.late}
          color={COLORS.error}
        />
      </View>

      {/* المعاملات الأخيرة */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('dashboard.recentActivity')}</Text>
          <CustomButton
            title={t('transactions.title')}
            variant="secondary"
            size="small"
            onPress={() => navigation.navigate('Transactions')}
          />
        </View>

        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              onPress={() =>
                navigation.navigate('TransactionDetails', { id: transaction.id })
              }
            >
              <View style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionNumber} numberOfLines={1}>
                    {transaction.transaction_number}
                  </Text>
                  <Text style={styles.transactionSubject} numberOfLines={2}>
                    {transaction.subject}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date_received).toLocaleDateString('ar-SA')}
                  </Text>
                </View>
                <StatusBadge status={transaction.status} />
              </View>
            </Card>
          ))
        ) : (
          <EmptyState
            title="لا توجد معاملات"
            subtitle="ابدأ بإضافة معاملة جديدة"
            action={
              <CustomButton
                title={t('transactions.newTransaction')}
                onPress={() => navigation.navigate('NewTransaction')}
              />
            }
          />
        )}
      </View>

      {/* إجراءات سريعة */}
      <View style={styles.quickActions}>
        <CustomButton
          title={t('transactions.newTransaction')}
          onPress={() => navigation.navigate('NewTransaction')}
          style={styles.quickActionButton}
        />
        <CustomButton
          title={t('search.title')}
          variant="secondary"
          onPress={() => navigation.navigate('Search')}
          style={styles.quickActionButton}
        />
        <CustomButton
          title={t('notifications.title')}
          variant="secondary"
          onPress={() => navigation.navigate('Notifications')}
          style={styles.quickActionButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: SIZES.fontSizeXXL,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: SIZES.fontSizeMD,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: '48%',
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.fontSizeXXXL,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statTitle: {
    fontSize: SIZES.fontSizeSM,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontSizeXL,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  transactionNumber: {
    fontSize: SIZES.fontSizeSM,
    color: COLORS.primary,
    fontWeight: '600',
  },
  transactionSubject: {
    fontSize: SIZES.fontSizeMD,
    color: COLORS.textPrimary,
    marginVertical: SPACING.xs,
  },
  transactionDate: {
    fontSize: SIZES.fontSizeSM,
    color: COLORS.textSecondary,
  },
  quickActions: {
    marginBottom: SPACING.xl,
  },
  quickActionButton: {
    marginBottom: SPACING.sm,
  },
});

export default DashboardScreen;
