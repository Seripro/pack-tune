import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  if (isAuthPage) return null;

  return (
    <Box
      as="footer"
      bg="white"
      shadow="sm"
      mt="auto"
      py={6}
      w="full"
      borderTopWidth="1px"
    >
      <Flex direction="column" align="center" justify="center" gap={4}>
        <Stack direction="row" gap={8}>
          <Link
            to="/trips"
            style={{
              textDecoration: "none",
              color: "#4A5568",
              fontWeight: "500",
            }}
          >
            旅行一覧
          </Link>
          <Link
            to="/items/stats"
            style={{
              textDecoration: "none",
              color: "#4A5568",
              fontWeight: "500",
            }}
          >
            スタッツ
          </Link>
        </Stack>
        <Text color="gray.500" fontSize="sm">
          © {new Date().getFullYear()} PackTune. All rights reserved.
        </Text>
      </Flex>
    </Box>
  );
};
