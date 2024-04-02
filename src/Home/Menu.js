import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

const Menu = () => {
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      navigation.dispatch(DrawerActions.openDrawer());
    }, [])
  );

  return (
    <View>
      <Text>Menu</Text>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({});
