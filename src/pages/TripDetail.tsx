import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  deleteTripItem,
  getItemsByTripId,
  getTripByTripId,
  insertItems,
  updateItems,
} from "../utils/supabaseFunctions";
import type { ItemDetailType } from "../types/items";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";

import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  Stack,
  Spinner,
  Card,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { Checkbox } from "../components/ui/checkbox";
import { FaTrash, FaPlus } from "react-icons/fa";
import { NotFound } from "./NotFound";

export const TripDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { title, is_completed } = location.state || {
    title: "",
    is_completed: false,
  };

  const [items, setItems] = useState<ItemDetailType[]>();
  const [inputItem, setInputItem] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  console.log(tripId);
  useEffect(() => {
    if (!location.state) {
      navigate("/404");
    }
    const getTrip = async () => {
      try {
        console.log(tripId);
        if (tripId) {
          const data = await getTripByTripId(tripId);
          console.log(data);
          if (!data) {
            return <NotFound />;
          }
        } else {
          console.log("tripidがありません");
        }
      } catch (e) {
        console.log(e);
      }
    };
    const getItems = async () => {
      if (tripId) {
        const newItems = await getItemsByTripId(tripId);
        setItems(newItems);
      }
    };
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    const fetchData = async () => {
      setLoading(true);
      await getTrip();
      await getItems();
      await fetchUser();
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCheck = async (item_id: string, checked: boolean) => {
    const updateCheck = async () => {
      try {
        await updateItems(checked, item_id, tripId!);
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

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl">{title}</Heading>
        {is_completed && (
          <Text color="green.600" fontWeight="bold">
            完了済み
          </Text>
        )}
      </Flex>

      <Card.Root mb={6}>
        <Card.Body>
          <HStack mb={6}>
            <Input
              placeholder="持ち物を追加"
              value={inputItem}
              onChange={handleChange}
              size="lg"
            />
            <IconButton
              aria-label="Add Item"
              colorPalette="blue"
              size="lg"
              onClick={onClickAdd}
            >
              <FaPlus />
            </IconButton>
          </HStack>

          <Stack gap={3}>
            {items?.map((item) => (
              <Flex
                key={item.item_id}
                justify="space-between"
                align="center"
                borderWidth="1px"
                p={4}
                borderRadius="md"
                bg={item.is_checked ? "gray.50" : "white"}
              >
                <Checkbox
                  checked={item.is_checked}
                  onCheckedChange={(e) =>
                    handleCheck(item.item_id, !!e.checked)
                  }
                >
                  <Text
                    fontSize="lg"
                    textDecor={item.is_checked ? "line-through" : "none"}
                    color={item.is_checked ? "gray.500" : "black"}
                  >
                    {item.items.name}
                  </Text>
                </Checkbox>
                <IconButton
                  aria-label="Delete"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => onClickDelete(item.item_id)}
                >
                  <FaTrash />
                </IconButton>
              </Flex>
            ))}
            {items?.length === 0 && (
              <Text color="gray.500" textAlign="center" py={4}>
                アイテムがありません
              </Text>
            )}
          </Stack>
        </Card.Body>
      </Card.Root>

      {!is_completed && (
        <Button
          size="lg"
          colorPalette="blue"
          w="full"
          onClick={() => navigate(`/trips/${tripId}/feedback`)}
        >
          旅行を終了する
        </Button>
      )}
    </Box>
  );
};
