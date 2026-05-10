import type { Database } from "../../schema";

export type TripsType = Database["public"]["Tables"]["trips"]["Row"];
export type InsertTripsType = Database["public"]["Tables"]["trips"]["Insert"];
