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
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title={"Edit Profile"} showBackButton />

          <View style={styles.avatarWrapper}>
            <Image
              source={getImageSource()}
              style={styles.avatarImage}
              contentFit="cover"
            />
            <Pressable style={styles.cameraIcon} onPress={onPickImage}>
              <Camera color={theme.colors.primary} />
            </Pressable>
          </View>

          <View style={styles.form}>
            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Fill in the field you want to replace
            </Text>
            <Input
              icon={<User />}
              size={26}
              strokeWidth={1.6}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={(value) => {
                setUser({ ...user, name: value });
              }}
            />
            <Input
              icon={<Location />}
              size={26}
              strokeWidth={1.6}
              placeholder="Enter your location"
              value={user.address}
              onChangeText={(value) => {
                setUser({ ...user, address: value });
              }}
            />
            <Input
              icon={<Call />}
              size={26}
              strokeWidth={1.6}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={(value) => {
                setUser({ ...user, phoneNumber: value });
              }}
            />
            <Input
              multiline={true}
              containerStyle={styles.bio}
              placeholder="Enter your bio"
              value={user.bio}
              onChangeText={(value) => {
                setUser({ ...user, bio: value });
              }}
            />

            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
  input: {
    flexDirection: "row",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.sm,
    borderCurve: theme.radius.sm,
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  form: {
    gap: 10,
    marginTop: 20,
  },
  avatar: {
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  cameraIcon: {
    position: "absolute",
    right: -10,
    bottom: -10,
    padding: 10,
    borderRadius: theme.radius.xl,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarWrapper: {
    marginVertical: hp(3),
    alignItems: "center",
    position: "relative",
    alignSelf: "center",
  },
  avatarImage: {
    width: hp(16),
    height: hp(16),
    borderRadius: theme.radius.xxl * 4,
    borderWidth: 2,
    borderColor: theme.colors.primary + "20",
  },
});
