import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
    const checkLoginState = async () => {
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
    navigation.replace('Restaurant');
    }
    };
    checkLoginState();
    }, [])
  );
    
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://1fdb-142-182-79-148.ngrok-free.app/api/login',
        { user: { email: email, password: password } },
        { headers: { 'Content-Type': 'application/json',
      'Accept': 'application/json' } }
      );
  
      if (response.data.success) {
        setShow(false);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('customerID', `${response.data.customer_id}`);
        navigation.navigate('Restaurant');
      } else {
        setShow(true);
      }
    } catch (error) {
      setShow(true);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
    >
      <Image style={styles.logo} source={require("../assets/Images/AppLogoV2.png")} />
      <View style={styles.formContainer}>
        <Text style={styles.welcome}>Welcome Back</Text>
        <Text style={styles.login}>Login to begin</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your primary email here"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="*********"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <Text style={[styles.errorMessage, { display: show ? "flex" : "none" }]}>Login failed. Try again!</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    padding: "5%",
    width: "80%",
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#222126',
  },
  welcome:{
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Oswald"
  },
  login:{
    alignSelf: "flex-start",
    fontSize: 15,
    marginBottom: 10,
  },
  label:{
    alignSelf: "flex-start",
  },
  input: {
    width: '100%',
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
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
    fontWeight: 'bold',
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
  logo: {
    resizeMode: "contain",
    width: "80%",
    margin: "0%",
    padding: "0%"
  },
});