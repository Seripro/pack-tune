import { Box, Flex, Heading, Text, Spinner, Stack, Badge } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getItemsByUserId } from "../utils/supabaseFunctions";
import type { ItemsType } from "../types/items";
import { supabase } from "../utils/supabase";

const SUGGEST_BORDER: number = 3;

export const Stats = () => {
  const [frequentItems, setFrequentItems] = useState<ItemsType[]>();
  const [loading, setLoading] = useState<boolean>(false);
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        
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

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <Heading size="xl" mb={2}>統計</Heading>
      

      <Box bg="white" shadow="md" borderRadius="xl" p={6} mb={6}>
        <Heading size="md" mb={4}>よく使うアイテム</Heading>
        {frequentItems && frequentItems.length > 0 ? (
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {frequentItems.map((item) => (
              <Badge key={item.id} colorPalette="blue" size="lg" px={3} py={1} borderRadius="full">
                {item.name}
              </Badge>
            ))}
          </Stack>
        ) : (
          <Text color="gray.500">条件を満たすアイテムがありません</Text>
        )}
      </Box>

      
    </Box>
  );
};
