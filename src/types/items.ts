import type { Database } from "../../schema";

export type ItemsType = Database["public"]["Tables"]["items"]["Row"];
export type InsertItemsType = Database["public"]["Tables"]["items"]["Insert"];
export type ItemDetailType = {
  item_id: string;
  is_checked: boolean;
  items: {
    id: string;
    name: string;
  };
};
