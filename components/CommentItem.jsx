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
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => onDeleted(item),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Avatar
        url={item?.user?.image}
        size={hp(4.5)}
        rounded={theme.radius.full}
      />

      <View style={styles.contentContainer}>
        <View style={styles.commentBubble}>
          <View style={styles.bubbleHeader}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            {canDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Delete style={styles.deleteIcon} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.commentText}>{item?.text}</Text>
        </View>
        <Text style={styles.time}>{createdAt}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    gap: wp(2),
  },
  contentContainer: {
    flex: 1,
    gap: hp(0.5),
  },
  commentBubble: {
    backgroundColor: theme.colors.gray + "15",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: theme.radius.xl,
    maxWidth: "95%",
  },
  bubbleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  username: {
    fontSize: hp(1.7),
    fontWeight: "600",
    color: theme.colors.text,
  },
  commentText: {
    fontSize: hp(1.7),
    color: theme.colors.text,
    lineHeight: hp(2.2),
  },
  time: {
    fontSize: hp(1.5),
    color: theme.colors.textLight,
    marginLeft: wp(2),
  },
  deleteIcon: {
    color: theme.colors.textLight,
  },
});

export default CommentItem;
