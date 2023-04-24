import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Modal, Button, Dimensions } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import {Ngrok_URL} from "@env";
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons/faCirclePlus';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons/faCircleMinus';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';



export default function MenuScreen({ navigation, route }) {
  const { restaurant } = route.params;
  const [isDisabled, setIsDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderSummary, setOrderSummary] = useState({});
  const [orderTotal, setOrderTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [orderStatusText, setOrderStatusText] = useState("CONFIRM ORDER");
  const [orderStatus, setOrderStatus] = useState("undefined");
  const [emailIsChecked, setEmailChecked] = useState(false);
  const [phoneIsChecked, setPhoneChecked] = useState(false);

  const { height } = Dimensions.get('window');
  const modalTopMeasure = height/2 - 150


  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const response = await axios.get(`${Ngrok_URL}/api/products?restaurant=${restaurant.id}`);
        if (response.status === 200) {
          setProducts(response.data.map(product => ({ ...product, quantity: 0 })));
        } else {
          // manage case
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    getRestaurants();
  }, []);

  useEffect(() => {
    let flag = true;
    products.forEach(product => {
      if (product.quantity > 0) {
        flag = false;
      }
    });
    setIsDisabled(flag);
  }, [products]);

  const toggleModal = () => {
    const order = {};
    let total = 0;

    products.forEach(product => {
      if (product.quantity > 0) {
        order[product.name] = {
          quantity: product.quantity,
          cost: product.cost
        };
        total += (product.quantity * product.cost)
      }
    });

    
    setOrderTotal(total);
    setOrderSummary(order);
    setModalVisible(!modalVisible);

    if (modalVisible) {
      setOrderStatus("undefined")
    }

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

  const handlePostOrder = async () => {
    setOrderStatusText("PROCESSING ORDER...");
    const productOrders = [];

    Object.keys(orderSummary).forEach((productName) => {
      const product = products.find((p) => p.name === productName);
      if (orderSummary[productName].quantity > 0 && product) {
        productOrders.push({
          id: product.id,
          product_quantity: orderSummary[productName].quantity,
          product_unit_cost: parseFloat(product.cost),
        });
      }
    });

    const customerID = parseInt(await AsyncStorage.getItem('customerID'))

    const data = {
      order: {
        restaurant_id: restaurant.id,
        customer_id: customerID,
        product_orders: productOrders
      }
    };
    
    fetch('https://1fdb-142-182-79-148.ngrok-free.app/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      setTimeout(function() {
        setOrderStatusText("CONFIRM ORDER");
      }, 2000);
      setOrderStatus("success");
    })
    .catch(error => {
      setOrderStatus("error");
    });
  }

  const handleMessageConfirmationDisplay = (type) => {
    if (type === "success") {
      return orderStatus === "undefined" ? "none" : orderStatus === "success" ? "flex" : "none";
    }
    else if (type === "error"){
      return orderStatus === "undefined" ? "none" : orderStatus === "error" ? "flex" : "none";
    }
    else if (type === "button"){
      return orderStatus === "undefined" ? "flex" : orderStatus === "error" ? "flex" : "none";
    }
    else {
      return "none"
    }
    
  }


  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>RESTAURANT MENU</Text>
          <View style={styles.topContainer}>
            <View style={styles.restaurantInfoContainer}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text>{`Price: ${restaurant.price_range === 1 ? '($)' : restaurant.price_range === 2 ? '($$)' : '($$$)'}`}</Text>
              <Text>{`Rating: ${restaurant.rating_average === 1 ? '★☆☆☆☆' : restaurant.price_range === 2 ? '★★☆☆☆' : restaurant.price_range === 3 ? '★★★☆☆' : restaurant.price_range === 4 ? '★★★★☆' : '★★★★★'}`}</Text>
            </View>
            <View style={styles.createOrderContainer}>
              <TouchableOpacity style={isDisabled ? styles.disabledButton : styles.activeButton}  onPress={toggleModal} disabled={isDisabled}>
                <Text style={[isDisabled ? styles.disabledButtonText : styles.activeButtonText, {fontFamily: "Oswald-Regular"}]}>Create Order</Text>
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
                <View style={styles.orderSummaryContainer}>
                  <Text style={{fontWeight: "bold"}}>Order Summary</Text>
                  {Object.keys(orderSummary).map((productName, index) => (
                    <View key={index} style={styles.singleOrderContainer}>
                      <Text style={{width: "55%"}}>{productName}</Text>
                      <Text style={{width: "20%", marginRight: "auto"}}>{`x${orderSummary[productName].quantity}`}</Text>
                      <Text>{`$ ${orderSummary[productName].cost}`}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.orderTotalContainer}>
                  <Text style={{fontWeight: "bold"}}>Total</Text>
                  <Text>{`: $ ${orderTotal}`}</Text>
                </View>
                <View style={[styles.confirmOrderButton, {display: handleMessageConfirmationDisplay("button")}]}>
                  <View>
                    <Text style={{textAlign: "center", marginBottom: 10}}>Would you like to receive your order confirmation by email and/or text?</Text>
                    <View style={styles.checkContainer}>
                      <View style={styles.singleCheckContainer}>
                        <Checkbox style={styles.checkbox} value={emailIsChecked} onValueChange={setEmailChecked} />
                        <Text style={{marginLeft: 5}}>By Email</Text>
                      </View>
                      <View style={styles.singleCheckContainer}>
                        <Checkbox style={styles.checkbox} value={phoneIsChecked} onValueChange={setPhoneChecked} />
                        <Text style={{marginLeft: 5}}>By Phone</Text>
                      </View>
                    </View>
                  </View>
                  <Button title={orderStatusText} color={"#DA583B"} onPress={handlePostOrder} />
                </View>
                <View style={[styles.successContainer, {display: handleMessageConfirmationDisplay("success")}]}>
                  <FontAwesomeIcon icon={faCircleCheck} size={30} style={{color: "#1abc35",}} />
                  <Text>Thank you!</Text>
                  <Text>Your order has been received.</Text>
                </View>
                <View style={[styles.errorContainer, {display: handleMessageConfirmationDisplay("error")}]}>
                  <FontAwesomeIcon icon={faCircleXmark} size={30} style={{color: "#e11919",}} />
                  <Text>Your order was not processed successfully.</Text>
                  <Text>Please try again.</Text>
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
                    {`$ ${parseFloat(product.cost).toFixed(2)}`}
                  </Text>
                  <Text style={styles.productText}>
                    {product.description || "This is a default text. I bet this is the best dish tho"}
                  </Text>
                </View>
                <View style={styles.productAdd}>
                  <TouchableOpacity onPress={() => removeItem(index)}>
                    <FontAwesomeIcon size={20} icon={faCircleMinus} />
                  </TouchableOpacity>
                  <Text>{product.quantity}</Text>
                  <TouchableOpacity onPress={() => addItem(index)}>
                    <FontAwesomeIcon  size={20} icon={faCirclePlus} />
                  </TouchableOpacity>
                </View>
              </View>
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
    fontSize: 19,
    fontFamily: "Oswald-Regular",
  },
  createOrderContainer: {
    width: "45%",
    justifyContent: "center"
  },
  activeButton: {
    flex: 0.5,
    alignItems: 'center',
    backgroundColor: '#DA583B',
    borderRadius: 5,
    justifyContent: "center"
  },
  disabledButton: {
    flex: 0.5,
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
    fontSize: 13,
    fontFamily: "Oswald-SemiBold",
  },
  productText: {
    marginLeft: 5,
    fontSize: 12,
    fontFamily: "Oswald-Regular",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "95%",
    height: "auto",
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
  orderSummaryContainer: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#222126",
  },
  singleOrderContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  orderTotalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginHorizontal: 20,
  },
  checkContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  singleCheckContainer: {
    flexDirection: "row"
  },
  confirmOrderButton: {
    marginHorizontal: 20,
    marginBottom: 25,
    marginTop: 15,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#dce0dd"
  },
  successContainer: {
    alignItems: "center",
    marginVertical: 15,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#dce0dd"
  },
  errorContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
});