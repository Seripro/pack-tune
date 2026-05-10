import { supabase } from "./supabase";

export const getAllTrips = async () => {
  const { data, error } = await supabase.from("trips").select("*");
  if (error) {
    throw error;
  } else {
    return data;
  }
};
