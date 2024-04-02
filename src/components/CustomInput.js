import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#EDEDED',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
  },
  icon: {
    marginHorizontal: 10,
    width: 30,
    height: 30,
    backgroundColor: '#18224e',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 50,
  },
  input: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: '#333333',
    paddingVertical: 8,
    fontWeight: '600',
  },
  placeholder: {
    color: '#000',
    fontStyle: 'italic',
  },
});

const CustomTextInput = ({iconName, placeholder, ...rest}) => {
  return (
    <View style={styles.inputContainer}>
      {iconName === 'none' ? (
        iconName === 'email' ? (
          <MaterialCommunityIcons
            name={iconName}
            size={17}
            color="#fff"
            style={styles.icon}
          />
        ) : iconName === 'location' ? (
          <Octicons
            name={iconName}
            size={17}
            color="#fff"
            style={styles.icon}
          />
        ) : (
          <FontAwesome
            name={iconName}
            size={17}
            color="#fff"
            style={styles.icon}
          />
        )
      ) : (
        <></>
      )}
      {iconName === 'location' ? (
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#AAAAAA"
          {...rest}
          multiline
          numberOfLines={4}
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#AAAAAA"
          {...rest}
        />
      )}
    </View>
  );
};

export default CustomTextInput;
