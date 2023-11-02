import { createContext, useContext, useState } from "react";

const AccountContext = createContext({});

export function useAccount() {
  return useContext(AccountContext);
}

export default function AccountProvider({ children }) {
  const [sessionToken, setSessionToken] = useState(null);
  const [userData, setUserData] = useState(null);

  return <AccountContext.Provider value={{
    sessionToken,
    userData,
    setSessionToken,
    setUserData
  }}>{children}</AccountContext.Provider>;
}