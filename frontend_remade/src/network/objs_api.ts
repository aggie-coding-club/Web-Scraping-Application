import { useContext } from "react";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import UserContext from "../providers/UserProvider";
import { Obj } from "../models/object";
import { User } from "../models/user";
import { SignUpCredentials } from "../models/signUpCredentials";
import { LoginCredentials } from "../models/loginCredentials";
// import { ObjInput } from "../models/objInput";

const API_BASE = "/api";

async function handleResponse(response: any) {
  const contentType = response.headers.get("content-type");

  if (response.ok) {
    if (contentType && contentType.includes("application/json")) {
      // Process JSON response
      const json = await response.json();
      return json;
    } else if (contentType && contentType.includes("text/html")) {
      // Process HTML response
      return response.text();
    } else if (!contentType || response.status === 204) {
      // No content
      return null;
    } else {
      // Other content types
      return response.text();
    }
  } else {
    // Error handling
    let errorMessage;
    if (contentType && contentType.includes("application/json")) {
      const errorBody = await response.json();
      errorMessage = errorBody.error || "Unknown error";
    } else {
      errorMessage = `Request failed with status: ${response.status}`;
    }
    switch (response.status) {
      case 401:
        throw new UnauthorizedError(errorMessage);
      case 409:
        throw new ConflictError(errorMessage);
      default:
        throw new Error(errorMessage);
    }
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

export async function fetchObjs(): Promise<Obj[]> {
  return request("/scrape/getScrapingConfigs", { method: "GET" });
}

export async function createObj(obj: any): Promise<Obj> {
  return request("/scrape/createScrapingConfig", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
}

export async function updateObj(objId: string, obj: any): Promise<Obj> {
  return request(`/scrape/updateScrapingConfig/${objId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
}

export async function deleteObj(objId: string): Promise<void> {
  await request(`/scrape/deleteScrapingConfig/${objId}`, { method: "DELETE" });
}

export async function getObj(objId: string): Promise<any> {
  return request(`/objs/${objId}`, { method: "GET" });
}

export async function fetchHtmlContent(url: string): Promise<string> {
  return request("/scrape/fetchHtml", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}
