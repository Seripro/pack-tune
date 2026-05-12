import { Box, Container, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Flex direction="column" minH="100vh" bg="gray.50" colorPalette="blue">
      <Header />
      <Box flex="1" py={8}>
        <Container maxW="1000px">{children}</Container>
      </Box>
      <Footer />
    </Flex>
  );
};
