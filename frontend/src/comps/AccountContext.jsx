import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AccountContext = createContext({});

export function useAccount() {
  return useContext(AccountContext);
}

export default function AccountProvider({ children }) {
  const [sessionToken, setSessionToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userData, setUserData] = useState(null);

  const refreshUserData = () => {
    if (!sessionToken || !userEmail) {
      setUserData(null);
      return;
    }

    axios({
      method: "get",
      url: "/api/userdata",
      headers: {
        "Limana-SessionId": sessionToken,
        "Limana-UserEmail": userEmail
      },
    }).then((response) => {
      setUserData(response.data.userdata);
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    if (localStorage.getItem("sessionToken")) {
      setSessionToken(localStorage.getItem("sessionToken"));
    }

    if (localStorage.getItem("userEmail")) {
      setUserEmail(localStorage.getItem("userEmail"));
    }
  }, []);

  useEffect(() => {
    if (sessionToken && userEmail) {
      localStorage.setItem("sessionToken", sessionToken);
      localStorage.setItem("userEmail", userEmail);

      refreshUserData();
    }
  }, [sessionToken, userEmail]);

  const logout = () => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("userEmail");

    setSessionToken(null);
    setUserEmail(null);
    setUserData(null);
  }

  return <AccountContext.Provider value={{
    sessionToken,
    userEmail,
    userData,
    refreshUserData,
    logout,
    setSessionToken,
    setUserEmail,
    setUserData
  }}>{children}</AccountContext.Provider>;
}