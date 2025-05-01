import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { TouchableOpacity } from "react-native";
import Avatar from "./Avatar";
import moment from "moment";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const NotificationItem = ({ item, router }) => {
  const handleClick = () => {
    let { postId, commentId } = JSON.parse(item?.data);
    router.push({ pathname: "postDetail", params: { postId, commentId } });
  };

  const createdAt = moment(item?.created_at).format("MMM d");

  return (
    <TouchableOpacity onPress={handleClick}>
      <BlurView intensity={40} tint="dark" style={styles.container}>
        <LinearGradient
          colors={["rgba(127,90,240,0.07)", "rgba(242,95,76,0.07)"]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Avatar with glow effect */}
        <View style={styles.avatarContainer}>
          <Avatar
            url={item?.sender?.image}
            size={hp(5)}
            rounded={theme.radius.full}
            style={styles.avatar}
          />
        </View>

        {/* Notification content */}
        <View style={styles.nameTitle}>
          <Text style={styles.nameText}>{item?.sender?.name}</Text>
          <Text style={styles.titleText}>{item?.title}</Text>
        </View>

        {/* Timestamp */}
        <Text style={styles.timestamp}>{createdAt}</Text>
      </BlurView>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: theme.radius.xxl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatarContainer: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  avatar: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  nameTitle: {
    flex: 1,
    gap: 4,
  },
  nameText: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    textShadowColor: "rgba(127, 90, 240, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleText: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  timestamp: {
    fontSize: hp(1.5),
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: theme.fonts.medium,
  },
});
