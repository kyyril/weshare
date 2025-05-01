import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import BackButton from "../components/BackButton";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import Input from "../components/input";
import Mail from "../assets/icons/Mail";
import { useRouter } from "expo-router";
import { useRef } from "react";
import Lock from "../assets/icons/Lock";
import Button from "../components/Button";
import User from "../assets/icons/User";
import { supabase } from "../lib/supabase";
import { BlurView } from "expo-blur";

const SignUp = () => {
  const router = useRouter();
  const userNameRef = useRef("");
  const emailRef = useRef("");
  const passRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passRef.current || !userNameRef.current) {
      Alert.alert("SignUp", "Please fill all the fields");
      return;
    }
    let name = userNameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passRef.current.trim();
    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    setLoading(false);
    console.log("session", session);
    console.log("error", error);
    if (error) {
      Alert.alert("SignUp", error.message);
    }
  };

  return (
    <ScreenWrapper bg={theme.colors.dark}>
      <View style={styles.container}>
        <BackButton color={theme.colors.text} />

        {/* welcome */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Lets,</Text>
          <Text style={styles.welcomeText}>Get Started</Text>
        </View>

        {/* form */}
        <BlurView intensity={40} tint="dark" style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.formSubtitle}>
              Please fill in all fields to create an account
            </Text>
            <Input
              icon={<User color={theme.colors.primary} />}
              size={26}
              strokeWidth={1.6}
              placeholder="Enter your username"
              onChangeText={(value) => (userNameRef.current = value)}
            />
            <Input
              icon={<Mail color={theme.colors.primary} />}
              size={26}
              strokeWidth={1.6}
              placeholder="Enter your email"
              onChangeText={(value) => (emailRef.current = value)}
            />
            <Input
              icon={<Lock color={theme.colors.primary} />}
              size={26}
              secureTextEntry
              strokeWidth={1.6}
              placeholder="Enter your password"
              onChangeText={(value) => (passRef.current = value)}
            />

            {/* button submit */}
            <Button
              title="Sign Up"
              loading={loading}
              onPress={onSubmit}
              hasShadow={true}
            />

            {/* footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable onPress={() => router.push("signIn")}>
                <Text style={styles.footerLink}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
    paddingHorizontal: wp(5),
    paddingBottom: hp(10),
  },
  welcomeContainer: {},
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
    textShadowColor: "rgba(127, 90, 240, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  formContainer: {
    flex: 1,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    backgroundColor: theme.colors.glass,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  form: {
    flex: 1,
    gap: 25,
    padding: wp(5),
    paddingTop: hp(4),
  },
  formSubtitle: {
    fontSize: hp(1.5),
    color: theme.colors.textLight,
    marginBottom: hp(1),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: hp(2),
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.textLight,
    fontSize: hp(1.6),
  },
  footerLink: {
    color: theme.colors.primary,
    fontWeight: theme.fonts.semibold,
    fontSize: hp(1.6),
    textShadowColor: "rgba(127, 90, 240, 0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
});
