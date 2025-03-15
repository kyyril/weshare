import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../context/authContext";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userServices";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Warning: TNodeChildrenRenderer",
  "Warning: MemoizedTNodeRenderer",
  "Warning: TRenderEngineProvider",
]);
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
        updateUserData(session?.user, session.user.email);
        router.replace("Home");
      } else {
        setAuth(null);
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (user, email) => {
    let res = await getUserData(user?.id);
    if (res.success) {
      setUserData({ ...res.data, email });
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(main)/postDetail"
        options={{
          presentation: "modal",
          headerShown: false,
          animation: "slide_from_bottom",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
        }}
      />
    </Stack>
  );
};

export default _layout;
