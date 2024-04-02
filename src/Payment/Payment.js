/* eslint-disable prettier/prettier */
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import {RAZORPAY_KEY} from './constant';
import {useEffect} from 'react';

const imgURL =
  'https://m.media-amazon.com/images/I/61L5QgPvgqL._AC_UF1000,1000_QL80_.jpg';

const Payment = () => {
  const onPressBuy = () => {
    //Order Api: Call POST api with body like (username, id, price etc) to create an Order and use order_id in below options object
    // const response = await .....
    let options = {
      description: 'Credits towards consultation',
      image: imgURL, //require('../../images.png')
      currency: 'INR', //In USD - only card option will exist rest(like wallet, UPI, EMI etc) will hide
      key: RAZORPAY_KEY,
      amount: 5000,
      name: 'Beyond Wash',
      order_id: '', //Replace this with an order_id(response.data.orderId) created using Orders API.
      prefill: {
        email: 'hasan@example.com',
        contact: '9191919191',
        name: 'Hasan',
      }, //if prefill is not provided then on razorpay screen it has to be manually entered.
      theme: {color: '#2463eb'},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
      })
      .catch(error => {
        // handle failure

        console.log(error);
      });
  };

  useEffect(() => {
    onPressBuy();
  }, []);

  return <View style={styles.container}></View>;
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
