import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/login';
import RestaurantScreen from './screens/Restaurant';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ header: null }}
        />
        <Stack.Screen
          name="Restaurant"
          component={RestaurantScreen}
          options={{ header: null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}