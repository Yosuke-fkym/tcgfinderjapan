import React, { SetStateAction } from "react";

type GetUserParams = {
    setUser?: React.Dispatch<SetStateAction<any>>,
    setIsLoggedIn: React.Dispatch<SetStateAction<boolean | null>>
}

export const checkUser = async ({setIsLoggedIn, setUser}: GetUserParams) => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.user?.id) {
            if(setUser != undefined){
                setUser(data.user);
            }
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };