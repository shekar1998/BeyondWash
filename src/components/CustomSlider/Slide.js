import {StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import React from 'react';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

const Slide = ({data}) => {
  return (
    <View
      style={{
        height: windowHeight,
        width: windowWidth,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={{uri: data.image}}
        style={{width: windowWidth * 0.9, height: windowHeight * 0.9}}></Image>
      <Text style={{fontSize: 24}}>{data.title}</Text>
      <Text style={{fontSize: 18}}>{data.subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
    width: windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.9,
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 18,
  },
});

export default Slide;
