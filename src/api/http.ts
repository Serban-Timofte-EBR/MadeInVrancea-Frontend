import { getToken, clearToken } from "../auth/token";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

/** Error thrown for any non-2xx API response (or a network failure). */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Attach the stored bearer token to the request. */
  auth?: boolean;
  signal?: AbortSignal;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = false, signal } = options;
  const headers: Record<string, string> = {};
  let payload: BodyInit | undefined;

  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: payload,
      signal,
    });
  } catch {
    throw new ApiError(
      "Nu s-a putut contacta serverul. Verifică dacă backend-ul rulează.",
      0,
    );
  }

  if (response.status === 401) {
    clearToken();
  }

  if (!response.ok) {
    let message = `Eroare ${response.status}`;
    try {
      const data: unknown = await response.json();
      const raw = (data as { message?: unknown })?.message;
      if (Array.isArray(raw)) {
        message = raw.join(", ");
      } else if (typeof raw === "string") {
        message = raw;
      }
    } catch {
      /* response had no JSON body */
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

/** Serialise a params object into a query string, skipping empty values. */
export function toQuery(
  params: Record<string, string | number | undefined>,
): string {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== "",
  );
  if (entries.length === 0) {
    return "";
  }
  const search = new URLSearchParams();
  for (const [key, value] of entries) {
    search.set(key, String(value));
  }
  return `?${search.toString()}`;
}
