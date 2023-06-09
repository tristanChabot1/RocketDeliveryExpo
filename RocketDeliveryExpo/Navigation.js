import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/login';
import SelectionScreen from './screens/Selection';
import RestaurantScreen from './screens/Restaurant';
import MenuScreen from './screens/Menu';
import OrderHistoryScreen from './screens/OrderHistory';
import AccountScreen from './screens/Account';
import DeliveriesScreen from './screens/Deliveries';


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
          name="Selection"
          component={SelectionScreen}
          options={{ header: null }}
        />
        <Stack.Screen
          name="Restaurant"
          component={RestaurantScreen}
          options={{ header: null }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ header: null }}
        />
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{ header: null }}
        />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ header: null }}
        />
        <Stack.Screen
          name="Deliveries"
          component={DeliveriesScreen}
          options={{ header: null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}