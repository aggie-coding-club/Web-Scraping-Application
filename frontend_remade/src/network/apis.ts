import { useContext } from "react";
import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { LoginCredentials } from "../models/loginCredentials";
import { ScrapeConfig, ScrapeConfigInput } from "../models/scrapeConfig";
import { SignUpCredentials } from "../models/signUpCredentials";
import { User } from "../models/user";
import { supabase } from "../providers/supabaseClient";
import { UserContext } from "../providers/UserProvider";

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
  /*
  const { data: sessionResponse } = await supabase.auth.getSession();
  const session = sessionResponse.session;

  if (!session) throw new UnauthorizedError("No active session");

  // Now access the access_token from the session object
  const accessToken = session.access_token;
  if (!accessToken) throw new UnauthorizedError("Access token not found");

  return request("/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Correctly access the access_token
    },
  });
  */
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

export async function getScrapingConfigs(): Promise<ScrapeConfig[]> {
  return request("/scrapeMetadata/getScrapeMetadata", { method: "GET" });
}

export async function createScrapeConfig(
  scrapeConfig: ScrapeConfigInput
): Promise<ScrapeConfig> {
  return request("/scrapeMetadata/createScrapeMetadata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scrapeConfig),
  });
}

export async function updateScrapeConfig(
  scrapeConfigId: string,
  scrapeConfig: ScrapeConfigInput
): Promise<ScrapeConfig> {
  return request(`/scrapeMetadata/updateScrapeMetadata/${scrapeConfigId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scrapeConfig),
  });
}

export async function deleteScrapeConfig(
  scrapeConfigId: string
): Promise<void> {
  await request(`/scrapeMetadata/deleteScrapeMetadata/${scrapeConfigId}`, {
    method: "DELETE",
  });
}

export async function deleteSelector(
  scrapeConfigId: string,
  selectorId: string
): Promise<void> {
  await request(
    `/scrapeMetadata/deleteSelector/${scrapeConfigId}/${selectorId}`,
    {
      method: "DELETE",
    }
  );
}

export async function getNote(scrapeConfigId: string): Promise<any> {
  return request(`/objs/${scrapeConfigId}`, { method: "GET" });
}

export async function fetchHtmlContent(url: string): Promise<string> {
  return request("/scrape/fetchHtml", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}
