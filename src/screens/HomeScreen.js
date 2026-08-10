import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('welcome')}</Text>
      <Button 
        title={t('goToDetails')} 
        onPress={() => navigation.navigate('Details')} 
      />
      <View style={styles.languageButtons}>
        <Button title="English" onPress={() => changeLanguage('en')} />
        <Button title="العربية" onPress={() => changeLanguage('ar')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  languageButtons: {
    marginTop: 30,
    flexDirection: 'row',
    gap: 10,
  },
});
