import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://1fdb-142-182-79-148.ngrok-free.app/api/login',
        { user: { email: email, password: password } },
        { headers: { 'Content-Type': 'application/json',
      'Accept': 'application/json' } }
      );
  
      if (response.data.success) {
        console.log('Login successful');
        console.log(response.data.success);
        navigation.navigate('Home');
      } else {
        // handle unsuccessful login
        console.log(response.data.success);
        console.log('Login failed');
      }
    } catch (error) {
      console.log(`${error}, email: ${email}, pwd: ${password}`);
    }
  };

  // const handleLogin = () => {
  //   navigation.navigate('Home');
  // };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});