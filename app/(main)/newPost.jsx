import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import React, { useEffect, useRef } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Header from "../../components/Header";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../context/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import RichTextEditor from "../../components/RichTextEditor";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import ImageIcon from "../../assets/icons/Image";
import Delete from "../../assets/icons/Delete";
import { Video } from "expo-av";
import VideoIcon from "../../assets/icons/Video";
import { createOrUpdatePost } from "../../services/postService";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const NewPost = () => {
  const post = useLocalSearchParams();
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

  useEffect(() => {
    if (post && post.id) {
      bodyRef.current = post.body;
      setTimeout(() => {
        editorRef.current?.setContentHTML(post.body);
      }, 300);
      setFile(post.file);
    }
  }, []);

  const onPick = async (isImage) => {
    let mediaConfig = {
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    };
    if (!isImage) {
      mediaConfig = {
        mediaTypes: ["videos"],
        allowsEditing: true,
      };
    }

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const isLocalFile = (file) => {
    if (!file) return null;
    if (typeof file == "object") {
      return true;
    }
    return false;
  };

  const getFileType = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }

    // check image or video for remote file
    if (file.includes("postImage")) {
      return "image";
    }
    return "video";
  };

  const getFileUrl = (file) => {
    if (!file) {
      return null;
    }
    if (isLocalFile) {
      return file.uri;
    }

    return getSupabaseUrl(file)?.uri;
  };

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert("Post", "Please add post body or choose and image");
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    };
    if (post && post.id) data.id = post.id;
    setLoading(true);
    const res = await createOrUpdatePost(data);
    setLoading(false);
    if (res.success) {
      setFile(null);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");
      router.back();
    }
  };

  return (
    <ScreenWrapper bg={theme.colors.dark}>
      <LinearGradient
        colors={["rgba(127,90,240,0.15)", "rgba(242,95,76,0.15)"]}
        style={styles.gradientOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <BlurView intensity={20} style={styles.container} tint="dark">
          <Header
            title={"Create Post"}
            showBackButton
            containerStyle={styles.header}
            titleStyle={styles.headerTitle}
          />

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* User Header */}
            <BlurView intensity={15} style={styles.userHeader} tint="dark">
              <Avatar
                url={user.image}
                size={hp(6.5)}
                rounded={theme.radius.xl}
                style={{
                  borderWidth: 2,
                  borderColor: theme.colors.primary,
                }}
              />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{user?.name}</Text>
                <View style={styles.publicBadge}>
                  <Text style={styles.publicText}>Public</Text>
                </View>
              </View>
            </BlurView>

            {/* Text Editor */}
            <BlurView intensity={15} style={styles.textEditor} tint="dark">
              <RichTextEditor
                editorRef={editorRef}
                onChange={(body) => (bodyRef.current = body)}
                placeholder="What's on your mind?"
                style={styles.richEditor}
              />
            </BlurView>

            {/* Media Preview */}
            {file && (
              <BlurView intensity={10} style={styles.filePreview} tint="dark">
                {getFileType(file) == "video" ? (
                  <Video
                    source={{ uri: getFileUrl(file) || file }}
                    resizeMode="cover"
                    useNativeControls
                    style={styles.mediaContent}
                    isLooping
                  />
                ) : (
                  <Image
                    source={{ uri: getFileUrl(file) || file }}
                    contentFit="cover"
                    style={styles.mediaContent}
                  />
                )}
                <Pressable
                  style={styles.closeIcon}
                  onPress={() => setFile(null)}
                  hitSlop={10}
                >
                  <Delete color={theme.colors.rose} />
                </Pressable>
              </BlurView>
            )}

            {/* Media Selection */}
            <BlurView intensity={15} style={styles.mediaSelector} tint="dark">
              <Text style={styles.mediaSelectorText}>Add to your post</Text>
              <View style={styles.mediaButtons}>
                <TouchableOpacity
                  style={[
                    styles.mediaButton,
                    { backgroundColor: "rgba(127, 90, 240, 0.15)" },
                  ]}
                  onPress={() => onPick(true)}
                >
                  <ImageIcon color={theme.colors.primary} />
                  <Text style={styles.mediaButtonText}>Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.mediaButton,
                    { backgroundColor: "rgba(44, 182, 125, 0.15)" },
                  ]}
                  onPress={() => onPick(false)}
                >
                  <VideoIcon color={theme.colors.secondary} />
                  <Text style={styles.mediaButtonText}>Video</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </ScrollView>

          <Button
            buttonStyle={styles.postButton}
            loading={loading}
            title={post && post.id ? "Update" : "Create"}
            onPress={onSubmit}
          />
        </BlurView>
      </LinearGradient>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  header: {
    marginTop: hp(2),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: theme.radius.xl,
    paddingVertical: hp(1.5),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    color: theme.colors.textDark,
    fontWeight: theme.fonts.bold,
    textShadowColor: "rgba(127, 90, 240, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 20,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 15,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(30, 30, 30, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  userInfo: {
    gap: 4,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textDark,
    textShadowColor: "rgba(127, 90, 240, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  publicBadge: {
    backgroundColor: "rgba(107, 114, 128, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  publicText: {
    fontSize: hp(1.6),
    color: theme.colors.text,
  },
  textEditor: {
    minHeight: hp(15),
    padding: 10,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(30, 30, 30, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  richEditor: {
    backgroundColor: "transparent",
    color: theme.colors.text,
  },
  filePreview: {
    height: hp(35),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    backgroundColor: "rgba(30, 30, 30, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  mediaContent: {
    flex: 1,
    width: "100%",
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(13, 13, 13, 0.8)",
    borderRadius: theme.radius.full,
    padding: 8,
    shadowColor: theme.colors.rose,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  mediaSelector: {
    padding: 16,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(30, 30, 30, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  mediaSelectorText: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: 12,
  },
  mediaButtons: {
    flexDirection: "row",
    gap: 12,
  },
  mediaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: theme.radius.lg,
    flex: 1,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  mediaButtonText: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
  },
  postButton: {
    height: hp(6.5),
    marginBottom: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default NewPost;
