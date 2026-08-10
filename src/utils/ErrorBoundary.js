import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.title}>حدث خطأ غير متوقع</Text>
          <Text style={styles.message}>{this.state.error?.message || 'خطأ عام'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={this.handleReset}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F9FAFB' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginTop: 16 },
  message: { fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center' },
  retryButton: { marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, backgroundColor: '#3B82F6', borderRadius: 8 },
  retryButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
