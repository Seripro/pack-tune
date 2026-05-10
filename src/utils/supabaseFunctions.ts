import type { InsertItemsType } from "../types/items";
import type { InsertTripItemsType } from "../types/trip_items";
import type { InsertTripsType } from "../types/trips";
import { supabase } from "./supabase";

export const getTripsByUserId = async (user_id: string) => {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const getItemsByUserId = async (user_id: string) => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", user_id);
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

export const insertTripItems = async (tripItems: InsertTripItemsType[]) => {
  const { error } = await supabase.from("trip_items").insert(tripItems);
  if (error) throw error;
};

export const getTripByTitleAndPeriod = async (
  title: string,
  start_date: string,
  end_date: string,
  user_id: string,
) => {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("title", title)
    .eq("start_date", start_date)
    .eq("end_date", end_date)
    .eq("user_id", user_id);
  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const getItemsByTripId = async (trip_id: string) => {
  const { data, error } = await supabase
    .from("trip_items")
    .select(
      `
    item_id,
    is_checked,
    items (
      id,
      name
    )
  `,
    )
    .eq("trip_id", trip_id);

  if (error) {
    throw error;
  } else {
    return data;
  }
};
