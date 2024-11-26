import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/login';
import List from './app/screens/list'
import Details from './app/screens/details';
import { useEffect, useState } from 'react';
import {onAuthStateChanged, User} from "firebase/auth"
import { FIREBASE_AUTH } from './Firebase.config';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name='Motivation' component={List} />
      <InsideStack.Screen name='details' component={Details} />
    </InsideStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user)
    });
  }, [])
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
           <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown: false}}/>
        ) : (
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false}}/>
        )} 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

