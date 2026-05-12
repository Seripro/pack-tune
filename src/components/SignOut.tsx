import { supabase } from "../utils/supabase";
import { Button } from "@chakra-ui/react";

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
  return <Button colorPalette="gray" variant="outline" size="sm" onClick={handleClick}>ログアウト</Button>;
};
