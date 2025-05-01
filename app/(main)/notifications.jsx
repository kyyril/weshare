import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../../services/notification";
import { useAuth } from "../../context/authContext";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import NotificationItem from "../../components/NotificationItem";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    let res = await fetchNotifications(user.id);
    if (res.success) setNotifications(res.data);
  };

  return (
    <ScreenWrapper bg={theme.colors.dark}>
      <LinearGradient
        colors={["rgba(127,90,240,0.15)", "rgba(242,95,76,0.15)"]}
        style={styles.gradientOverlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <BlurView intensity={20} style={styles.container} tint="dark">
          <Header title={"Notifications"} textStyle={styles.headerTitle} />
          <ScrollView
            contentContainerStyle={styles.listStyle}
            showsVerticalScrollIndicator={false}
          >
            {notifications.map((item) => (
              <NotificationItem item={item} key={item?.id} router={router} />
            ))}

            {notifications.length === 0 && (
              <BlurView
                intensity={30}
                tint="dark"
                style={styles.emptyContainer}
              >
                <Text style={styles.noData}>No notifications yet</Text>
              </BlurView>
            )}
          </ScrollView>
        </BlurView>
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    gap: 10,
    backgroundColor: theme.colors.bg,
  },
  headerTitle: {
    color: theme.colors.textDark,
    textShadowColor: "rgba(127, 90, 240, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  listStyle: {
    paddingVertical: 20,
    gap: 15,
  },
  emptyContainer: {
    marginTop: hp(5),
    padding: 20,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
    textAlign: "center",
  },
});
