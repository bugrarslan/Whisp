import {
  Alert,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { wp, hp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { useRouter } from "expo-router";
import Avatar from "../../components/Avatar";
import { fetchPosts } from "../../services/postService";
import PostCard from "../../components/PostCard";
import Loading from "../../components/Loading";
import { getUserData } from "../../services/userService";

var limit = 0;
const Page = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const handlePostEvent = async (payload) => {
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost?.userId);
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res?.success ? res?.data : {};
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }

    if (payload.eventType === "DELETE" && payload?.old?.id) {
      setPosts((prevPosts) => {
        let updatedPosts = prevPosts.filter((post) => post.id !== payload.old.id);
        return updatedPosts;
      });
    }

    if (payload.eventType === "UPDATE" && payload?.new?.id) {
      setPosts(prevPosts => {
        let updatedPosts = prevPosts.map(post => {
          if (post.id === payload.new.id) {
            post.body = payload.new.body;
            post.file = payload.new.file;
          }
          return post;
        });
        return updatedPosts;
      })
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    // getPosts();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) {
      return null;
    }
    limit = limit + 10;
    let res = await fetchPosts(limit);
    if (res.success) {
      if (posts.length === res.data.length) setHasMore(false);
      setPosts(res.data);
    } else {
      Alert.alert("Home", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title} onPress={() => {}}>
            Whisp
          </Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("./notifications")}>
              <Icon
                name="heart"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("./newPost")}>
              <Icon
                name="plus"
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("./profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>

        {/* posts */}
        <FlatList
          data={posts}
          contentContainerStyle={styles.listStyle}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          ListFooterComponent={
            hasMore ? (
              <View style={{ marginVertical: posts.length == 0 ? 200 : 30 }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: 30 }}>
                <Text style={styles.noPosts}>No more posts</Text>
              </View>
            )
          }
          onEndReached={() => {
            // console.log("end reached");
            getPosts();
          }}
          onEndReachedThreshold={0}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.primary,
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    color: theme.colors.text,
    textAlign: "center",
  },
});
