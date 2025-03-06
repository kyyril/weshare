import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
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
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton />

        {/* wellcome */}
        <View>
          <Text style={styles.wellcomeText}>Hey,</Text>
          <Text style={styles.wellcomeText}>Wellcome Back!</Text>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
            Please Login to continue
          </Text>
          <Input
            icon={<Mail />}
            size={26}
            strokeWidth={1.6}
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={<Lock />}
            size={26}
            secureTextEntry
            strokeWidth={1.6}
            placeholder="Enter your password"
            onChangeText={(value) => (passRef.current = value)}
          />

          <Text style={styles.forgotPassword}>Forgot password?</Text>

          {/* button submit */}
          <Button title="Sign In" loading={loading} onPress={onSubmit}></Button>

          {/* footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Dont have a account?</Text>
            <Pressable onPress={() => router.push("signUp")}>
              <Text
                style={{
                  color: theme.colors.primaryDark,
                  fontWeight: theme.fonts.semibold,
                }}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(5),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  wellcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
});
