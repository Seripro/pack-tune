import type { InsertItemsType } from "../types/items";
import type { InsertTripsType } from "../types/trips";
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

export const insertTrip = async (trip: InsertTripsType) => {
  const { error } = await supabase.from("trips").insert(trip);
  if (error) throw error;
};

export const insertItems = async (items: InsertItemsType[]) => {
  const { error } = await supabase.from("items").insert(items);
  if (error) throw error;
};
