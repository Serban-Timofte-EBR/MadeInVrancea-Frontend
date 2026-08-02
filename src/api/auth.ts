import { apiRequest } from "./http";
import type { UserRole } from "../types";
import type { ApiAuthUser, AuthResponse } from "./types";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RawMe {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: { name: UserRole } | null;
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function register(input: RegisterInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export async function me(): Promise<ApiAuthUser> {
  const user = await apiRequest<RawMe>("/auth/me", { auth: true });
  return {
    userId: user.userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role?.name ?? "BusinessOwner",
  };
}
