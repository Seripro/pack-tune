import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { Link } from 'react-router-dom'
export const Signup = ()=>{

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(`エラー: ${error.message}`)
    } else {
      setMessage('確認メールを送信しました。メールボックスを確認してください。')
    }
  }

  return (
    <>
    <form onSubmit={handleSignUp}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">新規登録</button>
      <p>{message}</p>
    </form>
    <Link to="/login">サインイン</Link>
    </>
  )

}