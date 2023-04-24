import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';
import SelectionScreen from './screens/Selection';
import RestaurantScreen from './screens/Restaurant';
import MenuScreen from './screens/Menu';
import OrderHistoryScreen from './screens/OrderHistory';
import CourierHomeScreen from './screens/CourierHome';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

export default function App()  {
  const [loaded] = useFonts({
    'Oswald-Regular': require('./assets/fonts/Oswald-Regular.ttf'),
    'Oswald-SemiBold': require('./assets/fonts/Oswald-SemiBold.ttf'),
    'Oswald-Bold': require('./assets/fonts/Oswald-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Selection" component={SelectionScreen} options={{headerShown: false}} />
        <Stack.Screen name="Restaurant" component={RestaurantScreen} options={{headerShown: false}} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{headerShown: false}} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{headerShown: false}} />
        <Stack.Screen name="CourierHome" component={CourierHomeScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};