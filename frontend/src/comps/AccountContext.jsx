import { createContext, useContext, useState } from "react";

const AccountContext = createContext({});

export function useAccount() {
  return useContext(AccountContext);
}

export default function AccountProvider({ children }) {
  const [sessionToken, setSessionToken] = useState(null);

  return <AccountContext.Provider value={{
    sessionToken,
    setSessionToken
  }}>{children}</AccountContext.Provider>;
}