import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// شاشات التطبيق
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import CreateTransactionScreen from '../screens/CreateTransactionScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchScreen from '../screens/SearchScreen';
import ArchiveScreen from '../screens/ArchiveScreen';
import TrashScreen from '../screens/TrashScreen';
import LockScreen from '../screens/LockScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// تبويبات التنقل السفلية
function MainTabs() {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'Transactions') iconName = focused ? 'folder' : 'folder-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Reports') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: t('dashboard.title') }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ title: t('transaction.all') }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: t('transaction.search') }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: t('reports.title') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings.title') }} />
    </Tab.Navigator>
  );
}

// مكدس التنقل الرئيسي
export default function AppNavigator() {
  const { t } = useTranslation();
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Lock" component={LockScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} options={{ title: t('transaction.details') }} />
        <Stack.Screen name="CreateTransaction" component={CreateTransactionScreen} options={{ title: t('transaction.new') }} />
        <Stack.Screen name="Archive" component={ArchiveScreen} options={{ title: t('archive.title') }} />
        <Stack.Screen name="Trash" component={TrashScreen} options={{ title: t('trash.title') }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
