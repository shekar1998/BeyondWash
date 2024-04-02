/* eslint-disable prettier/prettier */
import * as React from 'react';
import {View, Dimensions, Image, Platform} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const PAGE_WIDTH = Dimensions.get('window').width;
// @ts-ignore
const {width, height} = Dimensions.get('window');

const dataItem = [
  // @ts-ignore
  require('../../assets/Carousel/Slide1.jpg'),
  // @ts-ignore
  require('../../assets/Carousel/Slide1.jpg'),
  // @ts-ignore
  require('../../assets/Carousel/Slide2.png'),
  // @ts-ignore
  require('../../assets/Carousel/Slide3.jpg'),
  // @ts-ignore
  require('../../assets/Carousel/Slide4.jpg'),
];

function CustomCarousel() {
  // @ts-ignore
  const [isVertical, setIsVertical] = React.useState(false);
  // @ts-ignore
  const [autoPlay, setAutoPlay] = React.useState(true);
  // @ts-ignore
  const [pagingEnabled, setPagingEnabled] = React.useState(true);
  // @ts-ignore
  const [snapEnabled, setSnapEnabled] = React.useState(true);
  const progressValue = useSharedValue(0);
  const baseOptions = isVertical
    ? {
        vertical: true,
        width: PAGE_WIDTH,
        height: PAGE_WIDTH * 0.6,
      }
    : {
        vertical: false,
        width: PAGE_WIDTH,
        height: PAGE_WIDTH * 0.6,
      };

  return (
    <View
      style={{
        alignItems: 'center',
        elevation: 5,
        top: -15,
      }}>
      <Carousel
        style={{elevation: 4}}
        {...baseOptions}
        loop
        pagingEnabled={pagingEnabled}
        snapEnabled={snapEnabled}
        autoPlay={autoPlay}
        autoPlayInterval={3500}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        data={dataItem}
        renderItem={index => {
          return (
            // <View style={{elevation:3 , borderWidth:1}}>
            <Image
              style={{
                width: width,
                height: height / 4,
                resizeMode: 'contain',
                justifyContent: 'center',
                alignContent: 'center',
                // right: 2,
                borderRadius: Platform.OS === 'android' ? 18 : 30,
              }}
              source={index.item}
            />
            // </View>
          );
        }}
      />
      {!!progressValue && (
        <View
          style={
            isVertical
              ? {
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: 10,
                  alignSelf: 'center',
                  position: 'absolute',
                  right: 35,
                  // top: 10
                }
              : {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: 200,
                  // alignSelf: 'center',
                }
          }>
          {/* {colors.map((backgroundColor, index) => {
            return (
              <PaginationItem
                backgroundColor={backgroundColor}
                animValue={progressValue}
                index={index}
                key={index}
                isRotate={isVertical}
                length={colors.length}
              />
            );
          })} */}
        </View>
      )}
    </View>
  );
}

// @ts-ignore
const PaginationItem = props => {
  const {animValue, index, length, backgroundColor, isRotate} = props;
  const width = 10;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      style={{
        backgroundColor: '#000',
        // marginHorizontal:2,
        width: width - 0.5,
        height: width - 1.4,
        borderRadius: 50,
        overflow: 'hidden',
        elevation: 3,
        transform: [
          {
            rotateZ: isRotate ? '120deg' : '0deg',
          },
        ],
      }}>
      <Animated.View
        style={[
          {
            borderRadius: 50,
            // overflow: 'hidden',
            backgroundColor,
            flex: 1,
            width: 400,
            height: 200,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

export default CustomCarousel;
