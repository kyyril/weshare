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
