import { apiRequest } from "./http";
import type { ApiUser } from "./types";

export function list(signal?: AbortSignal): Promise<ApiUser[]> {
  return apiRequest<ApiUser[]>("/users", { auth: true, signal });
}

export function suspend(id: string): Promise<ApiUser> {
  return apiRequest<ApiUser>(`/users/${id}/suspend`, {
    method: "PATCH",
    auth: true,
  });
}

export function activate(id: string): Promise<ApiUser> {
  return apiRequest<ApiUser>(`/users/${id}/activate`, {
    method: "PATCH",
    auth: true,
  });
}

export function remove(id: string): Promise<void> {
  return apiRequest<void>(`/users/${id}`, { method: "DELETE", auth: true });
}
