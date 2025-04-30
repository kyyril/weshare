import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { TouchableOpacity } from "react-native";
import Avatar from "./Avatar";
import moment from "moment";
const NotificationItem = ({ item, key, router }) => {
  const handleClick = () => {
    let { postId, commentId } = JSON.parse(item?.data);
    router.push({ pathname: "postDetail", params: { postId, commentId } });
  };

  const createdAt = moment(item?.created_at).format("MMM d");
  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      {/* avatar */}
      <Avatar url={item?.sender?.image} size={hp(5)} />
      <View style={styles.nameTitle}>
        <Text style={styles.text}>{item?.sender?.name}</Text>
        <Text style={[styles.text, { color: theme.colors.textDark }]}>
          {item?.title}
        </Text>
      </View>
      <Text>{createdAt}</Text>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding: 15,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
  },
  nameTitle: {
    flex: 1,
    gap: 2,
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
  },
});
