import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { Ngrok_URL } from "@env";


export default function AccountScreen({ navigation }) {
  const [customerType, setCustomerType] = useState("");
  const [ID, setID] = useState(0);
  const [primaryEmail, setPrimaryEmail] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getInfo = async (id, type) => {
    try {
      const response = await axios.get(`${Ngrok_URL}/api/account/${id}?type=${type}`, {
        headers: {
          Accept: "application/json"
        }
      });
      console.log(response)
      if (response.status === 200) {
        setEmail(response.data.email || "undefined");
        setPhone(response.data.phone || "undefined");
        setPrimaryEmail(response.data.primary_email)
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Checking if logged in as customer our courier
  useFocusEffect(
    React.useCallback(() => {
      const getCustomerIdOrCourierID = async () => {
        const loggedInType = await AsyncStorage.getItem("loggedInType");
        const idKey = loggedInType === "Customer" ? "customerID" : "courierID";
        const id = await AsyncStorage.getItem(idKey);
        setID(parseInt(id));
        getInfo(parseInt(id), loggedInType);
        setCustomerType(loggedInType);
      };
      getCustomerIdOrCourierID();
    }, [])
  );

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `${Ngrok_URL}/api/account/${ID}?type=${customerType}`,
        {
          email: email !== "undefined" ? email : null,
          phone: phone !== "undefined" ? phone : null
        },
        { headers: { 'Content-Type': 'application/json',
        'Accept': 'application/json' } }
      );
  
      if (response.status === 200) {
        setShowError(false);
        setShowSuccess(true);
      } else {
        setShowError(true);
        setShowSuccess(false);
      }
    } catch (error) {
      setShowError(true);
      setShowSuccess(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <Header navigation={navigation} />
        <View style={styles.formContainer}>
          <Text style={[styles.welcome]}>MY ACCOUNT</Text>
          <Text style={styles.login}>{`Logged In As: ${customerType}`}</Text>
          <Text style={styles.label}>Primary Email (Read Only)</Text>
          <TextInput
            style={styles.input}
            placeholder={primaryEmail}
            editable = {false}
          />
          <Text style={styles.smallText}>Email used to login to the application.</Text>
          <Text style={styles.label}>{customerType} Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
          />
          <Text style={styles.smallText}>Email used for you Customer account.</Text>
          <Text style={styles.label}>{customerType} Phone</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPhone}
            value={phone}
          />
          <Text style={styles.smallText}>Phone number for you Customer account.</Text>
          <Text style={[styles.errorMessage, { display: showError ? "flex" : "none" }]}>Update failed. Try again!</Text>
          <Text style={[styles.successMessage, { display: showSuccess ? "flex" : "none" }]}>Update successfull!</Text>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>UPDATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Navbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "80%",
  },
  welcome:{
    alignSelf: "flex-start",
    fontSize: 20,
    fontFamily: "Oswald-SemiBold"
  },
  login:{
    alignSelf: "flex-start",
    fontSize: 15,
    marginBottom: 10,
  },
  label:{
    alignSelf: "flex-start",
  },
  smallText:{
    alignSelf: "flex-start",
    fontSize: 10,
    color: "rgb(100, 100, 100)",
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#DA583B',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: "Oswald-Regular"
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
  successMessage: {
    color: "green",
    textAlign: "center",
  },
});