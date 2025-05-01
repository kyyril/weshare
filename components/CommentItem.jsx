import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Avatar from "./Avatar";
import moment from "moment";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Delete from "../assets/icons/Delete";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const CommentItem = ({
  item,
  highlight = false,
  canDelete,
  onDeleted = () => {},
}) => {
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
      <View style={styles.avatarContainer}>
        <Avatar
          url={item?.user?.image}
          size={hp(4.5)}
          rounded={theme.radius.full}
          style={styles.avatar}
        />
      </View>

      <View style={[styles.contentContainer, highlight && styles.highlighted]}>
        <BlurView intensity={25} tint="dark" style={styles.commentBubble}>
          <LinearGradient
            colors={
              highlight
                ? ["rgba(127,90,240,0.2)", "rgba(242,95,76,0.2)"]
                : ["rgba(30,30,30,0.8)", "rgba(30,30,30,0.7)"]
            }
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <View style={styles.bubbleHeader}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            {canDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.deleteButton}
              >
                <Delete color={theme.colors.rose} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.commentText}>{item?.text}</Text>
        </BlurView>

        <Text style={styles.time}>{createdAt}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    gap: wp(2),
  },
  avatarContainer: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  avatar: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  contentContainer: {
    flex: 1,
    gap: hp(0.5),
  },
  commentBubble: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
    borderRadius: theme.radius.xl,
    maxWidth: "95%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubbleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textDark,
    textShadowColor: "rgba(127, 90, 240, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  deleteButton: {
    padding: 2,
    backgroundColor: "rgba(255, 77, 109, 0.15)",
    borderRadius: theme.radius.full,
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
  highlighted: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
});

export default CommentItem;
