import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import ThreeDotsHorizontal from "../assets/icons/ThreeDotsHorizontal";
import RenderHTML from "react-native-render-html";
import { Image } from "expo-image";
import { getSupabaseUrl } from "../services/userImage";
import { Video } from "expo-av";
import Heart from "../assets/icons/Heart";
import Comment from "../assets/icons/Comment";
import Share from "../assets/icons/Share";

const textStyles = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};
const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard = ({ item, currentUser, router }) => {
  const [liked, setLiked] = useState(true);
  const openPostDetail = () => {
    //open
  };
  const createdAt = moment(item.created_at).format("MMM D");

  const onLikeCliked = () => {
    setLiked(!liked);
  };

  let likes = [];
  let comments = [];
  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar url={item.user.image} radius={theme.radius.xxl * 4} />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={openPostDetail}>
          <ThreeDotsHorizontal />
        </TouchableOpacity>
      </View>

      {/* body post */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body ? (
            <RenderHTML
              contentWidth={wp(100)}
              source={{ html: item?.body || "" }}
              defaultTextProps={{ style: { color: theme.colors.text } }}
              tagsStyles={tagsStyles}
            />
          ) : null}
        </View>
      </View>

      {/* post image */}
      {item?.file && item?.file.includes("postImages") && (
        <Image
          source={getSupabaseUrl(item?.file)}
          style={styles.postMedia}
          transition={100}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      )}
      {/* post videos */}
      {item?.file && item?.file.includes("postVideos") && (
        <Video
          source={{ uri: getSupabaseUrl(item?.file) }}
          style={[styles.postMedia]}
          useNativeControls
          resizeMode="cover"
          isLooping
          shouldPlay={false}
          isMuted={true}
          onError={(error) => console.log("Video Error:", error)}
        />
      )}

      {/* liked and comment */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLikeCliked}>
            <Heart
              fill={liked ? theme.colors.rose : "transparent"}
              style={{
                color: liked ? theme.colors.rose : "black",
              }}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes.length}</Text>
        </View>

        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Comment />
          </TouchableOpacity>
          <Text style={styles.count}>{comments.length}</Text>
        </View>

        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Share />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  postBody: {
    marginLeft: 5,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  content: {
    gap: 10,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: theme.colors.gray,
    shadowColor: "#000",
  },
});
