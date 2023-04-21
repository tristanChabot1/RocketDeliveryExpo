import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBurger } from '@fortawesome/free-solid-svg-icons/faBurger';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons/faClockRotateLeft';

export default function Navbar({ navigation }) {

  const handleRestaurants = () => {
    navigation.replace("Restaurant")
  }

  const handleOrderHistory = () => {
    navigation.replace("OrderHistory")
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItemContainer} onPress={handleRestaurants}>
        <FontAwesomeIcon icon={faBurger} />
        <Text>Restaurants</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItemContainer} onPress={handleOrderHistory}>
        <FontAwesomeIcon icon={faClockRotateLeft} />
        <Text>Order History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderColor: "#dce0dd",
  },
  navItemContainer: {
    alignItems: "center",
  }
});