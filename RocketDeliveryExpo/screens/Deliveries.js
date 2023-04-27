import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import axios from 'axios';
import { Ngrok_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlassPlus, faXmark } from '@fortawesome/free-solid-svg-icons';


export default function DeliveriesScreen({ navigation }) {
  const [deliveries, setDeliveries] = useState([]);
  const [orderState, setOrderState] = useState({
    modalVisible: false,
    status: "",
    deliveryAddress: "",
    restaurantName: "",
    orderDate: "",
    products: [],
    totalCost: 0
  });

  const { height } = Dimensions.get('window');
  const modalTopMeasure = height/2 - 150

  const ToggleView = (delivery) => {
    setOrderState({
      modalVisible: !orderState.modalVisible,
      status: delivery.status,
      deliveryAddress: delivery.customer_address,
      restaurantName: delivery.restaurant_name,
      orderDate: delivery.date?.slice(0, 10),
      products: delivery.products || [],
      totalCost: delivery.total_cost
    });
  };

  // Updating the status on click
  const handleStatus = async (id, status) => {
    let newStatus;
    if (status === "pending") {
      newStatus = "in progress";
    } else if (status === "in progress") {
      newStatus = "delivered";
    } else {
      return;
    }
  
    try {
      await axios.post(`${Ngrok_URL}/api/order/${id}/status`, {
        status: newStatus
      });
      const updatedDeliveries = deliveries.map(delivery => {
        if (delivery.id === id) {
          return { ...delivery, status: newStatus };
        } else {
          return delivery;
        }
      });
      setDeliveries(updatedDeliveries);
    } catch (error) {
      console.error(error);
    }
  };

  // GET all orders for given courier
  useEffect(() => {
    const getOrderHistory = async () => {
      const courierID = parseInt(await AsyncStorage.getItem('courierID'))
      try {
        const response = await axios.get(`${Ngrok_URL}/api/orders?type=courier&id=${courierID}`);
        if (response) {
          const modifiedData = response.data.map(order => {
            const customerAddress = order.customer_address.split(',')[0].trim();
            return { ...order, customer_address: customerAddress };
          });
          setDeliveries(modifiedData);
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
          <Text style={styles.title}>MY DELIVERIES</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.whiteText}>ORDER ID</Text>
              <Text style={styles.whiteText}>ADDRESS</Text>
              <Text style={styles.whiteText}>STATUS</Text>
              <Text style={styles.whiteText}>VIEW</Text>
            </View>
            <View>
              {deliveries.map((delivery, index) => (
                <View key={index} style={styles.orderContainer}>
                  <Text style={styles.IdCell}>{delivery.id}</Text>
                  <Text style={styles.addressCell}>{delivery.customer_address}</Text>
                  <TouchableOpacity onPress={() => handleStatus(delivery.id, delivery.status)} style={[styles.statusCell, {backgroundColor: delivery.status === "pending" ? "#851919" : delivery.status === "in progress" ? "#db7058" : "#609475"}]}>
                    <Text style={{color: "white", fontFamily: "Oswald-Regular", width: "100%", textAlign: "center"}}>{delivery.status}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => ToggleView(delivery)} style={{marginLeft: "9%", marginTop: 10}}>
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
                    <Text style={styles.modalTitle}>DELIVERY DETAILS</Text>
                    <Text style={styles.whiteText}>{`Status: ${orderState.status?.toUpperCase()}`}</Text>
                  </View>
                  <TouchableOpacity onPress={ToggleView} style={{justifyContent: "center"}}>
                    <FontAwesomeIcon icon={faXmark} size={32} style={{color: "#609475"}}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBodyContainer}>
                  <View style={styles.modalTopInfo}>
                    <Text>{`Delivery Address: ${orderState.deliveryAddress}`}</Text>
                    <Text>Restaurant: {orderState.restaurantName}</Text>
                    <Text>Order Date: {orderState.orderDate}</Text>
                  </View>
                  <View>
                    <Text style={{marginLeft: 20, fontFamily: "Oswald-SemiBold"}}>Order Details:</Text>
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
                    <Text>{`: $ ${orderState.totalCost}`}</Text>
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
    marginVertical: 5,
  },
  IdCell: {
    width: "24%",
    marginLeft: "1.5%",
    fontFamily: "Oswald-Regular",
    textAlign: "center",
  },
  addressCell: {
    width: "27%",
    marginLeft: "2%",
    fontFamily: "Oswald-Regular",
    textAlign: "center",
  },
  statusCell: {
    width: "22%",
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    padding: 5,
    marginHorizontal: 5,
    borderRadius: 5
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
  modalTopInfo: {
    margin: 20,
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