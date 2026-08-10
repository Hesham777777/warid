import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// مكون بطاقة قابل لإعادة الاستخدام
export const Card = ({ title, children }) => {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

// مكون زر مخصص
export const CustomButton = ({ title, onPress, disabled = false }) => {
  return (
    <View 
      style={[
        styles.button, 
        disabled && styles.buttonDisabled
      ]}
    >
      <Text 
        style={[
          styles.buttonText,
          disabled && styles.buttonTextDisabled
        ]}
        onPress={!disabled ? onPress : undefined}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#999',
  },
});
