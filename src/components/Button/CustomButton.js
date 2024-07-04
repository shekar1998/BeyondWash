import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

let buttonWidth,
  buttonHeight,
  customColor,
  customFontSize,
  customPaddingVertical,
  customPaddingHorizontal,
  customFontColor,
  CustomFontWeight;
const CustomButton = ({
  title,
  onPress,
  customWidth,
  customHeight,
  backgroundColor,
  FontSize,
  PaddingHorizontal,
  PaddingVertical,
  FontColor,
  FontWeight,
}) => {
  buttonWidth = typeof customWidth === "undefined" ? width - 40 : customWidth;
  buttonHeight = typeof customHeight === "undefined" ? "auto" : customHeight;
  customColor =
    typeof backgroundColor === "undefined" ? "#2c65e0" : backgroundColor;
  customFontSize = typeof FontSize === "undefined" ? height * 0.019 : FontSize;
  customPaddingVertical =
    typeof PaddingVertical === "undefined" ? 15 : PaddingVertical;
  customPaddingHorizontal =
    typeof PaddingHorizontal === "undefined" ? 10 : PaddingHorizontal;
  customFontColor = typeof FontColor === "undefined" ? "#FFFFFF" : FontColor;
  CustomFontWeight = typeof FontWeight === "undefined" ? "bold" : FontWeight;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          width: buttonWidth,
          height: buttonHeight,
          backgroundColor: customColor,
          shadowColor: customColor,
          paddingVertical: customPaddingVertical,
          paddingHorizontal: customPaddingHorizontal,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          {
            fontSize: customFontSize,
            color: customFontColor,
            fontWeight: CustomFontWeight,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  button: {
    borderRadius: 10,

    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    alignSelf: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default CustomButton;
