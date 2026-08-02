import { apiRequest } from "./http";
import type { ApiLocation } from "./types";

export interface UpdateLocationInput {
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  isPrimary?: boolean;
}

export function update(
  id: string,
  input: UpdateLocationInput,
): Promise<ApiLocation> {
  return apiRequest<ApiLocation>(`/locations/${id}`, {
    method: "PATCH",
    body: input,
    auth: true,
  });
}
