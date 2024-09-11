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

export const fetchPosts = async (limit = 10, userId) => {
  try {
    if (userId) {
      const { data, error } = await supabase
      .from("posts")
      .select("*, user: users (id, name, image), postLikes: postLikes(*), comments (count)")
      .order("created_at", { ascending: false })
      .eq("userId", userId)
      .limit(limit);

      if (error) {
        console.log("fetch post error: ", error);
        return { success: false, msg: "Could not fetch posts" };
      }

      return { success: true, data };
    } else {
        const { data, error } = await supabase
        .from("posts")
        .select("*, user: users (id, name, image), postLikes: postLikes(*), comments (count)")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.log("fetch post error: ", error);
        return { success: false, msg: "Could not fetch posts" };
      }

      return { success: true, data };
    }
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

export const fetchPostDetails = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user: users (id, name, image), postLikes: postLikes(*), comments (*, user: users(id, name, image))")
      .eq("id", postId)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();

    if (error) {
      console.log("fetch postDetails error: ", error);
      return { success: false, msg: "Could not fetch post" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("fetch postDetails error: ", error);
    return { success: false, msg: "Could not fetch post" };
  }
};

export const createComment = async (comment) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.log("comment error: ", error);
      return { success: false, msg: "Could not create your comment" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("fetch post error: ", error);
    return { success: false, msg: "Could not create your comment" };
  }
};

export const removeComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.log("removeComment error: ", error);
      return { success: false, msg: "Could not remove the comment" };
    }

    return { success: true, data: {commentId} };
  } catch (error) {
    console.log("removeComment error: ", error);
    return { success: false, msg: "Could not remove the comment" };
  }
};

export const removePost = async (postId) => {
  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.log("removepost error: ", error);
      return { success: false, msg: "Could not remove the post" };
    }

    return { success: true, data: {postId} };
  } catch (error) {
    console.log("removepost error: ", error);
    return { success: false, msg: "Could not remove the post" };
  }
};