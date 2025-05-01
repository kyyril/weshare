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
import { supabase } from "../lib/supabase";
import { BlurView } from "expo-blur";

const SignIn = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passRef.current) {
      Alert.alert("SignIn", "Please fill all the fields");
      return;
    }

    let email = emailRef.current.trim();
    let password = passRef.current.trim();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    console.log("error", error);
    if (error) {
      Alert.alert("SignIn", error.message);
    }
  };

  return (
    <ScreenWrapper bg={theme.colors.dark}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <BackButton color={theme.colors.text} />

        {/* welcome */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
        </View>

        {/* form */}
        <BlurView intensity={40} tint="dark" style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.formSubtitle}>Please Login to continue</Text>
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

            <Pressable onPress={() => {}}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </Pressable>

            {/* button submit */}
            <Button
              title="Sign In"
              loading={loading}
              onPress={onSubmit}
              hasShadow={true}
            />

            {/* footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Pressable onPress={() => router.push("signUp")}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </View>
    </ScreenWrapper>
  );
};

export default SignIn;

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
  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textLight,
    fontSize: hp(1.5),
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
