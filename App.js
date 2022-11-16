import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MatchedScreen from './screens/MatchedScreen';
import ModalScreen from './screens/ModalScreen';
import MessageScreen from './screens/MessageScreen';
import { LogBox } from "react-native";
LogBox.ignoreAllLogs(); //Ignore log notifications by message


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator 
        // screenOptions={{
        //   headerShown: false
        // }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Message" component={MessageScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen name="Modal" component={ModalScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
          <Stack.Screen name="Match" component={MatchedScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}



