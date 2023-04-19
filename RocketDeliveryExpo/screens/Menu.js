import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';

export default function MenuScreen({ navigation, route }) {
  const { restaurant } = route.params;


  // useEffect(() => {
  //   const getRestaurants = async () => {
  //     try {
  //       const response = await axios.get('https://1fdb-142-182-79-148.ngrok-free.app/restaurants');
  //       if (response.status === 200) {
  //         const restaurants = response.data.map(({ id, address_id, active, email, name, phone, price_range, user_id, rating_average }, index) => {
  //           return {
  //             id,
  //             address_id,
  //             active,
  //             email,
  //             name,
  //             phone,
  //             price_range,
  //             user_id,
  //             rating_average,
  //           };
  //         });
  //         setRestaurants(restaurants);
  //       } else {
  //         // manage case
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  
  //   getRestaurants();
  // }, []);

  const handlePress = () => {
    navigation.replace('Restaurant');
  };

  const createOrder = () => {

  }

  const calculatedHeight = `${(872 / 887) * 0.3}%`;


  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
    >
      <Header navigation={navigation} />
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePress}>
            <Text style={styles.title}>RESTAURANT MENU</Text>
        </TouchableOpacity>
        <View style={styles.topContainer}>
          <View style={styles.restaurantInfoContainer}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text>{`Price: ${restaurant.price_range === 1 ? '($)' : restaurant.price_range === 2 ? '($$)' : '($$$)'}`}</Text>
            <Text>{`Rating: ${restaurant.rating_average === 1 ? '★☆☆☆☆' : restaurant.price_range === 2 ? '★★☆☆☆' : restaurant.price_range === 3 ? '★★★☆☆' : restaurant.price_range === 4 ? '★★★★☆' : '★★★★★'}`}</Text>
          </View>
          <View style={styles.createOrderContainer}>
            <TouchableOpacity style={styles.createOrderButton} onPress={createOrder}>
              <Text>Create Order</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.productsContainer} >
          {restaurant.products.map((product, index) => (
            <View key={index} style={styles.productContainer}>
              <Image style={styles.productImage} source={require("../assets/Images/RestaurantMenu.jpg")} />
              <View style={styles.productInfo}>
                <Text style={styles.productBold}>{product.name}</Text>
                <Text style={styles.productBold}>
                  {`$ ${product.cost}`}
                </Text>
                <Text style={styles.productText}>
                  {product.description || "This is a default text. I bet this is the best dish tho"}
                </Text>
              </View>
              <View style={styles.productAdd}>
                <Text>test</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: "90%",
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  topContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  restaurantInfoContainer: {
    width: "45%",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  createOrderContainer: {
    width: "45%",
  },
  createOrderButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#DA583B',
    borderRadius: 5,
    justifyContent: "center"
  },
  ratingText: {
    alignSelf: "flex-start",
    fontSize: 17,
    fontWeight: "bold"
  },
  ratingSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DA583B',
    borderRadius: 5,
    justifyContent: "center"
  },
  productsContainer: {
    width: "100%"
  },
  productContainer: {
    flexDirection: "row",
    width: '100%',
    borderRadius: 5,
    marginVertical: 10,
  },
  productImage: {
    width: "30%",
    aspectRatio: 872 / 887,
    resizeMode: "contain",
    borderRadius: 5,
    marginBottom: 5,
  },
  productInfo: {
    width: "42%"
  },
  productAdd: {
    width: "28%"
  },
  productBold : {
    marginLeft: 5,
    fontWeight: "bold",
  },
  productText: {
    marginLeft: 5,
    fontSize: 13,
  },
});