import { Flex, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="60vh"
      textAlign="center"
    >
      <Heading size="4xl" color="blue.500" mb={4}>
        404
      </Heading>
      <Heading size="xl" mb={4}>
        ページが見つかりません
      </Heading>
      <Text color="gray.600" mb={8}>
        お探しのページは移動したか、URLが間違っている可能性があります。
      </Text>
      <Button colorPalette="blue" size="lg" onClick={() => navigate("/trips")}>
        旅行一覧に戻る
      </Button>
    </Flex>
  );
};
