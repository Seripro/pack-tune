import { Box, Flex, Heading, Input, Button, Text, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();
  const loginUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return { data, error };
  };

  // react-hook-form の handleSubmit が、バリデーション成功時だけコールバックを実行する。
  // ログインが成功したら、"/"に遷移する。
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginResult = await loginUser(email, password);

    if (loginResult.error) {
      setMessage(`エラー: ${loginResult.error.message}`);
      console.log("error");
    } else {
      setMessage("ログイン成功");
      console.log("success");
      navigate("/trips");
    }
  };

  return (
    <Flex justify="center" align="center" minH="70vh">
      <Box w="full" maxW="md" bg="white" shadow="md" borderRadius="xl" p={8}>
        <Heading size="xl" mb={6} textAlign="center">ログイン</Heading>
        <form onSubmit={handleSubmit}>
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
            <Button type="submit" colorPalette="blue" w="full">ログイン</Button>
            {message && <Text color={message.includes("エラー") ? "red.500" : "green.500"} textAlign="center">{message}</Text>}
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          <Link to="/signup" style={{ color: "#3182CE" }}>新規登録はこちら</Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;
