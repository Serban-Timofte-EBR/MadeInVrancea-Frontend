import { apiRequest } from "./http";
import type { ApiCategory } from "./types";

export interface CategoryInput {
  name: string;
  slug: string;
  parentId?: string | null;
  iconURL?: string | null;
}

export function list(signal?: AbortSignal): Promise<ApiCategory[]> {
  return apiRequest<ApiCategory[]>("/categories", { signal });
}

export function create(input: CategoryInput): Promise<ApiCategory> {
  return apiRequest<ApiCategory>("/categories", {
    method: "POST",
    body: input,
    auth: true,
  });
}

export function update(
  id: string,
  input: Partial<CategoryInput>,
): Promise<ApiCategory> {
  return apiRequest<ApiCategory>(`/categories/${id}`, {
    method: "PATCH",
    body: input,
    auth: true,
  });
}

export function remove(id: string): Promise<void> {
  return apiRequest<void>(`/categories/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
