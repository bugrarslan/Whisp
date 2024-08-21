import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { wp, hp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";

const Page = () => {
  const {user, setAuth } = useAuth();
  const router = useRouter();

  // const signOut = async () => {
  //   const { error } = await supabase.auth.signOut();

  //   if (error) {
  //     Alert.alert("Sign Out", "An error occurred while signing out");
  //     return;
  //   }
  // };

  // console.log("user: ", user);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title} onPress={()=>{}}>Whisp</Text>
          <View style={styles.icons}>
            <Pressable onPress={()=> router.push("./notifications")}>
              <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={()=> router.push("./newPost")}>
              <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={()=> router.push("./profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{borderWidth: 2}}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4)
  },
  title: {
    color: theme.colors.primary,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4)
  },
  noPosts: {
    fontSize: hp(2),
    color: theme.colors.text,
    textAlign: "center",
  }
});
