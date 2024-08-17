import { supabase } from "../lib/supabase";

export const userData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();
			
    if (error) {
      return { success: false, msg: error?.message };
    }
    return { success: true, data };
  } catch (error) {
    console.log("got error", error);
    return { success: false, msg: error?.message };
  }
};
