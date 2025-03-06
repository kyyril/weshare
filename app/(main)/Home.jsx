import React from "react";
import { Alert, Button, StyleSheet, Text } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../context/authContext";
import { supabase } from "../../lib/supabase";

const Home = () => {
  const { setAuth } = useAuth();

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("SignOut", error.message);
    } else {
      setAuth(null);
    }
  };

  return (
    <ScreenWrapper>
      <Text>Home</Text>

      <Button title="SignOut" onPress={onLogout} />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
