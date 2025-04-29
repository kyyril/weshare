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

var limit = 0;
const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 10;
    //getpost
    console.log("fetch limit:", limit);
    const res = await fetchPosts(limit, user.id);
    if (res.success) {
      if (posts.length == res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  };

  const handleLogout = async () => {
    //show confirm modal
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
    <ScreenWrapper bg={"white"}>
      <FlatList
        data={posts}
        ListHeaderComponent={
          <UserHeader user={user} router={router} handleLogout={handleLogout} />
        }
        ListHeaderComponentStyle={{ marginBottom: 30 }}
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
            <View style={{ marginVertical: 30 }}>
              <Text style={styles.noPost}>no more posts</Text>
            </View>
          )
        }
      />
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, handleLogout }) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      {/* header */}
      <View>
        <Header title={"Profile"} showBackButton={true} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Logout style={{ color: theme.colors.rose }} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* avatar */}
        <View style={[styles.contentContainer, { gap: 10 }]}>
          <View style={styles.avatarWrapper}>
            <Avatar
              url={user?.image}
              size={hp(12)}
              rounded={theme.radius.xxl * 4}
            />
            <Pressable
              style={styles.editIcon}
              onPress={() => router.push("editProfile")}
            >
              <Edit />
            </Pressable>
          </View>

          {/* user info */}
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={styles.userName}>
              {(user && user.name) || "username"}
            </Text>
            <Text style={styles.infoText}>
              {" "}
              {(user && user.address) || "yunani"}
            </Text>
          </View>
          <View style={{ gap: 10 }}>
            <View style={styles.info}>
              <Mail style={{ color: theme.colors.textLight }} />
              <Text style={styles.infoText}>
                {(user && user.email) || "lorem@gmail.com"}
              </Text>
            </View>
            <View style={styles.info}>
              <Call style={{ color: theme.colors.textLight }} />
              <Text style={styles.infoText}>
                {(user && user.phoneNumber) || "0808080808"}
              </Text>
            </View>
            <Text style={styles.infoText}>
              {(user && user.bio) || "biolorem ipsum dolor sit amet"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    gap: 15,
  },
  noPost: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  avatarWrapper: {
    position: "relative",
    alignItems: "center",
  },
  listStyle: {
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "#fee2e2",
  },
  infoText: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
    fontWeight: "500",
  },
  info: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: "500",
    color: theme.colors.textDark,
  },
  editIcon: {
    position: "absolute",
    right: -12,
    bottom: -4,
    padding: 7,
    borderRadius: theme.radius.md,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  avatarContainer: {
    height: hp(12),
    width: wp(12),
    alignSelf: "center",
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  container: {
    flex: 1,
  },
});
