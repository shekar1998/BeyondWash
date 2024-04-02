import React from 'react';
import {View, StyleSheet} from 'react-native';
import Wave from 'react-native-waveview';

const Animation = () => {
  return (
    <View style={_styles.container}>
      <Wave
        style={_styles.waveBall}
        H={70}
        waveParams={[
          {A: 10, T: 180, fill: '#62c2ff'},
          {A: 15, T: 140, fill: '#0087dc'},
          {A: 20, T: 100, fill: '#1aa7ff'},
        ]}
        animated={true}
      />
    </View>
  );
};

const _styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  wave: {
    width: 100,
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  waveBall: {
    width: 100,
    aspectRatio: 1,
    borderRadius: 50,
    overflow: 'hidden',
  },
});

export default Animation;
