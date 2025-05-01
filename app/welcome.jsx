import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg={theme.colors.dark}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require("../assets/images/mewing.png")}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>WeShare!</Text>
          <Text style={styles.punchline}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, labore
          </Text>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Button
            title="Get Started"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.push("signUp")}
            hasShadow={true}
          />

          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Pressable onPress={() => router.push("signIn")}>
              <Text style={styles.loginLink}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingTop: hp(10),
    paddingBottom: hp(5),
  },
  welcomeImage: {
    borderRadius: theme.radius.full,
    width: wp(100),
    height: hp(40),
    alignSelf: "center",
    marginBottom: hp(5),
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  contentContainer: {
    width: "100%",
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    backgroundColor: theme.colors.glass,
    padding: wp(4),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  titleContainer: {
    gap: 15,
    marginBottom: hp(5),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4.5),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
    textShadowColor: "rgba(127, 90, 240, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  punchline: {
    textAlign: "center",
    paddingHorizontal: wp(5),
    fontSize: hp(1.7),
    color: theme.colors.textLight,
    lineHeight: hp(2.5),
  },
  footer: {
    width: "100%",
    gap: 30,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    color: theme.colors.textLight,
    fontSize: hp(1.6),
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: theme.fonts.semibold,
    fontSize: hp(1.6),
    textShadowColor: "rgba(127, 90, 240, 0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
});
