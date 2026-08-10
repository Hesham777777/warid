import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, TransactionService } from '../services/database';
import { STATUS_COLORS, TRANSACTION_STATUS } from '../utils/constants';

export default function TransactionsScreen({ navigation }) {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const db = await getDatabase();
      const filters = { search: searchQuery, status: filterStatus };
      const result = await TransactionService.getAll(db, filters);
      setTransactions(result || []);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterStatus]);
  
  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  const renderTransaction = useCallback(({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TransactionDetail', { id: item.id })}>
      <View style={styles.cardHeader}>
        <Text style={styles.txNumber}>{item.transaction_number}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] || '#6B7280' }]}>
          <Text style={styles.badgeText}>{t(`status.${item.status}`) || item.status}</Text>
        </View>
      </View>
      <Text style={styles.subject} numberOfLines={2}>{item?.subject || ''}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.sender}>{item?.sender || ''}</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('ar-SA')}</Text>
      </View>
    </TouchableOpacity>
  ), [navigation, t]);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{t('common.error')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTransactions}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput 
          style={styles.searchInput} 
          placeholder={t('transaction.search')} 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          placeholderTextColor="#9CA3AF" 
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.filterChip, !filterStatus && styles.filterChipActive]} 
            onPress={() => setFilterStatus(null)}
          >
            <Text style={[styles.filterChipText, !filterStatus && styles.filterChipTextActive]}>
              {t('transaction.all')}
            </Text>
          </TouchableOpacity>
          {Object.keys(TRANSACTION_STATUS).map(key => (
            <TouchableOpacity 
              key={key} 
              style={[styles.filterChip, filterStatus === TRANSACTION_STATUS[key] && styles.filterChipActive]} 
              onPress={() => setFilterStatus(TRANSACTION_STATUS[key])}
            >
              <Text style={[styles.filterChipText, filterStatus === TRANSACTION_STATUS[key] && styles.filterChipTextActive]}>
                {t(`status.${TRANSACTION_STATUS[key]}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList 
          data={transactions} 
          renderItem={renderTransaction} 
          keyExtractor={item => item?.id?.toString() || Math.random().toString()} 
          contentContainerStyle={styles.list} 
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={10}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="folder-open-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>{t('common.noData')}</Text>
            </View>
          } 
        />
      )}
      
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateTransaction')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, padding: 12, borderRadius: 12, elevation: 1 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#1F2937' },
  filterRow: { paddingHorizontal: 16, marginBottom: 12 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  filterChipActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  filterChipText: { color: '#6B7280', fontSize: 14 },
  filterChipTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  txNumber: { fontSize: 12, color: '#6B7280' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  subject: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  sender: { fontSize: 14, color: '#6B7280' },
  date: { fontSize: 12, color: '#9CA3AF' },
  empty: { alignItems: 'center', padding: 48 },
  emptyText: { marginTop: 16, fontSize: 16, color: '#9CA3AF' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 16, color: '#EF4444', marginTop: 16, textAlign: 'center' },
  retryButton: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#3B82F6', borderRadius: 8 },
  retryButtonText: { color: '#fff', fontWeight: '600' },
});
