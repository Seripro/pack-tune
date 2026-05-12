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
  const { data, error } = await supabase.from("items").insert(items).select();
  if (error) {
    throw error;
  } else {
    return data;
  }
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

export const getItemsForAllColumnByTripId = async (trip_id: string) => {
  const { data, error } = await supabase
    .from("trip_items")
    .select(
      `
    items (
      created_at,
      id,
      name,
      unused_count,
      useful_count,
      user_id
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

export const updateItems = async (
  is_checked: boolean,
  item_id: string,
  trip_id: string,
) => {
  const { error } = await supabase
    .from("trip_items")
    .update({ is_checked: is_checked })
    .eq("item_id", item_id)
    .eq("trip_id", trip_id);
  if (error) throw error;
};

export const deleteTripItem = async (item_id: string, trip_id: string) => {
  const { error } = await supabase
    .from("trip_items")
    .delete()
    .eq("item_id", item_id)
    .eq("trip_id", trip_id);
  if (error) throw error;
};

export const getUsefulCountByItemId = async (item_id: string) => {
  const { data, error } = await supabase
    .from("items")
    .select("useful_count")
    .eq("id", item_id)
    .single();
  if (error) {
    throw error;
  } else {
    return data.useful_count;
  }
};

export const updateUsefulCount = async (
  useful_count: number,
  item_id: string,
) => {
  await supabase
    .from("items")
    .update({ useful_count: useful_count + 1 })
    .eq("id", item_id);
};

export const incrementUseful = async (item_id: string) => {
  const useful_count = await getUsefulCountByItemId(item_id);

  if (useful_count !== undefined) {
    await updateUsefulCount(useful_count, item_id);
  }
};

export const getUnusedCountByItemId = async (item_id: string) => {
  const { data, error } = await supabase
    .from("items")
    .select("unused_count")
    .eq("id", item_id)
    .single();

  if (error) {
    throw error;
  } else {
    return data.unused_count;
  }
};

export const updateUnusedCount = async (
  unused_count: number,
  item_id: string,
) => {
  await supabase
    .from("items")
    .update({ unused_count: unused_count + 1 })
    .eq("id", item_id);
};

export const incrementUnused = async (item_id: string) => {
  const unused_count = await getUnusedCountByItemId(item_id);

  if (unused_count !== undefined) {
    await updateUnusedCount(unused_count, item_id);
  }
};

export const updateCompleted = async (trip_id: string) => {
  const { error } = await supabase
    .from("trips")
    .update({ is_completed: true })
    .eq("id", trip_id);
  if (error) throw error;
};

export const getTripByTripId = async (trip_id: string) => {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", trip_id)
    .single();
  if (error) {
    throw error;
  } else {
    return data;
  }
};
