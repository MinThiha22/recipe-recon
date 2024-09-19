import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function Button({
  title,
  onPress,
  icon,
  color,
  containerStyles,
  textStyles,
  isLoading,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row justify-center items-center min-h-[40px] rounded-md bg-primary ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Entypo name={icon} size={28} color={color ? color : "#f1f1f1"} />
      <Text
        className={`font-poppinsBold text-lg text-white ml-2 ${textStyles}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
