import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Modal, Button, Dimensions } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons/faCirclePlus'
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons/faCircleMinus'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'


export default function MenuScreen({ navigation, route }) {
  const { restaurant } = route.params;
  const [isDisabled, setIsDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderSummary, setOrderSummary] = useState({});
  const [products, setProducts] = useState(
    restaurant.products.map(product => ({
      ...product,
      quantity: 0,
    }))
  );

  const { height } = Dimensions.get('window');
  const modalTopMeasure = height/2 - 150


  useEffect(() => {
    let flag = true;
    products.forEach(product => {
      if (product.quantity > 0) {
        flag = false;
      }
    });
    setIsDisabled(flag);
  }, [products]);


  const handlePress = () => {
    navigation.replace('Restaurant');
  };

  const toggleModal = () => {
    let order = {};
    products.forEach(product => {
      if (product.quantity > 0) {
        order[product.name] = product.quantity
      }
    });
    setOrderSummary(order);


    setModalVisible(!modalVisible);
  };

  const removeItem = (index) => {
    if (products[index].quantity > 0) {
      setProducts(prevProducts => {
        const newProducts = [...prevProducts];
        newProducts[index] = { ...newProducts[index], quantity: newProducts[index].quantity - 1 };
        return newProducts;
      });
    }
  };
  
  const addItem = (index) => {
    setProducts(prevProducts => {
      const newProducts = [...prevProducts];
      newProducts[index] = { ...newProducts[index], quantity: newProducts[index].quantity + 1 };
      return newProducts;
    });
  };


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
            <TouchableOpacity style={isDisabled ? styles.disabledButton : styles.activeButton}  onPress={toggleModal} disabled={isDisabled}>
              <Text style={isDisabled ? styles.disabledButtonText : styles.activeButtonText}>Create Order</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
          <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', flex: 1 }}>
            <View style={[styles.modalContainer, {top: modalTopMeasure}]}>
              <View style={styles.confirmationHeaderContainer}>
                <Text style={styles.confirmationHeaderText}>Order Confirmation</Text>
                <TouchableOpacity onPress={toggleModal}>
                  <FontAwesomeIcon icon={faXmark} size={32} style={{color: "#609475"}} />
                </TouchableOpacity>
              </View>
              <View>
                <Text>Order Summary</Text>
                {Object.keys(orderSummary).map((productName, index) => (
                  <View key={index} style={styles.productContainer}>
                    <Text>{productName}: {orderSummary[productName]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.productsContainer} >
          {products.map((product, index) => (
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
                <TouchableOpacity onPress={() => removeItem(index)}>
                  <FontAwesomeIcon style={styles.icon} icon={faCircleMinus} />
                </TouchableOpacity>
                <Text>{product.quantity}</Text>
                <TouchableOpacity onPress={() => addItem(index)}>
                  <FontAwesomeIcon icon={faCirclePlus} />
                </TouchableOpacity>
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
  activeButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#DA583B',
    borderRadius: 5,
    justifyContent: "center"
  },
  disabledButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#da583b7a',
    borderRadius: 5,
    justifyContent: "center"
  },
  activeButtonText: {
    color: "white"
  },
  disabledButtonText: {
    color: "#696969"
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "28%",
  },
  productBold : {
    marginLeft: 5,
    fontWeight: "bold",
  },
  productText: {
    marginLeft: 5,
    fontSize: 13,
  },
  modalContainer: {
    backgroundColor: "white",
    width: "95%",
    height: 300,
    alignSelf: "center",
    borderRadius: 10,
  },
  confirmationHeaderContainer: {
    margin: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#222126",
    borderTopStartRadius: 10,
    borderTopRightRadius: 10,
  },
  confirmationHeaderText: {
    color: "white",
    fontSize: 20,
  },
});