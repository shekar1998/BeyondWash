import {View, FlatList, Dimensions, StyleSheet} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import Pagination from './Pagination';

const {width: windowWidth, height} = Dimensions.get('window');

const slideList = Array.from({length: 5}).map((_, i) => {
  return {
    id: i,
    image: `https://picsum.photos/1440/2842?random=${i}`,
    title: `This is the title! ${i + 1}`,
    subtitle: `This is the subtitle ${i + 1}!`,
  };
});

const FlatListSlider = ({component}) => {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  indexRef.current = index;
  const onScroll = useCallback(event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    // Prevent one pixel triggering setIndex in the middle
    // of the transition. With this we have to scroll a bit
    // more to trigger the index change.
    const isNoMansLand = 0.4 < distance;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);

  const flatListOptimizationProps = {
    initialNumToRender: 0,
    maxToRenderPerBatch: 1,
    removeClippedSubviews: true,
    scrollEventThrottle: 16,
    windowSize: 2,
    keyExtractor: useCallback(e => e.id, []),
    getItemLayout: useCallback(
      (_, index) => ({
        index,
        length: windowWidth,
        offset: index * windowWidth,
      }),
      [],
    ),
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={slideList}
        style={styles.slider}
        renderItem={component}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        {...flatListOptimizationProps}
      />
      <Pagination index={index} slideList={slideList} />
    </View>
  );
};

export default FlatListSlider;

const styles = StyleSheet.create({
  container: {},
  slider: {
    height: height - 130,
  },
});
