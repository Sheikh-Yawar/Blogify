import { createContext, useState } from "react";

export const AuthContext = createContext(false);

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
