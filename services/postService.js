import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post) => {
  try {
    //upload Image
    if (post.file && typeof post.file === "object") {
      let isImage = post.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResult = await uploadFile(folderName, post.file.uri, isImage);
      if (fileResult.success) post.file = fileResult.data;
      else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.log("create post error: ", error);
      return { success: false, msg: "Could not create your post" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("create post error: ", error);
    return { success: false, msg: "Could not create your post" };
  }
};

export const fetchPosts = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user: users (id, name, image), postLikes: postLikes(*)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("fetch post error: ", error);
      return { success: false, msg: "Could not fetch posts" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("fetch post error: ", error);
    return { success: false, msg: "Could not fetch posts" };
  }
};

export const createPostLike = async (postData) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.log("post like error: ", error);
      return { success: false, msg: "Could not like the post" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("fetch post error: ", error);
    return { success: false, msg: "Could not like the post" };
  }
};

export const removePostLike = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("postId", postId)
      .eq("userId", userId);

    if (error) {
      console.log("post like error: ", error);
      return { success: false, msg: "Could not remove the post like" };
    }

    return { success: true };
  } catch (error) {
    console.log("fetch post error: ", error);
    return { success: false, msg: "Could not remove the post like" };
  }
};
