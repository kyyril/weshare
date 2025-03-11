import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Header from "../../components/Header";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../context/authContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import RichTextEditor from "../../components/RichTextEditor";

const NewPost = () => {
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title={"Create Post"} showBackButton />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          {/* avatar */}
          <View style={styles.header}>
            <Avatar url={user.image} size={hp(6.5)} rounded={theme.radius.xl} />
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>{user?.name}</Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.textEditor}>
          <RichTextEditor
            editorRef={editorRef}
            onChange={(body) => (bodyRef.current = body)}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  file: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  video: {},
  imageIcon: {
    borderRadius: theme.radius.md,
  },
  addImageText: {},
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,

    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
  },
  textEditor: {
    paddingTop: 10,
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.colors.textLight,
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: "center",
  },
  container: {
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
});
