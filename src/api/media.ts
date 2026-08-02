import { apiRequest } from "./http";
import type { MediaType } from "../types";
import type { ApiMediaAsset } from "./types";

export function upload(
  businessId: string,
  file: File,
  type: MediaType,
): Promise<ApiMediaAsset> {
  const form = new FormData();
  form.append("file", file);
  form.append("type", type);
  return apiRequest<ApiMediaAsset>(`/businesses/${businessId}/media`, {
    method: "POST",
    body: form,
    auth: true,
  });
}
