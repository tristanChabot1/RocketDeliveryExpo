import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Header from '../components/Header';

export default function RestaurantScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

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
        const response = await axios.get('https://1fdb-142-182-79-148.ngrok-free.app/restaurants');
        if (response.status === 200) {
          const restaurants = response.data.map(({ id, address_id, active, email, name, phone, price_range, user_id, rating_average, products }, index) => {
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
              products,
              image: getRandomNumber(index),
            };
          });
          setRestaurants(restaurants);
          console.log(restaurants)
        } else {
          // manage case
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
      let filteredRestaurants;
      switch (selectedRating) {
        case "1":
          filteredRestaurants = restaurants.filter(
            (restaurant) => restaurant.rating_average >= 0 && restaurant.rating_average <= 1
          );
          break;
        case "2":
          filteredRestaurants = restaurants.filter(
            (restaurant) => restaurant.rating_average > 1 && restaurant.rating_average <= 2
          );
          break;
        case "3":
          filteredRestaurants = restaurants.filter(
            (restaurant) => restaurant.rating_average > 2 && restaurant.rating_average <= 3
          );
          break;
        case "4":
          filteredRestaurants = restaurants.filter(
            (restaurant) => restaurant.rating_average > 3 && restaurant.rating_average <= 4
          );
          break;
        case "5":
          filteredRestaurants = restaurants.filter(
            (restaurant) => restaurant.rating_average > 4 && restaurant.rating_average <= 5
          );
          break;
        default:
          filteredRestaurants = restaurants;
          break;
      }
      return filteredRestaurants;
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
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
    >
      <Header navigation={navigation} />
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
    width: '48%',
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
  },
  restaurantImage: {
    height: "57.5%",
    aspectRatio: 3601 / 2401,
    resizeMode: "contain",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: 5,
  },
  restaurantsText: {
    marginHorizontal: 5,
  },
});