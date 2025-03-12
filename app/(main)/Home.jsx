import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../context/authContext";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";
import Heart from "../../assets/icons/Heart";
import Plus from "../../assets/icons/Plus";
import User from "../../assets/icons/User";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
import { fetchPosts } from "../../services/postService";
import PostCard from "../../components/PostCard";

const Home = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  var limit = 0;
  const getPosts = async () => {
    limit = limit + 10;
    //getpost
    console.log("fetch limit:", limit);
    const res = await fetchPosts(limit);
    if (res.success) {
      setPosts(res.data);
    }
  };

  return (
    <ScreenWrapper bg={"black"}>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>WeShare</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("notifications")}>
              <Heart color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push("newPost")}>
              <Plus color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push("profile")}>
              <Avatar
                url={user?.image}
                size={hp(3.1)}
                rounded={theme.radius.xxl}
                style={{ borderWidth: 2 }}
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
            <PostCard item={item} currentUser={user} router={router} />
          )}
          onEndReached={getPosts}
          onEndReachedThreshold={0.5}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: wp(4),
    marginBottom: 10,
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  pill: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: theme.colors.roseLight,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
  noPost: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  avatarImage: {
    width: hp(4.3),
    height: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
