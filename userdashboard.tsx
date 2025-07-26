import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Tab Screens
import BookAppointment from './tabs/bookappointment';
import RequestHelp from './tabs/requesthelp';

import Profile from './tabs/profile';
import Settings from './tabs/setting';

const Tab = createBottomTabNavigator();

const UserDashboard = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'Book':
              iconName = 'calendar-outline';
              break;
            case 'Help':
              iconName = 'help-circle-outline';
              break;
            case 'Requests':
              iconName = 'list-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            default:
              iconName = 'home-outline';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Book" component={BookAppointment} />
      <Tab.Screen name="Help" component={RequestHelp} />
    
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

export default UserDashboard;