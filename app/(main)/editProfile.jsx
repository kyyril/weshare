import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { useAuth } from "../../context/authContext";
import Camera from "../../assets/icons/Camera";
import Input from "../../components/input";
import User from "../../assets/icons/User";
import Location from "../../assets/icons/Location";
import Call from "../../assets/icons/Call";
import Button from "../../components/Button";
import { updateUser } from "../../services/userServices";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getUserImage, uploadFile } from "../../services/userImage";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const EditProfile = () => {
  const router = useRouter();
  const { user: currentUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    bio: "",
    address: "",
    phoneNumber: "",
    image: null,
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name,
        bio: currentUser.bio,
        address: currentUser.address,
        phoneNumber: currentUser.phoneNumber,
        image: currentUser.image,
      });
    }
  }, [currentUser]);

  const onSubmit = async () => {
    let userData = { ...user };
    let { name, bio, address, phoneNumber, image } = userData;
    if (!name || !bio || !address || !phoneNumber) {
      Alert.alert("Edit Profile", "Please fill all the fields");
      return;
    }
    setLoading(true);

    if (typeof image == "object") {
      // upload image
      let imageRes = await uploadFile("profile", image.uri, true);
      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }
    //update user
    const res = await updateUser(currentUser.id, userData);
    setLoading(false);
    if (res.success) {
      setUserData({ ...currentUser, ...userData });
      router.back();
    }
  };

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  const getImageSource = () => {
    if (!user.image) {
      return require("../../assets/images/defaultUser.png");
    }
    if (typeof user.image === "object") {
      return { uri: user.image.uri };
    }
    return { uri: getUserImage(user.image) };
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
        <BlurView intensity={100} style={styles.blurContainer} tint="dark">
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Header
                title={"Edit Profile"}
                showBackButton
                textStyle={styles.headerTitle}
              />

              <View style={styles.avatarWrapper}>
                <LinearGradient
                  colors={["rgba(127,90,240,0.5)", "rgba(242,95,76,0.5)"]}
                  style={styles.avatarGlow}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Image
                    source={getImageSource()}
                    style={styles.avatarImage}
                    contentFit="cover"
                  />
                </LinearGradient>
                <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                  <Camera color={theme.colors.primary} />
                </Pressable>
              </View>

              <BlurView intensity={25} tint="dark" style={styles.formContainer}>
                <Text style={styles.formLabel}>
                  Complete your profile information
                </Text>

                <Input
                  style={{ color: "white" }}
                  icon={<User color={theme.colors.primary} />}
                  size={26}
                  strokeWidth={1.6}
                  placeholder="Enter your name"
                  value={user.name}
                  onChangeText={(value) => {
                    setUser({ ...user, name: value });
                  }}
                />
                <Input
                  style={{ color: "white" }}
                  icon={<Location color={theme.colors.primary} />}
                  size={26}
                  strokeWidth={1.6}
                  placeholder="Enter your location"
                  value={user.address}
                  onChangeText={(value) => {
                    setUser({ ...user, address: value });
                  }}
                />
                <Input
                  style={{ color: "white" }}
                  icon={<Call color={theme.colors.primary} />}
                  size={26}
                  strokeWidth={1.6}
                  placeholder="Enter your phone number"
                  value={user.phoneNumber}
                  onChangeText={(value) => {
                    setUser({ ...user, phoneNumber: value });
                  }}
                />
                <Input
                  style={{ color: "white" }}
                  multiline={true}
                  containerStyle={styles.bio}
                  placeholder="Enter your bio"
                  value={user.bio}
                  onChangeText={(value) => {
                    setUser({ ...user, bio: value });
                  }}
                />

                <Button
                  title="Update Profile"
                  loading={loading}
                  onPress={onSubmit}
                  buttonStyle={styles.updateButton}
                  hasShadow={true}
                />
              </BlurView>
            </View>
          </ScrollView>
        </BlurView>
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  gradientOverlay: {
    flex: 1,
    width: wp(100),
  },
  blurContainer: {
    flex: 1,
    backgroundColor: "rgba(13, 13, 13, 0.5)",
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingBottom: 30,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: hp(2.6),
    fontWeight: theme.fonts.bold,
  },
  avatarWrapper: {
    marginVertical: hp(3),
    alignItems: "center",
    position: "relative",
    alignSelf: "center",
  },
  avatarGlow: {
    padding: 4,
    borderRadius: theme.radius.xxl * 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  avatarImage: {
    width: hp(18),
    height: hp(18),
    borderRadius: theme.radius.xxl * 4,
    borderWidth: 2,
    borderColor: theme.colors.primary + "40",
  },
  cameraIcon: {
    position: "absolute",
    right: -10,
    bottom: -10,
    padding: 12,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.glass,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  formContainer: {
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    backgroundColor: theme.colors.glass,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    gap: 6,
  },
  formLabel: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
    marginBottom: 15,
    textAlign: "center",
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderWidth: 0.4,
    borderColor: theme.colors.primary + "50",
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    marginVertical: 5,
  },
  updateButton: {
    backgroundColor: theme.colors.primary,
    marginTop: 15,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
});
