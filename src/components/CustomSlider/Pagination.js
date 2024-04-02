import {StyleSheet, View} from 'react-native';
import React from 'react';

const Pagination = ({index, slideList}) => {
  return (
    <View style={styles.pagination} pointerEvents="none">
      {slideList?.map((_, i) => {
        return (
          <View
            key={i}
            style={[
              styles.paginationDot,
              index === i
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        );
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  paginationDotActive: {backgroundColor: 'lightblue'},
  paginationDotInactive: {backgroundColor: 'gray'},
});
