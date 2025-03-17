import { supabase } from "../lib/supabase";
import { uploadFile } from "./userImage";

export const createOrUpdatePost = async (post) => {
  try {
    //upload post
    if (post.file && typeof post.file == "object") {
      let isImage = post.file.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResult = await uploadFile(folderName, post.file.uri, isImage);
      if (fileResult.success) post.file = fileResult.data;
      else {
        return fileResult;
      }
    }
    const { data, error } = await supabase.from("posts").upsert(post).single();
    if (error) {
      console.log("create post err:", error);
      return { success: false, msg: "Could not create post" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("create post err:", error);
    return { success: false, msg: "Could not create post" };
  }
};

export const fetchPosts = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*, user:users (id, name, image),
        postLike(*),
        comments(count)`
      )
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.log("fetch post err:", error);
      return { success: false, msg: "Could not fetching the post" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetch post err:", error);
    return { success: false, msg: "Could not fetching the post" };
  }
};

export const fetchPostDetail = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `*, user:users (id, name, image),
        postLike(*),
        comments (*, user: users(id,name,image))`
      )
      .eq("id", postId)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();
    if (error) {
      console.log("fetch post detail err:", error);
      return { success: false, msg: "Could not fetching the post" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetch post detail err:", error);
    return { success: false, msg: "Could not fetching the post" };
  }
};

export const createPostLike = async (postLike) => {
  try {
    const { data, error } = await supabase
      .from("postLike")
      .insert(postLike)
      .select()
      .single();
    if (error) {
      console.log("postLike err:", error);
      return { success: false, msg: "Could not like the post" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("postLike err:", error);
    return { success: false, msg: "Could not like the post" };
  }
};
export const removePostLike = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("postLike")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);
    if (error) {
      console.log("postLike err:", error);
      return { success: false, msg: "Could not remove the post like" };
    }
    return { success: true };
  } catch (error) {
    console.log("postLike err:", error);
    return { success: false, msg: "Could not remove the post like" };
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
      console.log("comment err:", error);
      return { success: false, msg: "unable to crete comment " };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("comment err:", error);
    return { success: false, msg: "unable to crete comment " };
  }
};

export const removeComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (error) {
      console.log("comment remove err:", error);
      return { success: false, msg: "Can't remove the comment" };
    }
    return { success: true, data: { commentId } };
  } catch (error) {
    console.log("comment remove err:", error);
    return { success: false, msg: "Can't remove the comment" };
  }
};

export const removePost = async (postId) => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      console.log("Post remove err:", error);
      return { success: false, msg: "Can't remove the Post" };
    }
    return { success: true, data: { postId } };
  } catch (error) {
    console.log("Post remove err:", error);
    return { success: false, msg: "Can't remove the Post" };
  }
};
