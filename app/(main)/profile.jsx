import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/authContext";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { hp, wp } from "../../helpers/common";
import Logout from "../../assets/icons/logout";
import { theme } from "../../constants/theme";
import { supabase } from "../../lib/supabase";
import Avatar from "../../components/Avatar";
import Edit from "../../assets/icons/Edit";
import Mail from "../../assets/icons/Mail";
import Call from "../../assets/icons/Call";
import { fetchPosts } from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

var limit = 0;
const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 10;
    console.log("fetch limit:", limit);
    const res = await fetchPosts(limit, user.id);
    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "No",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            Alert.alert("SignOut", error.message);
          } else {
            setAuth(null);
          }
        },
      },
    ]);
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
        <BlurView intensity={80} style={styles.blurContainer} tint="dark">
          <FlatList
            data={posts}
            ListHeaderComponent={
              <UserHeader
                user={user}
                router={router}
                handleLogout={handleLogout}
              />
            }
            ListHeaderComponentStyle={{ marginBottom: 20 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BlurView intensity={15} tint="dark">
                <PostCard
                  item={item}
                  currentUser={user}
                  router={router}
                  showDelete={false}
                />
              </BlurView>
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
                <BlurView
                  intensity={15}
                  tint="dark"
                  style={styles.noMoreContainer}
                >
                  <Text style={styles.noPost}>No more posts</Text>
                </BlurView>
              )
            }
          />
        </BlurView>
      </LinearGradient>
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, handleLogout }) => {
  return (
    <View style={styles.headerContainer}>
      {/* header */}
      <View style={styles.topHeader}>
        <Header showBackButton={true} textStyle={styles.headerTitle} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Logout style={{ color: theme.colors.rose }} />
        </TouchableOpacity>
      </View>

      <BlurView intensity={100} tint="dark" style={styles.profileCard}>
        {/* avatar */}
        <View style={[styles.contentContainer, { gap: 15 }]}>
          <View style={styles.avatarWrapper}>
            <Avatar
              url={user?.image}
              size={hp(14)}
              rounded={theme.radius.xxl * 4}
            />
            <Pressable
              style={styles.editIcon}
              onPress={() => router.push("editProfile")}
            >
              <Edit style={{ color: theme.colors.primary }} />
            </Pressable>
          </View>

          {/* user info */}
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={styles.userName}>
              {(user && user.name) || "username"}
            </Text>
            <Text style={styles.infoText}>
              {(user && user.address) || "location"}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.info}>
              <Mail style={{ color: theme.colors.primary }} />
              <Text style={styles.infoText}>
                {(user && user.email) || "email@example.com"}
              </Text>
            </View>
            <View style={styles.info}>
              <Call style={{ color: theme.colors.primary }} />
              <Text style={styles.infoText}>
                {(user && user.phoneNumber) || "0808080808"}
              </Text>
            </View>
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>
                {(user && user.bio) || "Bio information goes here"}
              </Text>
            </View>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  gradientOverlay: {
    flex: 1,
    width: wp(100),
  },
  blurContainer: {
    flex: 1,
    backgroundColor: "rgba(13, 13, 13, 0.5)",
  },
  headerContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: 10,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: hp(2.6),
    fontWeight: theme.fonts.bold,
  },
  profileCard: {
    borderRadius: theme.radius.lg,
    marginTop: 10,
    padding: wp(4),
    overflow: "hidden",
    backgroundColor: theme.colors.glass,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  contentContainer: {
    alignItems: "center",
    paddingVertical: 15,
  },
  avatarWrapper: {
    position: "relative",
    alignItems: "center",
    marginBottom: 5,
  },
  userName: {
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    textShadowColor: "rgba(127, 90, 240, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    gap: 12,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.7),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  bioContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 5,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: theme.radius.md,
  },
  bioText: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
    textAlign: "center",
    fontStyle: "italic",
  },
  logoutButton: {
    padding: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(255, 77, 109, 0.15)",
  },
  editIcon: {
    position: "absolute",
    right: -12,
    bottom: -4,
    padding: 8,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.glass,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
    gap: 15,
  },
  postCard: {
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    backgroundColor: theme.colors.glass,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  noMoreContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.glass,
    alignItems: "center",
  },
  noPost: {
    fontSize: hp(1.8),
    textAlign: "center",
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
});
