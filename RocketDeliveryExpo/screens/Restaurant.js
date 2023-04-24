import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import {Ngrok_URL} from "@env";
import Header from '../components/Header';
import Navbar from '../components/Navbar';

export default function RestaurantScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const filteredByRating = filterRestaurantsByRating(restaurants, selectedRating);
  const filteredByPrice = filterRestaurantsByPrice(filteredByRating, selectedPrice);

  const getRandomNumber = (index) => {
    const images = [
      require("../assets/Images/Restaurants/cuisineGreek.jpg"),
      require("../assets/Images/Restaurants/cuisineJapanese.jpg"),
      require("../assets/Images/Restaurants/cuisinePasta.jpg"),
      require("../assets/Images/Restaurants/cuisinePizza.jpg"),
      require("../assets/Images/Restaurants/cuisineSoutheast.jpg"),
      require("../assets/Images/Restaurants/cuisineViet.jpg"),
    ];
    const number = index % images.length;
    return images[number];
  };


  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const response = await axios.get(`${Ngrok_URL}/api/restaurants`, {
          headers: {
            Accept: "application/json"
          }
        });
        if (response.status === 200) {
          const restaurants = response.data.map(({ id, address_id, active, email, name, phone, price_range, user_id, rating_average }, index) => {
            return {
              id,
              address_id,
              active,
              email,
              name,
              phone,
              price_range,
              user_id,
              rating_average,
              image: getRandomNumber(index),
            };
          });
          setRestaurants(restaurants);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    getRestaurants();
  }, []);

  function filterRestaurantsByRating(restaurants, selectedRating) {
    if (selectedRating === "") {
      return restaurants;
    } else {
      return restaurants.filter((restaurant) => {
        const rating = restaurant.rating_average;
        return (
          (selectedRating === "1" && rating >= 0 && rating <= 1) ||
          (selectedRating === "2" && rating > 1 && rating <= 2) ||
          (selectedRating === "3" && rating > 2 && rating <= 3) ||
          (selectedRating === "4" && rating > 3 && rating <= 4) ||
          (selectedRating === "5" && rating > 4 && rating <= 5)
        );
      });
    }
  }

  function filterRestaurantsByPrice(restaurants, selectedPrice) {
    if (selectedPrice === "") {
      return restaurants;
    } else {
      return restaurants.filter((restaurant) => restaurant.price_range.toString() === selectedPrice);
    }
  }

  const handlePress = (restaurant) => {
    navigation.replace('Menu', { restaurant });
  };

  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>NEARBY RESTAURANTS</Text>
          <View style={styles.filterContainer}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>Rating</Text>
              <View style={styles.ratingSelect}>
                <Picker
                  style={styles.picker}
                  selectedValue={selectedRating}
                  onValueChange={(itemValue, itemIndex) => setSelectedRating(itemValue)}
                >
                  <Picker.Item label="--Select--" value="" />
                  <Picker.Item label="★☆☆☆☆" value="1" />
                  <Picker.Item label="★★☆☆☆" value="2" />
                  <Picker.Item label="★★★☆☆" value="3" />
                  <Picker.Item label="★★★★☆" value="4" />
                  <Picker.Item label="★★★★★" value="5" />
                </Picker>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.ratingText}>Price</Text>
              <View style={styles.ratingSelect}>
                <Picker
                  style={styles.picker}
                  selectedValue={selectedPrice}
                  onValueChange={(itemValue, itemIndex) => setSelectedPrice(itemValue)}
                >
                  <Picker.Item label="--Select--" value="" />
                  <Picker.Item label="$" value="1" />
                  <Picker.Item label="$$" value="2" />
                  <Picker.Item label="$$$" value="3" />
                </Picker>
              </View>
            </View>
          </View>
          <Text style={styles.title}>RESTAURANTS</Text>
          <View style={styles.restaurantsContainer}>
            {filteredByPrice.map((restaurant, index) => (
              <TouchableOpacity key={index} style={styles.restaurantContainer} onPress={() => handlePress(restaurant)}>
                <Image style={styles.restaurantImage} source={restaurant.image} />
                <View>
                  <Text style={styles.restaurantsText}>{restaurant.name}</Text>
                  <Text style={styles.restaurantsText}>
                    {restaurant.price_range === 1 ? '($)' : restaurant.price_range === 2 ? '($$)' : '($$$)'}
                  </Text>
                  <Text style={styles.restaurantsText}>
                    {restaurant.rating_average === 1 ? '★☆☆☆☆' : restaurant.rating_average === 2 ? '★★☆☆☆' : restaurant.rating_average === 3 ? '★★★☆☆' : restaurant.rating_average === 4 ? '★★★★☆' : '★★★★★'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <Navbar navigation={navigation} />
    </View>
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
    fontFamily: "Oswald-SemiBold",
    marginBottom: 20,
  },
  filterContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  ratingContainer: {
    width: "45%",
  },
  priceContainer: {
    width: "45%"
  },
  ratingText: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontFamily: "Oswald-Regular",
  },
  ratingSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DA583B',
    borderRadius: 5,
    justifyContent: "center"
  },
  picker: {
    width: "100%",
    color: "white"
  },
  restaurantsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  restaurantContainer: {
    width: '47%',
    height: 180,
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    overflow: 'hidden',
  },
  restaurantImage: {
    flex: 1,
    aspectRatio: 3601 / 2401,
    resizeMode: "contain",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: 5,
  },
  restaurantsText: {
    marginHorizontal: 5,
    fontFamily: "Oswald-Regular",
  },
});