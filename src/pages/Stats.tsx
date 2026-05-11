import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { getItemsByUserId } from "../utils/supabaseFunctions";
import type { ItemsType } from "../types/items";

const SUGGEST_BORDER: number = 3;
const user_id = "f1bdb7e9-102b-403a-9e7e-62801081d3a6";

export const Stats = () => {
  const [frequentItems, setFrequentItems] = useState<ItemsType[]>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getItemsByUserId(user_id);
        setFrequentItems(
          data.filter(
            (item) => item.useful_count - item.unused_count >= SUGGEST_BORDER,
          ),
        );
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  });
  return (
    <div>
      <div>
        <p>よく使うアイテム</p>
        {frequentItems?.map((item) => {
          return <div key={item.id}>{item.name}</div>;
        })}
      </div>
      <Footer />
    </div>
  );
};
