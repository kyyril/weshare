import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Avatar from "./Avatar";
import moment from "moment";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Delete from "../assets/icons/Delete";

const CommentItem = ({ item, canDelete, onDeleted = () => {} }) => {
  const createdAt = moment(item.created_at).fromNow();

  const handleDelete = () => {
    Alert.alert("Confirm", "Are you sure want to delete this comment?", [
      {
        text: "Cancel",
        onPress: () => console.log("Canceled"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDeleted(item),
        style: "default",
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <Avatar
        url={item?.user?.image}
        size={hp(4.5)}
        rounded={theme.radius.full}
      />

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.username}>{item?.user?.name}</Text>
          <Text style={styles.time}>{createdAt}</Text>
        </View>

        {canDelete && (
          <TouchableOpacity onPress={handleDelete}>
            <Delete />
          </TouchableOpacity>
        )}
        <View style={styles.commentBubble}>
          <Text style={styles.commentText}>{item?.text}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    gap: wp(3),
    alignItems: "flex-start",
  },
  contentContainer: {
    flex: 1,
    gap: hp(0.5),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    fontSize: hp(1.8),
    fontWeight: "600",
    color: theme.colors.text,
  },
  time: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
  },
  commentBubble: {
    backgroundColor: theme.colors.gray + "15",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    borderRadius: theme.radius.xl,
    alignSelf: "flex-start",
  },
  commentText: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    lineHeight: hp(2.4),
  },
});

export default CommentItem;
