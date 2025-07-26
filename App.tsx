// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import LoginScreen from './src/screens/loginscreen';
import SignupScreen from './src/screens/signupscreen';
import AdminDashboard from './src/screens/admindashboard';
import UserDashboard from './src/screens/userdashboard';
import Instruction1 from './src/screens/Instruction1';
import Instruction2 from './src/screens/Instruction2';
import { auth, db } from './android/firebase';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userDoc = await getDoc(doc(db, 'users', uid));
        const data = userDoc.data();
        setUserRole(data?.role || null);
      } else {
        setUserRole(null);
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userRole === 'admin' ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : userRole === 'user' ? (
          <Stack.Screen name="UserDashboard" component={UserDashboard} />
        ) : (
          <>
            <Stack.Screen name="Instruction1" component={Instruction1} />
            <Stack.Screen name="Instruction2" component={Instruction2} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
