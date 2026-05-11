import { supabase } from "../utils/supabase";

export const SignOut = () => {
  const handleClick = () => {
    const logOut = async () => {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.log(e);
      }
    };
    logOut();
  };
  return <button onClick={handleClick}>ログアウト</button>;
};
