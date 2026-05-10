import type { Database } from "../../schema";

export type ItemsType = Database["public"]["Tables"]["items"]["Row"];
export type InsertItemsType = Database["public"]["Tables"]["items"]["Insert"];
