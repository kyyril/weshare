import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

const NewPost = () => {
  const post = useLocalSearchParams();
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);
  console.log("post", post);
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
    console.log(result.assets[0]);
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
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <Header title={"Create Post"} showBackButton />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* User Header */}
          <View style={styles.header}>
            <Avatar url={user.image} size={hp(6.5)} rounded={theme.radius.xl} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user?.name}</Text>
              <View style={styles.publicBadge}>
                <Text style={styles.publicText}>Public</Text>
              </View>
            </View>
          </View>

          {/* Text Editor */}
          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => (bodyRef.current = body)}
              placeholder="What's on your mind?"
            />
          </View>

          {/* Media Preview */}
          {file && (
            <View style={styles.filePreview}>
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
            </View>
          )}

          {/* Media Selection */}
          <View style={styles.mediaSelector}>
            <Text style={styles.mediaSelectorText}>Add to your post</Text>
            <View style={styles.mediaButtons}>
              <TouchableOpacity
                style={[
                  styles.mediaButton,
                  { backgroundColor: theme.colors.primary + "15" },
                ]}
                onPress={() => onPick(true)}
              >
                <ImageIcon color={theme.colors.primary} />
                <Text style={styles.mediaButtonText}>Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.mediaButton,
                  { backgroundColor: theme.colors.success + "15" },
                ]}
                onPress={() => onPick(false)}
              >
                <VideoIcon color={theme.colors.success} />
                <Text style={styles.mediaButtonText}>Video</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Button
          buttonStyle={styles.postButton}
          loading={loading}
          title={post && post.id ? "Update" : "Create"}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  userInfo: {
    gap: 4,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: "600",
    color: theme.colors.text,
  },
  publicBadge: {
    backgroundColor: theme.colors.gray + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  publicText: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
  },
  textEditor: {
    minHeight: hp(15),
    paddingTop: 10,
  },
  filePreview: {
    height: hp(35),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    backgroundColor: theme.colors.gray + "10",
  },
  mediaContent: {
    flex: 1,
    width: "100%",
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "white",
    borderRadius: theme.radius.xl,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  mediaSelector: {
    borderWidth: 1,
    borderColor: theme.colors.gray + "30",
    padding: 16,
    borderRadius: theme.radius.xl,
    backgroundColor: "white",
  },
  mediaSelectorText: {
    fontSize: hp(1.8),
    fontWeight: "500",
    color: theme.colors.textLight,
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
  },
  mediaButtonText: {
    fontSize: hp(1.8),
    fontWeight: "500",
    color: theme.colors.text,
  },
  postButton: {
    height: hp(6.5),
    marginBottom: 20,
  },
});

export default NewPost;
