import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper";

const Page = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <Text>index</Text>
      <Button title="Go to Welcome" onPress={() => router.push("welcome")} />
    </ScreenWrapper>
  );
};

export default Page;

const styles = StyleSheet.create({});
