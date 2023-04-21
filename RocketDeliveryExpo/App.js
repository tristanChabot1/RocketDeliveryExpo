import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';
import RestaurantScreen from './screens/Restaurant';
import MenuScreen from './screens/Menu';
import OrderHistoryScreen from './screens/OrderHistory';


const Stack = createStackNavigator();

export default function App()  {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Restaurant" component={RestaurantScreen} options={{headerShown: false}} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{headerShown: false}} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{headerShown: false}} />
        {/* Add additional screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
