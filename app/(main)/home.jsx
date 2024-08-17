import { Alert, Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

const Page = () => {
  const { setAuth } = useAuth();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Sign Out", "An error occurred while signing out");
      return;
    }
  };

  return (
    <ScreenWrapper>
      <Button title="Sign Out" onPress={signOut} />
    </ScreenWrapper>
  );
};

export default Page;

const styles = StyleSheet.create({});
