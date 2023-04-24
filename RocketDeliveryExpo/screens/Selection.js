import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faCar } from '@fortawesome/free-solid-svg-icons/faCar';


export default function SelectionScreen({ navigation, route }) {

  const handleCustomer = () => {
    navigation.replace("Restaurant")
  }

  const handleCourier = () => {
    navigation.replace("CourierHome")
  }
    

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
    >
      <Image style={styles.logo} source={require("../assets/Images/AppLogoV2.png")} />
      <Text style={[styles.title]}>Select Account Type</Text>
      <View style={styles.selectContainer}>
        <TouchableOpacity onPress={handleCustomer} style={[styles.buttonContainer, {display: isNaN(route.params.customerID) ? "none" : "flex"}]}>
          <FontAwesomeIcon icon={faUser} size={95} color="#DA583B" />
          <Text style={styles.selectText}>Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCourier} style={[styles.buttonContainer, {display: isNaN(route.params.courierID) ? "none" : "flex"}]}>
          <FontAwesomeIcon icon={faCar} size={95} />
          <Text style={styles.selectText}>Courier</Text>
        </TouchableOpacity>
      </View>
      <Text>customer_id: {route.params.customerID}</Text>
      <Text>courier_id: {route.params.courierID}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "5%",
    width: "90%",
  },
  title:{
    fontSize: 20,
    fontFamily: "Oswald-SemiBold",
    paddingBottom: 10,
  },
  buttonContainer: {
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgb(200, 200, 200)',
  },
  selectText: {
    fontSize: 20,
    marginTop: 10,
  },
  logo: {
    resizeMode: "contain",
    width: "80%",
    margin: "0%",
    padding: "0%"
  },
});