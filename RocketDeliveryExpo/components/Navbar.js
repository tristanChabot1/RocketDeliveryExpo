import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBurger, faClockRotateLeft, faUser, } from "@fortawesome/free-solid-svg-icons";


export default function Navbar({ navigation }) {
  const [loggedInType, setLoggedInType] = useState("")

  // Check if logged in as customer or courier
  useEffect(() => {
    const fetchLoggedInType = async () => {
      const type = await AsyncStorage.getItem("loggedInType");
      setLoggedInType(type);
    };
    fetchLoggedInType();
  }, []);
  

  const handleNavigation = (screenName) => {
    navigation.replace(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.navItemContainer, {display: loggedInType !== "Customer" ? "none" : "flex"}]} onPress={() => handleNavigation("Restaurant")}>
        <FontAwesomeIcon icon={faBurger} />
        <Text>Restaurants</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItemContainer, {display: loggedInType !== "Customer" ? "none" : "flex"}]} onPress={() => handleNavigation("OrderHistory")}>
        <FontAwesomeIcon icon={faClockRotateLeft} />
        <Text>Order History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItemContainer, {display: loggedInType !== "Courier" ? "none" : "flex"}]} onPress={() => handleNavigation("Deliveries")}>
        <FontAwesomeIcon icon={faClockRotateLeft} />
        <Text>Deliveries</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItemContainer} onPress={() => handleNavigation("Account")}>
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