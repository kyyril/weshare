import {
  Share,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../constants/theme";
import { hp, stripHtmlTags, wp } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import ThreeDotsHorizontal from "../assets/icons/ThreeDotsHorizontal";
import RenderHTML from "react-native-render-html";
import { Image } from "expo-image";
import { downloadFile, getSupabaseUrl } from "../services/userImage";
import { Video } from "expo-av";
import Heart from "../assets/icons/Heart";
import Comment from "../assets/icons/Comment";
import { createPostLike, removePostLike } from "../services/postService";
import ShareIcon from "../assets/icons/Share";
import Loading from "./Loading";
import Edit from "../assets/icons/Edit";
import Delete from "../assets/icons/Delete";

const textStyles = {
  color: theme.colors.text,
  fontSize: hp(1.75),
};
const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
  h1: {
    color: theme.colors.text,
    fontWeight: theme.fonts.bold,
  },
  h4: {
    color: theme.colors.text,
    fontWeight: theme.fonts.semibold,
  },
};

const PostCard = ({
  item,
  currentUser,
  router,
  showMore = true,
  onDelete = () => {},
  onEdit = () => {},
  showDelete = true,
}) => {
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
    if (!showMore) return null;

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

  const handleDeletePost = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this Post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => onDelete(item),
        style: "destructive",
      },
    ]);
  };

  const getRandomColorIndex = () => {
    // Generate a pseudo-random number based on post id to maintain consistency
    const seed = item?.id
      ? item.id
          .toString()
          .split("")
          .reduce((a, b) => a + b.charCodeAt(0), 0)
      : 0;

    return seed % 3; // Return 0, 1, or 2
  };

  const colorAccents = [
    ["rgba(127,90,240,0.3)", "rgba(127,90,240,0.1)"], // Purple
    ["rgba(44,182,125,0.3)", "rgba(44,182,125,0.1)"], // Green
    ["rgba(242,95,76,0.3)", "rgba(242,95,76,0.1)"], // Orange
    ["rgba(242, 225, 76, 0.3)", "rgba(242, 206, 76, 0.1)"], // yellow
  ];

  const colorIndex = getRandomColorIndex();

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={colorAccents[colorIndex]}
        style={styles.gradientBorder}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <BlurView intensity={20} tint="dark" style={styles.container}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Avatar url={item.user.image} radius={theme.radius.full} />
              </View>
              <View style={{ gap: 2 }}>
                <Text style={styles.username}>{item?.user?.name}</Text>
                <Text style={styles.postTime}>{createdAt}</Text>
              </View>
            </View>

            {showMore && (
              <TouchableOpacity
                style={styles.moreButton}
                onPress={openPostDetail}
              >
                <ThreeDotsHorizontal style={{ color: "white" }} />
              </TouchableOpacity>
            )}

            {showDelete && currentUser?.id == item?.userId && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onEdit(item)}
                >
                  <Edit color={theme.colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: "rgba(242,95,76,0.3)" },
                  ]}
                  onPress={handleDeletePost}
                >
                  <Delete color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* body post */}
          <View style={styles.content}>
            <View style={styles.postBody}>
              {item?.body ? (
                <RenderHTML
                  contentWidth={wp(100)}
                  source={{ html: item?.body || "" }}
                  defaultTextProps={{
                    style: { color: theme.colors.text, fontSize: hp(2) },
                  }}
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
              transition={200}
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
              <TouchableOpacity
                style={[styles.iconButton, isLiked && styles.activeIconButton]}
                onPress={onLiked}
              >
                <Heart
                  fill={isLiked ? theme.colors.rose : "transparent"}
                  style={{
                    color: isLiked ? theme.colors.text : theme.colors.text,
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.count}>{likes.length}</Text>
            </View>

            <View style={styles.footerButton}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={openPostDetail}
              >
                <Comment color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={styles.count}>{item.comments[0].count}</Text>
            </View>

            <View style={styles.footerButton}>
              {loading ? (
                <Loading size="small" color={theme.colors.primary} />
              ) : (
                <TouchableOpacity style={styles.iconButton} onPress={onShare}>
                  <ShareIcon color={theme.colors.text} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 20,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  gradientBorder: {
    borderRadius: theme.radius.xl,
    padding: 1,
    overflow: "hidden",
  },
  container: {
    gap: 12,
    borderRadius: theme.radius.xl - 1,
    overflow: "hidden",
    padding: 15,
    backgroundColor: theme.colors.glass,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarContainer: {
    padding: 2,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  username: {
    fontSize: hp(1.8),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.bold,
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  moreButton: {
    padding: 8,
    borderRadius: theme.radius.full,
    backgroundColor: "rgba(77, 77, 77, 0.25)",
  },
  content: {
    gap: 12,
  },
  postBody: {
    marginLeft: 5,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 5,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: theme.radius.full,
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconButton: {
    backgroundColor: "rgba(255, 77, 109, 0.3)",
    shadowColor: theme.colors.rose,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: theme.radius.full,
    backgroundColor: "rgba(30, 30, 30, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
