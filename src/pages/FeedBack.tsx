import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ItemsType } from "../types/items";
import {
  getItemsByUserId,
  getItemsForAllColumnByTripId,
  incrementUnused,
  incrementUseful,
  updateCompleted,
} from "../utils/supabaseFunctions";

const user_id = "f1bdb7e9-102b-403a-9e7e-62801081d3a6";

export const FeedBack = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemsType[]>();
  const [unusedIds, setUnusedIds] = useState<string[]>([]);
  const [usefulIds, setUsefulIds] = useState<string[]>([]);
  const [potentialItems, setPotentialItems] = useState<ItemsType[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripItems = await getItemsForAllColumnByTripId(tripId!);
        const itemsData = tripItems.map((item) => item.items);
        setItems(itemsData);

        const allItems = await getItemsByUserId(user_id);
        const filtered = allItems.filter(
          (item) => !itemsData.some((a) => a.id === item.id),
        );
        setPotentialItems(filtered);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [tripId]);

  const handleToggleUnused = (id: string) => {
    setUnusedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleToggleUseful = (id: string) => {
    setUsefulIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleComplete = async () => {
    try {
      await Promise.all(unusedIds.map((id) => incrementUnused(id)));

      const usedIds =
        items?.map((item) => item.id).filter((id) => !unusedIds.includes(id)) ??
        [];

      const allUsefulIds = [...usedIds, ...usefulIds];
      const uniqueUsefulIds = [...new Set(allUsefulIds)];

      await Promise.all(uniqueUsefulIds.map((id) => incrementUseful(id)));
      await updateCompleted(tripId!);
      navigate("/trips");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {items?.map((item) => {
        return (
          <div key={item.id}>
            <input
              type="checkbox"
              checked={unusedIds.includes(item.id)}
              onChange={() => handleToggleUnused(item.id)}
            />
            <p>{item.name}</p>
          </div>
        );
      })}
      <button onClick={handleComplete}>ふりかえりを終了する</button>
      <div>
        <p>持っていけばよかったアイテムがあれば選択してください</p>
        {potentialItems?.map((item) => {
          return (
            <div key={item.id}>
              <input
                type="checkbox"
                checked={usefulIds.includes(item.id)}
                onChange={() => handleToggleUseful(item.id)}
              />
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
