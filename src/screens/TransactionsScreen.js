/**
 * شاشة قائمة المعاملات - وارد 3.0
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES, SPACING, TRANSACTION_STATUS } from '../utils/constants';
import { Card, StatusBadge, PriorityBadge, LoadingScreen, EmptyState, Input, CustomButton } from '../components/Common';
import databaseService from '../services/database';
import { formatDate } from '../utils/helpers';

const TransactionsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery, selectedStatus]);

  /**
   * تحميل المعاملات
   */
  const loadTransactions = async () => {
    try {
      const data = await databaseService.getAllTransactions({});
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * تصفية المعاملات
   */
  const filterTransactions = () => {
    let filtered = [...transactions];

    // تصفية حسب البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.transaction_number?.toLowerCase().includes(query) ||
          t.subject?.toLowerCase().includes(query) ||
          t.sender?.toLowerCase().includes(query)
      );
    }

    // تصفية حسب الحالة
    if (selectedStatus) {
      filtered = filtered.filter((t) => t.status === selectedStatus);
    }

    setFilteredTransactions(filtered);
  };

  /**
   * سحب للتحديث
   */
  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  /**
   * تبديل حالة التصفية
   */
  const toggleStatusFilter = (status) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  /**
   *_renderItem
   */
  const renderItem = ({ item }) => (
    <Card
      onPress={() => navigation.navigate('TransactionDetails', { id: item.id })}
    >
      <View style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionNumber} numberOfLines={1}>
            {item.transaction_number}
          </Text>
          <PriorityBadge priority={item.priority} />
        </View>

        <Text style={styles.transactionSubject} numberOfLines={2}>
          {item.subject}
        </Text>

        <View style={styles.transactionMeta}>
          <Text style={styles.transactionSender}>
            {t('transactions.sender')}: {item.sender}
          </Text>
          <Text style={styles.transactionDate}>
            {formatDate(item.date_received)}
          </Text>
        </View>

        <View style={styles.transactionFooter}>
          <StatusBadge status={item.status} size="medium" />
          {item.deadline && (
            <Text
              style={[
                styles.deadlineText,
                new Date(item.deadline) < new Date() && styles.deadlineLate,
              ]}
            >
              {t('transactions.deadline')}: {formatDate(item.deadline)}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );

  /**
   * مصفوفة حالات المعاملات للتصفية
   */
  const statusFilters = Object.values(TRANSACTION_STATUS);

  if (loading) {
    return <LoadingScreen message={t('loading')} />;
  }

  return (
    <View style={styles.container}>
      {/* شريط البحث */}
      <View style={styles.searchBar}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('search.keyword')}
          style={styles.searchInput}
        />
      </View>

      {/* تصفية الحالات */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {statusFilters.map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => toggleStatusFilter(status)}
              style={[
                styles.filterChip,
                selectedStatus === status && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedStatus === status && styles.filterChipTextActive,
                ]}
              >
                {t(`status.${status}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* قائمة المعاملات */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title={t('transactions.title')}
            subtitle={searchQuery || selectedStatus ? 'لا توجد نتائج' : 'ابدأ بإضافة معاملة جديدة'}
            action={
              !searchQuery && !selectedStatus && (
                <CustomButton
                  title={t('transactions.newTransaction')}
                  onPress={() => navigation.navigate('NewTransaction')}
                />
              )
            }
          />
        }
      />

      {/* زر إضافة معاملة جديدة */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewTransaction')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchBar: {
    padding: SPACING.md,
    paddingBottom: 0,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterContainer: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterScrollContent: {
    paddingHorizontal: SPACING.md,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: SIZES.radiusRound,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: SIZES.fontSizeSM,
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.textLight,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: 100,
  },
  transactionCard: {
    padding: SPACING.md,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  transactionNumber: {
    fontSize: SIZES.fontSizeSM,
    color: COLORS.primary,
    fontWeight: '600',
    flex: 1,
  },
  transactionSubject: {
    fontSize: SIZES.fontSizeMD,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  transactionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  transactionSender: {
    fontSize: SIZES.fontSizeSM,
    color: COLORS.textSecondary,
  },
  transactionDate: {
    fontSize: SIZES.fontSizeSM,
    color: COLORS.textSecondary,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: SIZES.fontSizeXS,
    color: COLORS.textSecondary,
  },
  deadlineLate: {
    color: COLORS.error,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 24,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
});

// استيراد ScrollView
import { ScrollView } from 'react-native';

export default TransactionsScreen;
