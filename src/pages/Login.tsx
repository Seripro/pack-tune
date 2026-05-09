import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [message, setMessage] = useState<string>("")

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
  const handleSubmit = async(e: React.FormEvent)=>{
    e.preventDefault()
    const loginResult = await loginUser(email, password);

    if (loginResult.error) {
      setMessage(`エラー: ${loginResult.error.message}`)
      console.log("error")
    } else {
      setMessage("ログイン成功")
      console.log("success")
      navigate('/trips');
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">ログイン</button>
      <p>{message}</p>
    </form>
    <Link to="/signup">新規登録</Link>
    </>
  );
};

export default Login;
