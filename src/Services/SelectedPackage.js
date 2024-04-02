import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import CustomButton from '../components/Button/CustomButton';
import Header from '../components/Header';

const {width, height} = Dimensions.get('window');

const SelectedPackage = () => {
  const reducer = useSelector(state => state.globalStore);

  return (
    <View styles={styles.container}>
      <Header headerText={'Selected Services'} />
      <View style={styles.MainPriceContainer}>
        <Image
          style={styles.Image}
          source={{
            uri: reducer?.selectedCarType?.carImage,
          }}
        />
        <View style={styles.PriceContainer}>
          <View style={styles.SubPriceContainer}>
            <Text style={styles.Price}>1599</Text>
            <Text style={styles.PricePerMonth}>/- Per Month</Text>
          </View>
          <CustomButton title={'Daily'} customWidth={width / 3} />
        </View>
      </View>
    </View>
  );
};

export default SelectedPackage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  MainPriceContainer: {
    width: width - 50,
    height: 'auto',
    alignSelf: 'center',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#3b3b3b93',
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
  },
  DailyPackage: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
  },
  StrikePrice: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'bottom',
    fontWeight: '600',
    textDecorationLine: 'line-through',
    top: 2,
  },
  PriceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  SubPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  Price: {
    fontSize: height * 0.029,
    color: '#2c65e0',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '800',
  },
  PricePerMonth: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'bottom',
    fontWeight: '500',
  },
  Image: {
    width: width * 0.43,
    height: width * 0.43,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
