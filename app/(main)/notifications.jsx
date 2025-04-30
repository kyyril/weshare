import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../../services/notification";
import { useAuth } from "../../context/authContext";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import NotificationItem from "../../components/NotificationItem";

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
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title={"Notifications"} />
        <ScrollView
          contentContainerStyle={styles.listStyle}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((item) => {
            return (
              <NotificationItem item={item} key={item?.id} router={router} />
            );
          })}
          {notifications.length == 0 && (
            <Text style={styles.noData}>no notifications yet</Text>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    gap: 10,
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: "center",
  },
});
