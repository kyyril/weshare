import { Share, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { theme } from "../constants/theme";
import { hp, stripHtmlTags, wp } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import ThreeDotsHorizontal from "../assets/icons/ThreeDotsHorizontal";
import RenderHTML from "react-native-render-html";
import { Image } from "expo-image";
import { downloadFile, getSupabaseUrl } from "../services/userImage";
import { Video } from "expo-av";
import Heart from "../assets/icons/Heart";
import Comment from "../assets/icons/Comment";
import { createPostLike, removePostLike } from "../services/postService";
import { Alert } from "react-native";
import ShareIcon from "../assets/icons/Share";
import Loading from "./Loading";

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
  const [likes, setLikes] = useState([]); // Initialize with empty array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Safely set likes with fallback to empty array
    setLikes(item.postLike || []);
  }, [item.postLike]);

  const onLiked = async () => {
    if (!currentUser?.id) {
      Alert.alert("Error", "Please login to like posts");
      return;
    }

    try {
      if (isLiked) {
        //remove like
        const updatedLikes = likes.filter(
          (like) => like.userId !== currentUser?.id
        );
        setLikes(updatedLikes);
        const res = await removePostLike(item?.id, currentUser?.id);
        if (!res.success) {
          setLikes(likes); // Restore previous state if failed
          Alert.alert("Error", "Failed to remove like");
        }
      } else {
        //create like
        const newLike = {
          userId: currentUser?.id,
          postId: item?.id,
        };

        setLikes([...likes, newLike]);

        const res = await createPostLike(newLike);
        if (!res.success) {
          setLikes(likes); // Restore previous state if failed
          Alert.alert("Error", "Failed to add like");
        }
      }
    } catch (error) {
      console.error("Like operation failed:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  // Move liked check inside component to ensure likes is defined
  const isLiked = useMemo(() => {
    return likes.some((like) => like.userId === currentUser?.id);
  }, [likes, currentUser?.id]);

  const openPostDetail = () => {
    //openPostComment
    router.push({ pathname: "postDetail", params: { postId: item?.id } });
  };
  const createdAt = moment(item.created_at).format("MMM D");

  const onShare = async () => {
    try {
      let content = { message: stripHtmlTags(item?.body) };

      if (item?.file) {
        const fileUrl = getSupabaseUrl(item?.file);
        setLoading(true);
        let url = await downloadFile(fileUrl);
        setLoading(false);
        if (url) {
          console.log(url);
          content.url = url;
        } else {
          console.warn("File download failed.");
        }
      }

      await Share.share(content);
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  };

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
          <TouchableOpacity onPress={onLiked}>
            <Heart
              fill={isLiked ? theme.colors.rose : "transparent"}
              style={{
                color: isLiked ? theme.colors.rose : "black",
              }}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes.length}</Text>
        </View>

        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetail}>
            <Comment />
          </TouchableOpacity>
          <Text style={styles.count}>{comments.length}</Text>
        </View>

        <View style={styles.footerButton}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <ShareIcon />
            </TouchableOpacity>
          )}
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
