import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { hp, wp } from "../../helpers/common";
import Icon from "../../assets/icons";
import { theme } from "../../constants/theme";
import { supabase } from "../../lib/supabase";
import Avatar from "../../components/Avatar";

const Page = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => console.log("cancelled"),
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: () => signOut(),
        style: "destructive",
      },
    ]);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Sign Out", "An error occurred while signing out");
      return;
    }
  };

  return (
    <ScreenWrapper backgroundColor={"white"}>
      <UserHeader user={user} router={router} logout={handleLogout} />
    </ScreenWrapper>
  );
};

const UserHeader = ({ user, router, logout }) => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: wp(4) }}
    >
      <View>
        <Header title={"Profile"} mb={30} />
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Icon name={"logout"} color={theme.colors.rose} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ gap: 15 }}>
          <View style={styles.avatarContainer}>
            <Avatar
              size={hp(12)}
              uri={user?.image}
              rounded={theme.radius.xxl * 1.4}
            />
            <Pressable
              style={styles.editIcon}
              onPress={() => router.push("./editProfile")}
            >
              <Icon name="edit" size={20} strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* username and address */}
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={styles.userName}>{user && user.name}</Text>
            <Text style={styles.infoText}>
              {/* {user && user.address} */}
              Istanbul
            </Text>
          </View>

          {/* email and bio */}
          <View style={{gap: 10}}>
            <View style={styles.info}>
              <Icon name="mail" size={20} color={theme.colors.textLight} />
              <Text style={styles.infoText}>{user && user.email}</Text>
            </View>

            {
              user && user.phoneNumber && (
                <View style={styles.info}>
                  <Icon name="call" size={20} color={theme.colors.textLight} />
                  <Text style={styles.infoText}>{user && user.phoneNumber}</Text>
                </View>
              )
            }

{
              user && user.bio && (
                <View style={styles.info}>
                  <Text style={styles.infoText}>{user && user.bio}</Text>
                </View>
              )
            }
          </View>
        </View>
      </View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: wp(4),
    marginBottom: 20,
  },
  headerShape: {
    width: wp(100),
    height: hp(20),
  },
  avatarContainer: {
    alignSelf: "center",
    width: hp(12),
    height: hp(12),
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    backgroundColor: "white",
    padding: 7,
    borderRadius: 50,
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  userName: {
    fontSize: hp(3),
    fontWeight: "500",
    color: theme.colors.textDark,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: hp(1.6),
    fontWeight: "500",
    color: theme.colors.textLight,
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "#fee2e2",
  },
});
