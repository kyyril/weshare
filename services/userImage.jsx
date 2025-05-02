import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase, supabaseUrl } from "../lib/supabase";

export const getUserImage = (imagePath) => {
  if (imagePath) {
    return getSupabaseUrl(imagePath);
  }
  return "https://placehold.co/180";
};

export const getSupabaseUrl = (filePath) => {
  if (filePath) {
    return `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`;
  }
  return null;
};

export const downloadFile = async (url) => {
  try {
    const { uri } = await FileSystem.downloadAsync(url, getLocalFilePath(url));
    return uri;
  } catch (error) {
    return null;
  }
};

const getLocalFilePath = (filePath) => {
  let fileName = filePath.split("/").pop();
  return `${FileSystem.documentDirectory}${fileName}`;
};

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    //base64-arraybuffer
    let imageData = decode(fileBase64);
    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        contentType: isImage ? "image/*" : "video/*",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.log(error);
      return { success: false, msg: "could not upload image" };
    }
    console.log("data:", data);
    return { success: true, data: data.path };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "could not upload image" };
  }
};

const getFilePath = (folderName, isImage) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
