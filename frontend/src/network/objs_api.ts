import { useContext } from "react";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import UserContext from "../providers/UserProvider";
import { scrapeWebsite } from "./scrape_api";
import { Obj } from "../models/object";
import { User } from "../models/user";
import { SignUpCredentials } from "../models/signUpCredentials";
import { LoginCredentials } from "../models/loginCredentials";
import { ObjInput } from "../models/objInput";

const API_BASE = "/api";

async function handleResponse(response: Response) {
    if (response.ok) {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }

    const errorBody = await response.json();
    const errorMessage = errorBody.error || "Unknown error";

    switch (response.status) {
        case 401:
            throw new UnauthorizedError(errorMessage);
        case 409:
            throw new ConflictError(errorMessage);
        default:
            throw new Error(`Request failed with status: ${response.status} message: ${errorMessage}`);
    }
}

export async function request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    return handleResponse(response);
}

export async function getLoggedInUserContext(): Promise<User | null> {
    return useContext(UserContext).loggedInUser;
}

export async function getLoggedInUser(): Promise<User> {
    return request("/users", { method: "GET" });
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    return request("/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
}

export async function login(credentials: LoginCredentials): Promise<User> {
    return request("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
}

export async function logout(): Promise<void> {
    await request("/users/logout", { method: "POST" });
}

// export async function fetchObjs(): Promise<Obj[]> {
//     return request("/objs", { method: "GET" });
// }

export async function fetchObjs(): Promise<Obj[]> {
    return request("/scrape/getScrapingConfigs", { method: "GET" });
}

export async function createObj(obj: ObjInput): Promise<Obj> {
    // const scrapedData = await scrapeWebsite(obj.url, obj.scrape_parameters);
    // obj.text = JSON.stringify(scrapedData, null, 4);

    console.log(obj);

    return request("/scrape/createScrapingConfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
    });
}

export async function updateObj(objId: string, obj: ObjInput): Promise<Obj> {
    const scrapedData = await scrapeWebsite(obj.url, obj.scrape_parameters);
    obj.text = JSON.stringify(scrapedData);

    return request(`/objs/${objId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
    });
}

export async function deleteObj(objId: string): Promise<void> {
    await request(`/objs/${objId}`, { method: "DELETE" });
}
