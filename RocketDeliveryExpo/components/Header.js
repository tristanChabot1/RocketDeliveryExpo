import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header({ navigation }) {
  useEffect(() => {
    const checkLoginState = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (!isLoggedIn) {
        if (navigation) {
          navigation.replace('Login');
        }
      }
    };
    checkLoginState();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    if (navigation) {
      navigation.navigate('Login');
    }
  };

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <View
      style={[styles.container, { marginTop: statusBarHeight }]}
    >
      <Image style={styles.logo} source={require("../assets/Images/AppLogoV1.png")} />
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderColor: "#dce0dd",
  },
  logo: {
    resizeMode: "contain",
    width: "40%",
    aspectRatio: 594/163,
    margin: "0%",
    padding: "0%"
  },
  logout: {
    backgroundColor: '#DA583B',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText:{
    color: "white"
  },
});