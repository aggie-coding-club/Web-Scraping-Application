import { createContext, useState, useEffect, ReactNode } from "react";
import * as ObjsApi from "../network/objs_api";
import { User } from "../models/user";

type UserContextType = {
    loggedInUser: User | null;
    setLoggedInUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
    children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                const user = await ObjsApi.getLoggedInUser();
                setLoggedInUser(user);
            } catch (error) {
                console.error(error);
            }
        }
        fetchLoggedInUser();
    }, []);

    return <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>{children}</UserContext.Provider>;
};

export default UserContext;
