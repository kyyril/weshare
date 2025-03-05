import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ArrowLeft from "../assets/icons/ArrowLeft";
import { theme } from "../constants/theme";
import { useRouter } from "expo-router";

const BackButton = () => {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <ArrowLeft color={theme.colors.text} strokeWidth={2} size={26} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});
