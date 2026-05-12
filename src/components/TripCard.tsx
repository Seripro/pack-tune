import { Box, Heading, Text, Badge, Flex } from "@chakra-ui/react";

type Props = {
  title: string;
  start_date: string;
  end_date: string;
  is_completed: boolean;
};

export const TripCard = (props: Props) => {
  const { title, start_date, end_date, is_completed } = props;
  return (
    <Box
      bg="white"
      shadow="md"
      borderRadius="xl"
      p={6}
      mb={4}
      _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="md" color="gray.800">
          {title}
        </Heading>
        <Badge colorPalette={is_completed ? "green" : "blue"} variant="subtle">
          {is_completed ? "完了" : "未完了"}
        </Badge>
      </Flex>
      <Text color="gray.600" fontSize="sm">
        日程：{start_date} 〜 {end_date}
      </Text>
    </Box>
  );
};
