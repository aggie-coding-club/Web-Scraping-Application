import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Obj } from "../models/object";
import { User } from "../models/user";
import { scrapeWebsite } from "./scrape_api";
import UserContext from "../providers/UserProvider";
import { useContext } from "react";

export async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }
}

export const getLoggedInUserContext = async (): Promise<User | null> => {
    return useContext(UserContext).loggedInUser;
};

export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("/api/users", { method: "GET" });
    return response.json();
}

export interface SignUpCredentials {
    username: string;
    email: string;
    password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("/api/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export async function logout() {
    await fetchData("/api/users/logout", { method: "POST" });
}

export async function fetchObjs(): Promise<Obj[]> {
    const response = await fetchData("/api/objs", { method: "GET" });
    return response.json();
}

export interface ObjInput {
    url: string;
    text?: string;
}

export async function createObj(obj: ObjInput): Promise<Obj> {
    const scrapedData = await scrapeWebsite(obj.url);
    obj.text = JSON.stringify(scrapedData);

    const response = await fetchData("/api/objs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });

    return response.json();
}

export async function updateObj(objId: string, obj: ObjInput) {
    const scrapedData = await scrapeWebsite(obj.url);
    obj.text = JSON.stringify(scrapedData);

    const response = await fetchData("/api/objs/" + objId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });
    return response.json();
}

export async function deleteObj(objId: string) {
    await fetchData("/api/objs/" + objId, { method: "DELETE" });
}
