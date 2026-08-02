import { apiRequest, toQuery } from "./http";
import type {
  ApiBusiness,
  CreateBusinessInput,
  Paginated,
  UpdateBusinessInput,
} from "./types";

export interface BusinessQuery {
  search?: string;
  categorySlug?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export function listActive(
  query: BusinessQuery = {},
  signal?: AbortSignal,
): Promise<Paginated<ApiBusiness>> {
  const params: Record<string, string | number | undefined> = { ...query };
  return apiRequest<Paginated<ApiBusiness>>(`/businesses${toQuery(params)}`, {
    signal,
  });
}

export function getBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<ApiBusiness> {
  return apiRequest<ApiBusiness>(`/businesses/slug/${slug}`, { signal });
}

export function listMine(signal?: AbortSignal): Promise<ApiBusiness[]> {
  return apiRequest<ApiBusiness[]>("/businesses/me/list", {
    auth: true,
    signal,
  });
}

export function getOwned(
  id: string,
  signal?: AbortSignal,
): Promise<ApiBusiness> {
  return apiRequest<ApiBusiness>(`/businesses/me/${id}`, {
    auth: true,
    signal,
  });
}

export function listPending(signal?: AbortSignal): Promise<ApiBusiness[]> {
  return apiRequest<ApiBusiness[]>("/businesses/admin/pending", {
    auth: true,
    signal,
  });
}

export function listAllForAdmin(signal?: AbortSignal): Promise<ApiBusiness[]> {
  return apiRequest<ApiBusiness[]>("/businesses/admin/all", {
    auth: true,
    signal,
  });
}

export function create(input: CreateBusinessInput): Promise<ApiBusiness> {
  return apiRequest<ApiBusiness>("/businesses", {
    method: "POST",
    body: input,
    auth: true,
  });
}

export function update(
  id: string,
  input: UpdateBusinessInput,
): Promise<ApiBusiness> {
  return apiRequest<ApiBusiness>(`/businesses/${id}`, {
    method: "PATCH",
    body: input,
    auth: true,
  });
}

export function approve(id: string): Promise<ApiBusiness> {
  return apiRequest<ApiBusiness>(`/businesses/${id}/approve`, {
    method: "PATCH",
    auth: true,
  });
}

export function reject(id: string, reason: string): Promise<ApiBusiness> {
  return apiRequest<ApiBusiness>(`/businesses/${id}/reject`, {
    method: "PATCH",
    body: { reason },
    auth: true,
  });
}

export function suspend(id: string): Promise<ApiBusiness> {
  return apiRequest<ApiBusiness>(`/businesses/${id}/suspend`, {
    method: "PATCH",
    auth: true,
  });
}

export function remove(id: string): Promise<void> {
  return apiRequest<void>(`/businesses/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
