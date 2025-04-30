import { supabase } from "../lib/supabase";

export const createNotification = async (notification) => {
  try {
    const { data, error } = await supabase
      .from("notification")
      .insert(notification)
      .select()
      .single();
    if (error) {
      console.log("notification err:", error);
      return { success: false, msg: "unable to crete notification " };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("notification err:", error);
    return { success: false, msg: "unable to crete notification " };
  }
};

export const fetchNotifications = async (receiverId) => {
  try {
    const { data, error } = await supabase
      .from("notification")
      .select(
        `*,
          sender: senderId(id,name,image)`
      )
      .eq("receiverId", receiverId)
      .order("created_at", { ascending: false });
    if (error) {
      console.log("fetch notification err:", error);
      return { success: false, msg: "Could not fetching the notification" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("fetch notification err:", error);
    return { success: false, msg: "Could not fetching the notification" };
  }
};
