import { createContext, useContext,  useState, useEffect } from "react";
import { checkAuthState } from "../lib/firebase";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext (GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user,setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    checkAuthState()
    .then((isAuthenticated) => {
      setIsLoggedIn(isAuthenticated);
    })
    .catch((error) => {
      console.error("Error checking auth state:", error);
      setIsLoggedIn(false); 
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [])

  return(
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider