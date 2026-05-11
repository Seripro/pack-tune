import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  deleteTripItem,
  getItemsByTripId,
  insertItems,
  updateItems,
} from "../utils/supabaseFunctions";
import type { ItemDetailType } from "../types/items";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";

export const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { title, is_completed } = location.state;

  const [items, setItems] = useState<ItemDetailType[]>();
  const [inputItem, setInputItem] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getItems = async () => {
      if (tripId) {
        const newItems = await getItemsByTripId(tripId);
        setItems(newItems);
      }
    };
    const fetchData = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getItems();
    fetchData();
  }, []);

  const handleCheck = async (
    item_id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updateCheck = async () => {
      try {
        await updateItems(e.target.checked, item_id, tripId!);
        const newItems = [...(items || [])].map((item) => {
          if (item.item_id == item_id) {
            return { ...item, is_checked: !item.is_checked };
          } else {
            return item;
          }
        });
        setItems(newItems);
      } catch (e) {
        console.log(e);
      }
    };
    await updateCheck();
  };

  const onClickDelete = async (item_id: string) => {
    const deleteItem = async () => {
      try {
        await deleteTripItem(item_id, tripId!);
        const newItems = [...(items || [])].filter(
          (item) => item.item_id !== item_id,
        );
        setItems(newItems);
      } catch (e) {
        console.log(e);
      }
    };
    await deleteItem();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputItem(e.target.value);
  };

  const onClickAdd = async () => {
    const addItems = async () => {
      try {
        if (user) {
          const data = await insertItems([
            { user_id: user.id, name: inputItem },
          ]);
          setItems([
            ...(items || []),
            {
              item_id: data[0].id,
              is_checked: false,
              items: {
                id: data[0].id,
                name: data[0].name,
              },
            },
          ]);
        }
      } catch (e) {
        console.log(e);
      }
    };
    await addItems();
    setInputItem("");
  };

  return (
    <>
      <p>{title}</p>
      <div>
        <input
          placeholder="持ち物を追加"
          value={inputItem}
          onChange={handleChange}
        />
        <button onClick={onClickAdd}>＋</button>
      </div>
      {items?.map((item) => {
        return (
          <div key={item.item_id}>
            <input
              type="checkbox"
              checked={item.is_checked}
              onChange={(e) => handleCheck(item.item_id, e)}
            />
            <p>{item.items.name}</p>
            <button onClick={() => onClickDelete(item.item_id)}>削除</button>
          </div>
        );
      })}
      {is_completed ? null : (
        <button onClick={() => navigate(`/trips/${tripId}/feedback`)}>
          旅行を終了する
        </button>
      )}
    </>
  );
};
