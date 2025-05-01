import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createComment,
  fetchPostDetail,
  removeComment,
  removePost,
} from "../../services/postService";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { ScrollView } from "react-native";
import PostCard from "../../components/PostCard";
import { useAuth } from "../../context/authContext";
import Loading from "../../components/Loading";
import Input from "../../components/input";
import Send from "../../assets/icons/Send";
import { Alert } from "react-native";
import CommentItem from "../../components/CommentItem";
import { supabase } from "../../lib/supabase";
import { createNotification } from "../../services/notification";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import ScreenWrapper from "../../components/ScreenWrapper";

const PostDetail = () => {
  const { postId, commentId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState({
    postLike: [], // Initialize with empty array
    user: {}, // Initialize with empty object
    body: "", // Initialize with empty string
    file: null, // Initialize with null
  });
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef("");
  const [loading, setLoading] = useState(false);

  const handleNewComment = async (payload) => {
    console.log("got payload");
    if (payload.new) {
      let newComment = { ...payload.new };
      newComment.user = user || {};
      setPost((prevPost) => {
        return {
          ...prevPost,
          comments: [newComment, ...prevPost.comments],
        };
      });
    }
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    getPostDetail();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const getPostDetail = async () => {
    try {
      const res = await fetchPostDetail(postId);
      if (res.success) {
        setPost(res.data);
      } else {
        console.error("Failed to fetch post:", res.error);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setStartLoading(false);
    }
  };

  const onNewComment = async () => {
    if (!commentRef) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    };
    setLoading(true);
    let res = await createComment(data);
    setLoading(false);
    if (res.success) {
      if (user.id != post.id) {
        //send notif
        let notify = {
          senderId: user.id,
          receiverId: post.userId,
          title: "commented on your post",
          data: JSON.stringify({ postId: post.id, commentId: res?.data?.id }),
        };
        createNotification(notify);
      }
      inputRef.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  if (startLoading) {
    return (
      <ScreenWrapper bg={theme.colors.dark}>
        <View style={styles.center}>
          <Loading />
        </View>
      </ScreenWrapper>
    );
  }

  if (!post) {
    return (
      <ScreenWrapper bg={theme.colors.dark}>
        <View
          style={[
            styles.center,
            { justifyContent: "flex-start", marginTop: 100 },
          ]}
        >
          <Text style={styles.notFound}>Post not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const onDeletePost = async (item) => {
    let res = await removePost(post?.id);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Post", res.msg);
    }
  };

  const onEditPost = (item) => {
    router.back();
    router.push({ pathname: "newPost", params: { ...item } });
  };

  const onDeletedComment = async (comment) => {
    let res = await removeComment(comment?.id);
    if (res.success) {
      setPost((prevPost) => {
        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(
          (c) => c.id != comment.id
        );
        return updatedPost;
      });
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  return (
    <ScreenWrapper bg={theme.colors.dark}>
      <LinearGradient
        colors={[
          "rgba(127,90,240,0.15)",
          "rgba(44,182,125,0.15)",
          "rgba(242,95,76,0.15)",
        ]}
        style={styles.gradientOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <BlurView intensity={20} style={styles.container} tint="dark">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            <PostCard
              item={{ ...post, comments: [{ count: post.comments?.length }] }}
              currentUser={user}
              router={router}
              showMore={false}
              showDelete={true}
              onDelete={onDeletePost}
              onEdit={onEditPost}
            />

            {/* comment input */}
            <BlurView
              intensity={15}
              style={styles.commentInputContainer}
              tint="dark"
            >
              <Input
                inputRef={inputRef}
                onChangeText={(value) => (commentRef.current = value)}
                placeholder="Type comment..."
                placeholderTextColor={theme.colors.textLight}
                containerStyle={{
                  flex: 1,
                  height: hp(6.2),
                  borderRadius: theme.radius.xl,
                  backgroundColor: theme.colors.darkLight,
                }}
              />
              {loading ? (
                <View style={styles.loading}>
                  <Loading size="small" />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.sendicon}
                  onPress={onNewComment}
                >
                  <Send style={{ color: theme.colors.primary }} />
                </TouchableOpacity>
              )}
            </BlurView>

            {/* comment list */}
            <View style={styles.commentsList}>
              {post?.comments?.map((comment) => (
                <CommentItem
                  item={comment}
                  key={comment?.id?.toString()}
                  canDelete={user?.id == comment.userId || user?.id == post.id}
                  highlight={comment.id == commentId}
                  onDeleted={() => onDeletedComment(comment)}
                />
              ))}
              {post?.comments?.length == 0 && (
                <BlurView
                  intensity={15}
                  style={styles.noCommentsContainer}
                  tint="dark"
                >
                  <Text style={styles.noCommentsText}>Be first to comment</Text>
                </BlurView>
              )}
            </View>
          </ScrollView>
        </BlurView>
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sendicon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    height: hp(5.8),
    width: hp(5.8),
    backgroundColor: "rgba(127, 90, 240, 0.1)",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  list: {
    paddingHorizontal: wp(4),
    paddingVertical: wp(4),
    paddingBottom: hp(10),
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: wp(3),
    borderRadius: theme.radius.xl,
    marginVertical: hp(2),
    backgroundColor: "rgba(30, 30, 30, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  commentsList: {
    marginVertical: 10,
    gap: 15,
  },
  noCommentsContainer: {
    padding: 15,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(30, 30, 30, 0.4)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: wp(5),
  },
  noCommentsText: {
    color: theme.colors.text,
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
  },
});
