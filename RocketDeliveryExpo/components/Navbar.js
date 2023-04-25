import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faBurger,
  faClockRotateLeft,
  faUser,
} from "@fortawesome/free-solid-svg-icons";


export default function Navbar({ navigation }) {
  const [loggedInType, setLoggedInType] = useState("")

  useEffect(() => {
    const fetchLoggedInType = async () => {
      const type = await AsyncStorage.getItem("loggedInType");
      setLoggedInType(type);
    };
    fetchLoggedInType();
  }, []);
  

  const handleRestaurants = () => {
    navigation.replace("Restaurant")
  }

  const handleOrderHistory = () => {
    navigation.replace("OrderHistory")
  }

  const handleAccount = () => {
    navigation.replace("Account")
  }

  const handleDeliveries = () => {
    navigation.replace("Deliveries")
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.navItemContainer, {display: loggedInType !== "Customer" ? "none" : "flex"}]} onPress={handleRestaurants}>
        <FontAwesomeIcon icon={faBurger} />
        <Text>Restaurants</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItemContainer, {display: loggedInType !== "Customer" ? "none" : "flex"}]} onPress={handleOrderHistory}>
        <FontAwesomeIcon icon={faClockRotateLeft} />
        <Text>Order History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItemContainer, {display: loggedInType !== "Courier" ? "none" : "flex"}]} onPress={handleDeliveries}>
        <FontAwesomeIcon icon={faClockRotateLeft} />
        <Text>Deliveries</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItemContainer} onPress={handleAccount}>
        <FontAwesomeIcon icon={faUser} />
        <Text>Account</Text>
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