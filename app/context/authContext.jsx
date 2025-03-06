import { createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  setAuth = (authUser) => {
    setUser(authUser);
  };

  const setUserData = (userData) => {
    setUser({ ...userData });
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
