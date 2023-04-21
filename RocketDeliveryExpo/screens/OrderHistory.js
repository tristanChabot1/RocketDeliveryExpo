import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Dimensions, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlassPlus';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';


export default function OrderHistoryScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [orderState, setOrderState] = useState({
    modalVisible: false,
    restaurantName: "",
    orderDate: "",
    status: "",
    courier: "",
    products: [],
    total_cost: 0
  });

  const { height } = Dimensions.get('window');
  const modalTopMeasure = height/2 - 150

  const ToggleView = (order) => {
    setOrderState({
      modalVisible: !orderState.modalVisible,
      restaurantName: order.restaurant_name,
      orderDate: order.date?.slice(0, 10),
      status: order.status,
      courier: "None found yet",
      products: order.products || [],
      total_cost: order.total_cost
    });
  };

  useEffect(() => {
    const getOrderHistory = async () => {
      const customerID = parseInt(await AsyncStorage.getItem('customerID'))
      try {
        const response = await axios.get(`https://1fdb-142-182-79-148.ngrok-free.app/api/orders?type=customer&id=${customerID}`);
        if (response) {
          setOrders(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    getOrderHistory();
  }, []);


  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>MY ORDERS</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.whiteText}>ORDER</Text>
              <Text style={styles.whiteText}>STATUS</Text>
              <Text style={styles.whiteText}>VIEW</Text>
            </View>
            <View style={styles.tableBody}>
              {orders.map((order, index) => (
                <View key={index} style={styles.orderContainer}>
                  <Text style={{width: "45.5%", paddingLeft: "3%", fontFamily: "Oswald-Regular"}}>{order.restaurant_name}</Text>
                  <Text style={{width: "37.5%", fontFamily: "Oswald-Regular"}}>{order.status}</Text>
                  <TouchableOpacity onPress={() => ToggleView(order)}>
                    <FontAwesomeIcon icon={faMagnifyingGlassPlus}/>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          <Modal transparent={true} visible={orderState.modalVisible} onRequestClose={ToggleView}>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', flex: 1 }}>
              <View style={[styles.modalContainer, {top: modalTopMeasure}]}>
                <View style={styles.modalTopContainer}>
                  <View style={{paddingLeft: 10}}>
                    <Text style={styles.modalTitle}>{orderState.restaurantName}</Text>
                    <Text style={styles.whiteText}>{`Order Date: ${orderState.orderDate}`}</Text>
                    <Text style={styles.whiteText}>{`Status: ${orderState.status?.toUpperCase()}`}</Text>
                    <Text style={styles.whiteText}>{`Courier: ${orderState.courier}`}</Text>
                  </View>
                  <TouchableOpacity onPress={ToggleView} style={{justifyContent: "center"}}>
                    <FontAwesomeIcon icon={faXmark} size={32} style={{color: "#609475"}}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBodyContainer}>
                  <View>
                    {orderState.products.map((product, index) => (
                      <View key={index} style={styles.modalOrderContainer}>
                        <Text style={{width: "55%"}}>{product.product_name}</Text>
                        <Text style={{width: "20%", marginRight: "auto"}}>{`x${product.quantity}`}</Text>
                        <Text>{`$ ${parseFloat(product.unit_cost).toFixed(2)}`}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.orderTotalContainer}>
                    <Text style={{fontWeight: "bold"}}>Total</Text>
                    <Text>{`: $ ${orderState.total_cost}`}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
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
  tableContainer: {
    width: "100%"
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#222126"
  },
  whiteText: {
    color: "white",
    fontFamily: "Oswald-Regular",
    paddingVertical: 5,
  },
  orderContainer: {
    flexDirection: 'row',
    marginVertical: 5
  },
  modalContainer: {
    backgroundColor: "white",
    width: "95%",
    height: "auto",
    alignSelf: "center",
    borderRadius: 10,
  },
  modalTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#222126",
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  modalTitle: {
    color: "#DA583B",
    fontSize: 20,
    fontFamily: "Oswald-SemiBold",
  },
  modalBodyContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#dce0dd",
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
  },
  modalOrderContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 5
  },
  orderTotalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#222126"
  },
});