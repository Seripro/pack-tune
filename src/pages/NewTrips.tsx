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

import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  Stack,
  Spinner,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { FaTrash, FaPlus } from "react-icons/fa";

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
  const [titleError, setTitleError] = useState<string>("");
  const [startDateError, setStartDateError] = useState<string>("");
  const [endDateError, setEndDateError] = useState<string>("");

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

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setEndDate(date);
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
        await insertTrip(trip);
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
    setTitleError("");
    setStartDateError("");
    setEndDateError("");
    let is_ok = true;
    if (title.trim() === "") {
      setTitleError("タイトルを入力してください");
      is_ok = false;
    }

    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
      setStartDateError("終了日は開始日よりも後に設定してください");
      is_ok = false;
    } else {
      if (startDate === undefined || startDate === null) {
        setStartDateError("開始日を選択してください");
        is_ok = false;
      }
      if (endDate === undefined || endDate === null) {
        setEndDateError("終了日を選択してください");
        is_ok = false;
      }
    }

    if (is_ok) {
      await addItems();
      await addTrip();
      await addTripItems();
      navigate("/trips");
    }
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
      <Heading size="xl" mb={6}>
        新しい旅行を作成
      </Heading>

      <Box bg="white" shadow="md" borderRadius="xl" p={6} mb={6}>
        <Stack gap={4}>
          <Box>
            <Text fontWeight="bold" mb={2}>
              旅行タイトル
            </Text>
            <Input
              value={title}
              onChange={onChangeTitle}
              placeholder="旅行のタイトルを入力"
            />
            <p style={{ color: "red" }}>{titleError}</p>
          </Box>
          <Box>
            <Text fontWeight="bold" mb={2}>
              旅行期間
            </Text>
            <HStack justify="space-around">
              <VStack>
                <Box
                  borderWidth="1px"
                  borderRadius="md"
                  p={2}
                  bg="white"
                  w="fit-content"
                >
                  <DatePicker
                    locale="ja"
                    selected={startDate}
                    onChange={handleStartDateChange}
                    dateFormatCalendar="yyyy年 MM月"
                    dateFormat="yyyy/MM/dd"
                    placeholderText="開始日を選択"
                  />
                </Box>
                <p style={{ color: "red" }}>{startDateError}</p>
              </VStack>
              <VStack>
                <Box
                  borderWidth="1px"
                  borderRadius="md"
                  p={2}
                  w="fit-content"
                  bg="white"
                >
                  <DatePicker
                    locale="ja"
                    selected={endDate}
                    onChange={handleEndDateChange}
                    dateFormatCalendar="yyyy年 MM月"
                    dateFormat="yyyy/MM/dd"
                    placeholderText="終了日を選択"
                  />
                </Box>
                <p style={{ color: "red" }}>{endDateError}</p>
              </VStack>
            </HStack>
          </Box>
        </Stack>
      </Box>

      <HStack align="start" gap={6} flexDir={{ base: "column", md: "row" }}>
        <Box
          flex="1"
          bg="white"
          w="full"
          shadow="md"
          borderRadius="xl"
          p={6}
          data-testid="item-list"
        >
          <Heading size="md" mb={4}>
            持ち物リスト
          </Heading>
          <Stack gap={3}>
            {suggestedItems?.map((suggestedItem) => (
              <Flex
                key={suggestedItem.id}
                justify="space-between"
                align="center"
                borderWidth="1px"
                p={2}
                borderRadius="md"
              >
                <Text>{suggestedItem.name}</Text>
                <IconButton
                  aria-label="Delete"
                  size="sm"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => handleDelete(suggestedItem.id)}
                >
                  <FaTrash />
                </IconButton>
              </Flex>
            ))}
            {newItems.map((data, index) => (
              <Flex
                key={index}
                justify="space-between"
                align="center"
                borderWidth="1px"
                p={2}
                borderRadius="md"
                bg="blue.50"
                borderColor="blue.100"
              >
                <Text>{data}</Text>
                <IconButton
                  aria-label="Delete"
                  size="sm"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => handleDeleteNewItem(index)}
                >
                  <FaTrash />
                </IconButton>
              </Flex>
            ))}
          </Stack>

          <Flex gap={2} mt={4}>
            <Input
              value={newItem}
              onChange={onChangeNewItem}
              placeholder="新しいアイテムを追加"
            />
            <IconButton
              aria-label="Add"
              onClick={handleNewItem}
              colorPalette="blue"
            >
              <FaPlus />
            </IconButton>
          </Flex>
        </Box>

        <Box
          flex="1"
          bg="white"
          shadow="md"
          w="full"
          borderRadius="xl"
          p={6}
          data-testid="potential-list"
        >
          <Heading size="md" mb={4}>
            候補リスト
          </Heading>
          <Stack gap={3}>
            {potentialItems?.map((potentialItem) => (
              <Flex
                key={potentialItem.id}
                justify="space-between"
                align="center"
                borderWidth="1px"
                p={2}
                borderRadius="md"
              >
                <Text>{potentialItem.name}</Text>
                <Button
                  size="sm"
                  colorPalette="green"
                  onClick={() => handleAdd(potentialItem.id)}
                >
                  追加
                </Button>
              </Flex>
            ))}
            {potentialItems?.length === 0 && (
              <Text color="gray.500">候補がありません</Text>
            )}
          </Stack>
        </Box>
      </HStack>

      <Button
        mt={8}
        size="lg"
        colorPalette="blue"
        w="full"
        onClick={handleMake}
      >
        旅行を作成
      </Button>
    </Box>
  );
};
