import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../context/authContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userServices";

const _layout = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

const MainLayout = () => {
  const { setAuth, setUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session?.user) {
        setAuth(session?.user);
        updateUserData(session?.user);
        router.replace("home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (user) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData(res.data);
    }
  };

  return <Stack screenOptions={{ headerShow: false }} />;
};

export default _layout;
