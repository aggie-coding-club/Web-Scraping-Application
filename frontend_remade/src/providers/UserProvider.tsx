import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../models/user";
import * as api from "../network/apis";
import { supabase } from "../providers/supabaseClient";

type UserContextType = {
  loggedInUser: User | null;
  setLoggedInUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
  loggedInUser: null,
  setLoggedInUser: () => {},
});

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await api.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }

    fetchLoggedInUser();

    /*
    const fetchSession = async () => {
      const session = await supabase.auth.getSession();
      if (session) {
        fetchLoggedInUser(); // Call only if there's a session
      }

    };

    fetchSession();
    */
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  if (loggedInUser === null || setLoggedInUser === null) {
    throw new Error(
      "User is null. Use useContext(userContext) if user can be null."
    );
  }
  return { loggedInUser, setLoggedInUser };
};

export { UserContext };
