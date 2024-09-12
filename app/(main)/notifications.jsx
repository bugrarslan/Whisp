import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../../services/notificationService";
import { useAuth } from "../../contexts/AuthContext";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import NotificationItem from "../../components/NotificationItem";
import Header from "../../components/Header";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    let res = await fetchNotifications(user.id);
    console.log("res: ", res);
    if (res.success) {
      setNotifications(res.data);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Notifications" />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications.map((item) => (
            <NotificationItem item={item} key={item?.id} router={router} />
          ))}

          {notifications.length === 0 && (
            <Text style={styles.noData}>No notifications yet</Text>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
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
