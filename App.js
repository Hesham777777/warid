import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n';

// استيراد الشاشات
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'الرئيسية' }}
          />
          <Stack.Screen 
            name="Details" 
            component={DetailsScreen}
            options={{ title: 'التفاصيل' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
}
