/* eslint-disable prettier/prettier */
import * as React from 'react';
import {View, Dimensions, Image, StyleSheet, Text} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {useSharedValue} from 'react-native-reanimated';
import CustomButton from '../components/Button/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {selectedPlanType} from '../../hooks/Slice';
import {useNavigation} from '@react-navigation/native';

const PAGE_WIDTH = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');

const dataItem = [
  {
    packagePlan: 'Daily',
    Exterior: 'Waterless cleaning for 26 days + 1 Fiber polish + Tyer polish',
    Interior: '1 Internal cleaning included',
  },
  {
    packagePlan: 'Weekly',
    Exterior: 'Waterless cleaning for 4 days',
    Interior: '1 Internal cleaning included',
  },
  {
    packagePlan: 'Alternative days',
    Exterior: 'Waterless cleaning for 4 days',
    Interior: '1 Internal cleaning included',
  },
];

function CustomCarousel() {
  const progressValue = useSharedValue(0);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [ModalPrice, setModalPrice] = React.useState(0);

  const selectedCar = useSelector(
      (state) => state.globalStore.selectedCarType
    );


  const baseOptions = {
    vertical: false,
    width: PAGE_WIDTH,
    height: PAGE_WIDTH * 1.6,
  };

  const handleClick = packageDetails => {
    dispatch(selectedPlanType(packageDetails));
    navigation.navigate('Booking');
  };

  const handlePrice = (SelectedPackage) => {
      switch (selectedCar.VehicleType.toLowerCase()) {
        case 'hatchback': {
          let FinalPrice =
            SelectedPackage === 'Daily'
              ? 899
              : SelectedPackage === 'Alternative days'
              ? 499
              : 250;
          setModalPrice(FinalPrice);
          return FinalPrice;
        }
        case 'sedan': {
          let FinalPrice =
            SelectedPackage === 'Daily'
              ? 899
              : SelectedPackage === 'Alternative days'
              ? 499
              : 250;
          setModalPrice(FinalPrice);
          return FinalPrice;
        }
        case 'compact suv': {
          let FinalPrice =
            SelectedPackage === 'Daily'
              ? 549
              : SelectedPackage === 'Alternative days'
              ? 1099
              : 350;
          setModalPrice(FinalPrice);
          return FinalPrice;
        }
        case 'suv': {
          let FinalPrice =
            SelectedPackage === 'Daily'
              ? 649
              : SelectedPackage === 'Alternative days'
              ? 1199
              : 399;
          setModalPrice(FinalPrice);
          return FinalPrice;
        }
        default:
          break;
      }
  }

  return (
    <View
      style={{
        elevation: 5,
      }}
    >
      <Carousel
        style={styles.CarouselContainer}
        {...baseOptions}
        loop
        pagingEnabled
        snapEnabled
        autoPlay
        autoPlayInterval={3500}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode='parallax'
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 80,
        }}
        data={dataItem}
        renderItem={(index) => (
          <View style={styles.container}>
            <Text style={styles.DailyPackage}>{index.item.packagePlan}</Text>
            <View style={styles.PackageDetailsContainer}>
              <View style={styles.PackageDetails}>
                <Image
                  style={styles.Image}
                  source={require('../../assets/images/002-tire.png')}
                />
                <Text style={styles.InteriorHeading}>Exterior</Text>
                <Text style={styles.InteriorDetails}>
                  {index.item.Exterior}{' '}
                </Text>
              </View>
              <View style={styles.PackageDetails}>
                <Image
                  style={styles.Image}
                  source={require('../../assets/images/001-window-cleaning.png')}
                />
                <Text style={styles.InteriorHeading}>Interior</Text>
                <Text style={styles.InteriorDetails}>
                  {index.item.Interior}{' '}
                </Text>
              </View>
            </View>
            <View style={styles.PriceContainer}>
              <Text style={styles.Price}>
                {handlePrice(index.item.packagePlan)}
              </Text>
              <Text style={styles.PricePerMonth}>/- Per Month</Text>
            </View>
            <Text style={styles.GstText}>(Including Gst)</Text>
            <CustomButton
              onPress={() => handleClick(index.item.packagePlan)}
              title={'Get Started'}
              customWidth={width / 2.2}
              customHeight={height * 0.065}
            />
          </View>
        )}
      />
    </View>
  );
}

export default CustomCarousel;

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    height: height / 2.2,
    alignSelf: 'center',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#c9c9c9c9',
    backgroundColor: '#f0f0f0c9',
  },
  CarouselContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  DailyPackage: {
    color: '#000',
    textAlign: 'center',
    marginVertical: height * 0.019,
    fontSize: height * 0.021,
    fontWeight: '800',
  },
  PackageDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginHorizontal:20
  },
  PackageDetails: {
    width: height * 0.17,
    height: height * 0.17,
    borderWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: height * 0.012,
    borderRadius: 15,
    borderColor: '#bebebec9',
    padding: height * 0.012,
  },
  Image: {
    width: height * 0.06,
    height: height * 0.06,
  },
  InteriorHeading: {
    fontSize: height * 0.017,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '500',
    borderBottomWidth: 0.6,
    marginVertical: 5,
    width: '80%',
  },
  InteriorDetails: {
    fontSize: height * 0.017,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  PriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.018,
  },
  Price: {
    fontSize: height * 0.027,
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
  GstText: {
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
    textAlignVertical: 'bottom',
    fontWeight: '400',
    top: -10,
    marginBottom: 20,
  },
});
