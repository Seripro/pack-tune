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
import { supabase } from "../utils/supabase";

import { Box, Flex, Heading, Text, Stack, Spinner, Card } from "@chakra-ui/react";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";


export const FeedBack = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemsType[]>();
  const [unusedIds, setUnusedIds] = useState<string[]>([]);
  const [usefulIds, setUsefulIds] = useState<string[]>([]);
  const [potentialItems, setPotentialItems] = useState<ItemsType[]>();
  const [loading, setLoading] = useState<boolean>(false);
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        
        if (data.user) {
          const tripItems = await getItemsForAllColumnByTripId(tripId!);
          const itemsData = tripItems.map((item) => item.items);
          setItems(itemsData);

          const allItems = await getItemsByUserId(data.user.id);
          const filtered = allItems.filter(
            (item) => !itemsData.some((a) => a.id === item.id),
          );
          setPotentialItems(filtered);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box>
      <Heading size="xl" mb={6}>ふりかえり</Heading>
      
      

      <Stack gap={6}>
        <Card.Root>
          <Card.Header>
            <Heading size="md">使わなかったアイテム</Heading>
            <Text color="gray.500" fontSize="sm">
              旅行に持っていったが、実際には使わなかったアイテムにチェックを入れてください。
            </Text>
          </Card.Header>
          <Card.Body>
            <Stack gap={3}>
              {items?.map((item) => (
                <Checkbox
                  key={item.id}
                  checked={unusedIds.includes(item.id)}
                  onCheckedChange={() => handleToggleUnused(item.id)}
                >
                  <Text fontSize="lg">{item.name}</Text>
                </Checkbox>
              ))}
              {items?.length === 0 && <Text color="gray.500">アイテムがありません</Text>}
            </Stack>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Heading size="md">追加すればよかったアイテム</Heading>
            <Text color="gray.500" fontSize="sm">
              持っていけばよかった・足りなかったアイテムがあれば選択してください。
            </Text>
          </Card.Header>
          <Card.Body>
            <Stack gap={3}>
              {potentialItems?.map((item) => (
                <Checkbox
                  key={item.id}
                  checked={usefulIds.includes(item.id)}
                  onCheckedChange={() => handleToggleUseful(item.id)}
                >
                  <Text fontSize="lg">{item.name}</Text>
                </Checkbox>
              ))}
              {potentialItems?.length === 0 && <Text color="gray.500">候補がありません</Text>}
            </Stack>
          </Card.Body>
        </Card.Root>
        
        <Box pt={4}>
          <Button size="lg" colorPalette="blue" w="full" onClick={handleComplete}>
            ふりかえりを終了する
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
