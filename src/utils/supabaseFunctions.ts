import { supabase } from "./supabase";

export const getTripsByUserId = async () => {
  const { data, error } = await supabase.from("trips").select("*");
  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const getItemsByUserId = async () => {
  const { data, error } = await supabase.from("items").select("*");
  if (error) {
    throw error;
  } else {
    return data;
  }
};
