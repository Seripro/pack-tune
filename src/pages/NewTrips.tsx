import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getItemsByUserId,
  getTripByTitleAndPeriod,
  insertItems,
  insertTrip,
  insertTripItems,
} from "../utils/supabaseFunctions";
import type { ItemsType } from "../types/items";
import { ja } from "date-fns/locale/ja";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";

const SUGGEST_BORDER: number = 3;
registerLocale("ja", ja);

export const NewTrips = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [title, setTitle] = useState<string>("");
  const [items, setItems] = useState<ItemsType[]>();
  const [suggestedItems, setSuggestedItems] = useState<ItemsType[]>();
  const [potentialItems, setPotentialItems] = useState<ItemsType[]>();
  const [newItem, setNewItem] = useState<string>("");
  const [newItems, setNewItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        if (data.user) {
          const itemDatas = await getItemsByUserId(data.user?.id);
          const newSuggestedItems = [...(suggestedItems || [])];
          const newPotentialItems = [...(potentialItems || [])];
          itemDatas.map((item) => {
            if (item.useful_count - item.unused_count >= SUGGEST_BORDER) {
              newSuggestedItems.push(item);
            } else {
              newPotentialItems.push(item);
            }
          });
          setItems(itemDatas);
          setSuggestedItems(newSuggestedItems);
          setPotentialItems(newPotentialItems);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    if (dates[0]) {
      setStartDate(dates[0]);
      console.log(dates[0]);
    }
    if (dates[1]) {
      setEndDate(dates[1]);
      console.log(dates[1]);
    }
  };

  const handleDelete = (id: string) => {
    const newSuggestedItems = [...(suggestedItems || [])];
    setSuggestedItems(newSuggestedItems.filter((item) => item.id !== id));
    const newPotentialItems = [
      ...(potentialItems || []),
      ...(items?.filter((item) => item.id == id) || []),
    ];
    setPotentialItems(newPotentialItems);
  };

  const handleAdd = (id: string) => {
    const newPotentialItems = [...(potentialItems || [])];
    setPotentialItems(newPotentialItems.filter((item) => item.id !== id));
    const newSuggestedItems = [
      ...(suggestedItems || []),
      ...(items?.filter((item) => item.id == id) || []),
    ];
    setSuggestedItems(newSuggestedItems);
  };

  const onChangeNewItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem(e.target.value);
  };

  const handleNewItem = () => {
    const newNewItems = [...newItems, newItem];
    setNewItems(newNewItems);
    setNewItem("");
  };

  const handleDeleteNewItem = (index: number) => {
    const newNewItems = [...newItems];
    newNewItems.splice(index, 1);
    setNewItems(newNewItems);
  };

  const handleMake = async () => {
    const addTrip = async () => {
      try {
        const trip = {
          user_id: user?.id,
          title: title,
          start_date: `${startDate?.getFullYear()}-${(startDate?.getMonth() ?? 0) + 1}-${startDate?.getDate()}`,
          end_date: `${startDate?.getFullYear()}-${(endDate?.getMonth() ?? 0) + 1}-${endDate?.getDate()}`,
        };
        insertTrip(trip);
      } catch (e) {
        console.log(e);
      }
    };
    const addItems = async () => {
      try {
        if (user) {
          const data = newItems.map((item) => ({
            name: item,
            user_id: user.id,
          }));
          await insertItems(data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    const addTripItems = async () => {
      try {
        if (user) {
          const items = await getItemsByUserId(user.id);
          console.log(`items:${items}`);
          let itemdatas = items.filter((item) => newItems.includes(item.name));
          itemdatas = itemdatas.concat(suggestedItems || []);
          const start = `${startDate?.getFullYear()}-${(startDate?.getMonth() ?? 0) + 1}-${startDate?.getDate()}`;
          const end = `${startDate?.getFullYear()}-${(endDate?.getMonth() ?? 0) + 1}-${endDate?.getDate()}`;
          const trip = await getTripByTitleAndPeriod(
            title,
            start,
            end,
            user.id,
          );
          console.log(trip);
          console.log(itemdatas);
          const tripItems = itemdatas.map((item) => ({
            trip_id: trip[0].id,
            item_id: item.id,
          }));
          await insertTripItems(tripItems);
        }
      } catch (e) {
        console.log(e);
      }
    };
    await addItems();
    await addTrip();
    await addTripItems();
    navigate("/trips");
  };

  if (loading) return <p>loading...</p>;

  return (
    <div>
      <label id="title">旅行タイトル</label>
      <input id="title" value={title} onChange={onChangeTitle} />

      <label>旅行期間</label>
      <DatePicker
        locale="ja"
        selected={startDate}
        onChange={handleDateChange}
        dateFormatCalendar="yyyy年 MM月"
        dateFormat="yyyy/MM/dd"
        startDate={startDate}
        endDate={endDate}
        selectsRange
        isClearable
        placeholderText=""
      />

      <div>
        <p>持ち物リスト（スコア{SUGGEST_BORDER}以上）</p>
        {suggestedItems?.map((suggestedItem) => {
          return (
            <div key={suggestedItem.id}>
              <p>{suggestedItem.name}</p>
              <button onClick={() => handleDelete(suggestedItem.id)}>
                削除
              </button>
            </div>
          );
        })}
        {newItems.map((data, index) => {
          return (
            <div key={index}>
              <p>{data}</p>
              <button onClick={() => handleDeleteNewItem(index)}>削除</button>
            </div>
          );
        })}
      </div>
      <div>
        <p>候補（スコア{SUGGEST_BORDER}未満）</p>
        {potentialItems?.map((potentialItem) => {
          return (
            <div key={potentialItem.id}>
              <p>{potentialItem.name}</p>
              <button onClick={() => handleAdd(potentialItem.id)}>追加</button>
            </div>
          );
        })}
      </div>
      <div>
        <input value={newItem} onChange={onChangeNewItem} />
        <button onClick={handleNewItem}>＋</button>
      </div>
      <button onClick={handleMake}>旅行を作成</button>
    </div>
  );
};
