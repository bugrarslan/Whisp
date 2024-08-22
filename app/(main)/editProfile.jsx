import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import Header from "../../components/Header";
import { theme } from "../../constants/theme";
import { Image } from "expo-image";
import { useAuth } from "../../contexts/AuthContext";
import { getUserImageSrc, uploadFile } from "../../services/imageService";
import Icon from "../../assets/icons";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { updateUserData } from "../../services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const Page = () => {
  const { user: currentUser, setUserData } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    address: "",
    image: null,
    phoneNumber: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        address: currentUser.address || "",
        image: currentUser.image || null,
        phoneNumber: currentUser.phoneNumber || "",
        bio: currentUser.bio || "",
      });
    }
  }, []);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  const onsubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, address, bio, image } = userData;
    if (!name || !phoneNumber || !address || !bio || !image) {
      Alert.alert("Edit Profile", "Please fill all fields");
      return;
    }
    setLoading(true);

    if (typeof image === "object") {
      // TODO: upload image
      let imageRes = await uploadFile("profiles", image?.uri, true);
      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }
    const res = await updateUserData(currentUser?.id, userData);
    setLoading(false);
    // console.log('updated user response: ', res.success);
    if (res.success) {
      setUserData({ ...currentUser, ...userData });
    }
    router.back();
  };

  const imageSource = user.image && typeof user.image === "object" ? user.image.uri : getUserImageSrc(user.image);

  return (
    <ScreenWrapper backgroundColor={"white"}>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title={"Edit Profile"} />

          {/* form */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image style={styles.avatar} source={imageSource} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>

            <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
              Please fill your profile details
            </Text>
            <Input
              icon={<Icon name="user" />}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={(value) => setUser({ ...user, name: value })}
            />
            <Input
              icon={<Icon name="call" />}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
            />
            <Input
              icon={<Icon name="location" />}
              placeholder="Enter your address"
              value={user.address}
              onChangeText={(value) => setUser({ ...user, address: value })}
            />
            <Input
              placeholder="Enter your bio"
              value={user.bio}
              multiline
              containerStyle={styles.bio}
              onChangeText={(value) => setUser({ ...user, bio: value })}
            />

            <Button title="Update" loading={loading} onPress={onsubmit} />
          </View>
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
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 50,
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});
