import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { Image } from "expo-image";
import { getUserImage } from "../services/userImage";

const Avatar = ({
  url,
  size = hp(6),
  rounded = theme.radius.full,
  style = {},
}) => {
  return (
    <Image
      source={getUserImage(url)}
      transition={100}
      style={[
        styles.avatar,
        { height: size, width: size, borderRadius: rounded },
        style,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
});
