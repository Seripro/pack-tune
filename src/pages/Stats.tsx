import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { getItemsByUserId } from "../utils/supabaseFunctions";
import type { ItemsType } from "../types/items";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";

const SUGGEST_BORDER: number = 3;

export const Stats = () => {
  const [frequentItems, setFrequentItems] = useState<ItemsType[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        if (data.user) {
          const itemData = await getItemsByUserId(data.user.id);
          setFrequentItems(
            itemData.filter(
              (item) => item.useful_count - item.unused_count >= SUGGEST_BORDER,
            ),
          );
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>loading...</p>;

  return (
    <div>
      <p>ログイン中のユーザー：{user?.email}</p>
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
