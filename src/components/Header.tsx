import { Box, Flex, Heading, Text, Button, Container } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SignOut } from "./SignOut";

export const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only attempt to get user if not on login or signup
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    // Set up auth state listener to update user state dynamically
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <Box bg="white" shadow="sm" position="sticky" top={0} zIndex={10} w="full">
      <Container maxW="1000px">
        <Flex justify="space-between" align="center" h="64px">
          <Link to="/trips" style={{ textDecoration: "none" }}>
            <Heading size="lg" color="blue.600" letterSpacing="tight">
              PackTune
            </Heading>
          </Link>

          {!isAuthPage && user && (
            <Flex align="center" gap={6}>
              <Text
                color="gray.600"
                fontSize="sm"
                display={{ base: "none", md: "block" }}
              >
                {user.email}
              </Text>
              <SignOut />
            </Flex>
          )}
          {!isAuthPage && !user && (
            <Button
              colorPalette="blue"
              size="sm"
              onClick={() => navigate("/login")}
            >
              ログイン
            </Button>
          )}
        </Flex>
      </Container>
    </Box>
  );
};
