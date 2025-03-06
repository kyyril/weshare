import { supabase } from "../lib/supabase";

// getUser
export const getUserData = async (userId) => {
  try {
    const { error, data } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();
    if (error) {
      return { success: false, msg: error.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("getUserData", error);
    return { success: false, msg: error.message };
  }
};
