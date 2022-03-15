import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ContactsScreen from '../screens/ContactsScreen';
import CallingScreen from '../screens/CallingScreen';
import IncomingCallScreen from '../screens/IncomingCallScreen';
import LoginScreen from '../screens/LoginScreen';

import Screens from './Screens';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Screens.LOGIN_SCREEN}>
        <Stack.Screen
          name={Screens.CONTACTS_SCREEN}
          component={ContactsScreen}
        />
        <Stack.Screen
          name={Screens.LOGIN_SCREEN}
          component={LoginScreen}
          options={{title: 'Login'}}
        />
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen
            name={Screens.INCOMING_CALL_SCREEN}
            component={IncomingCallScreen}
          />
          <Stack.Screen
            name={Screens.CALLING_SCREEN}
            component={CallingScreen}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
