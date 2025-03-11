import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import ImageIcon from "../../assets/icons/Image";
import Delete from "../../assets/icons/Delete";
import { Video } from "expo-av";
import VideoIcon from "../../assets/icons/Video";

const NewPost = () => {
  const { user } = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

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
  const onSubmit = () => {
    console.log("submited");
  };
  console.log(getFileUrl(file));
  return (
    <ScreenWrapper bg={"white"}>
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

          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => (bodyRef.current = body)}
            />
          </View>

          {file && (
            <View style={styles.file}>
              {getFileType(file) == "video" ? (
                <Video
                  source={{ uri: getFileUrl(file) }}
                  resizeMode="cover"
                  useNativeControl
                  style={{ flex: 1 }}
                  isLooping
                />
              ) : (
                <Image
                  source={{ uri: getFileUrl(file) }}
                  resizeMode="cover"
                  style={{ flex: 1 }}
                />
              )}
              <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                <Delete />
              </Pressable>
            </View>
          )}

          <View style={styles.media}>
            <Text style={styles.addImageText}>Add media</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity
                onPress={() => onPick(true)}
                color={theme.colors.dark}
              >
                <ImageIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onPick(false)}
                color={theme.colors.dark}
              >
                <VideoIcon />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Button
          buttonStyle={{ height: hp(6.5) }}
          loading={loading}
          title="Post"
          onPress={onSubmit}
        />
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
    backgroundColor: "rgba(255, 0, 0, 0.4)",
    borderRadius: theme.radius.xl,
    padding: 4,
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
