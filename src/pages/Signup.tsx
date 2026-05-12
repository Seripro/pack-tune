import { Box, Flex, Heading, Input, Button, Text, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
export const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`エラー: ${error.message}`);
    } else {
      setMessage(
        "確認メールを送信しました。メールボックスを確認してください。",
      );
    }
  };

  return (
    <Flex justify="center" align="center" minH="70vh">
      <Box w="full" maxW="md" bg="white" shadow="md" borderRadius="xl" p={8}>
        <Heading size="xl" mb={6} textAlign="center">新規登録</Heading>
        <form onSubmit={handleSignUp}>
          <Stack gap={4}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <Button type="submit" colorPalette="blue" w="full">新規登録</Button>
            {message && <Text color={message.includes("エラー") ? "red.500" : "green.500"} textAlign="center">{message}</Text>}
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          <Link to="/login" style={{ color: "#3182CE" }}>サインインはこちら</Link>
        </Text>
      </Box>
    </Flex>
  );
};
