import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../context/authContext";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import Heart from "../../assets/icons/Heart";
import Plus from "../../assets/icons/Plus";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
import { fetchPosts } from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import { supabase } from "../../lib/supabase";
import { getUserData } from "../../services/userServices";

var limit = 0;

const Home = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [notifCount, setNotifCount] = useState(0);

  const handlePostEvent = async (payload) => {
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);

      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res.success ? res.data : {};
      setPosts((prevPost) => [newPost, ...prevPost]);
    }
    if (payload.eventType == "DELETE" && payload.old.id) {
      setPosts((prevPost) => {
        let updatedPosts = prevPost.filter((post) => post.id != payload.old.id);
        return updatedPosts;
      });
    }

    if (payload.eventType == "UPDATE" && payload?.new?.id) {
      setPosts((prevPost) => {
        let updatedPosts = prevPost.map((post) => {
          if (post.id == payload.new.id) {
            post.body = payload.new.body;
            post.file = payload.new.file;
          }
          return post;
        });
        return updatedPosts;
      });
    }
  };

  const handleNewNotification = async (payload) => {
    console.log("notif new", payload);
    if (payload.eventType == "INSERT" && payload.new.id)
      setNotifCount((prev) => prev + 1);
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    let notifChannel = supabase
      .channel("notification")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notification",
          filter: `receiverId=eq.${user.id}`,
        },
        handleNewNotification
      )
      .subscribe();

    getPosts();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(notifChannel);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 10;
    //getpost
    console.log("fetch limit:", limit);
    const res = await fetchPosts(limit);
    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);
      setPosts(res.data);
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
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.title}>WeShare</Text>
            <View style={styles.icons}>
              <Pressable
                style={styles.iconButton}
                onPress={() => {
                  setNotifCount(0);
                  router.push("notifications");
                }}
              >
                <Heart color={theme.colors.text} />
                {notifCount > 0 && (
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{notifCount}</Text>
                  </View>
                )}
              </Pressable>
              <Pressable
                style={styles.iconButton}
                onPress={() => router.push("newPost")}
              >
                <Plus color={theme.colors.text} />
              </Pressable>
              <Pressable
                style={styles.avatarContainer}
                onPress={() => router.push("profile")}
              >
                <Avatar
                  url={user?.image}
                  size={hp(3.1)}
                  rounded={theme.radius.full}
                  style={{
                    borderWidth: 2,
                    borderColor: theme.colors.primary,
                  }}
                />
              </Pressable>
            </View>
          </View>

          {/* posts */}
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PostCard
                item={item}
                currentUser={user}
                router={router}
                showDelete={false}
              />
            )}
            onEndReached={() => {
              getPosts();
              console.log("end");
            }}
            onEndReachedThreshold={0}
            ListFooterComponent={
              hasMore ? (
                <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
                  <Loading />
                </View>
              ) : (
                <View style={styles.endMessageContainer}>
                  <BlurView
                    intensity={30}
                    tint="dark"
                    style={styles.endMessage}
                  >
                    <Text style={styles.noPost}>No more posts</Text>
                  </BlurView>
                </View>
              )
            }
          />
        </BlurView>
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default Home;

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: wp(4),
    marginBottom: 15,
    paddingVertical: 10,
  },
  title: {
    color: theme.colors.textDark,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.extraBold,
    textShadowColor: "rgba(127, 90, 240, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  iconButton: {
    padding: 8,
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    borderRadius: theme.radius.full,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarContainer: {
    padding: 2,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  pill: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: theme.colors.accent,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.full,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  pillText: {
    color: theme.colors.textDark,
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
  endMessageContainer: {
    marginVertical: 30,
    alignItems: "center",
  },
  endMessage: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  noPost: {
    fontSize: hp(1.8),
    textAlign: "center",
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
    paddingBottom: 100,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
});
