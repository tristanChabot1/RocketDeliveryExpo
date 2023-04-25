import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';



export default function CourierHomeScreen({ navigation, route }) {    

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      keyboardShouldPersistTaps="handled"
    >
      <Header navigation={navigation} />
      <Text>Courier page</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
});