import type { Database } from "../../schema";

export type InsertTripItemsType =
  Database["public"]["Tables"]["trip_items"]["Insert"];

export type TripItemsType = Database["public"]["Tables"]["trip_items"]["Row"];
