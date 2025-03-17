import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createComment,
  fetchPostDetail,
  removeComment,
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

const PostDetail = () => {
  const { postId } = useLocalSearchParams();
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
      inputRef.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }
  if (!post) {
    return (
      <View
        style={[
          styles.center,
          { justifyContent: "flex-start", marginTop: 100 },
        ]}
      >
        <Text style={styles.notFound}>Post not found</Text>
      </View>
    );
  }

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
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <PostCard
          item={{ ...post, comments: [{ count: post.comments?.length }] }}
          currentUser={user}
          router={router}
          showMore={false}
        />

        {/* comment input */}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            onChangeText={(value) => (commentRef.current = value)}
            placeholder="Type comment..."
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{
              flex: 1,
              height: hp(6.2),
              borderRadius: theme.radius.xl,
            }}
          />
          {loading ? (
            <View style={styles.loading}>
              <Loading size="small" />
            </View>
          ) : (
            <TouchableOpacity style={styles.sendicon} onPress={onNewComment}>
              <Send style={{ color: theme.colors.primaryDark }} />
            </TouchableOpacity>
          )}
        </View>

        {/* comment list */}
        <View style={{ marginVertical: 15, gap: 17 }}>
          {post?.comments?.map((comment) => (
            <CommentItem
              item={comment}
              key={comment?.id?.toString()}
              canDelete={user?.id == comment.userId || user?.id == post.id}
              onDeleted={() => onDeletedComment(comment)}
            />
          ))}
          {post?.comments?.length == 0 && (
            <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
              Be first to comment
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
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
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  list: {
    paddingHorizontal: wp(4),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  container: {
    flex: 1,
    paddingVertical: wp(7),
  },
});
