"use client";

import { signOut } from "next-auth/react";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

// API Response wrapper type from backend (TransformInterceptor)
export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Type guard to check if response is wrapped
const isWrappedResponse = <T>(value: unknown): value is ApiResponse<T> =>
  typeof value === "object" &&
  value !== null &&
  "statusCode" in value &&
  "message" in value &&
  "data" in value;

const isMessagePayload = (value: unknown): value is { message?: string } =>
  typeof value === "object" && value !== null && "message" in value;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const attemptTokenRefresh = async (): Promise<string | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) return null;

  const json = (await res.json()) as ApiResponse<{
    accessToken: string;
  }>;

  return json.data.accessToken;
};

async function request<T>(
  path: string,
  options: RequestOptions & { unwrapResponse?: boolean } = {},
  _retried = false
): Promise<T> {
  const headers = new Headers();

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api` + path, {
    method: options.method ?? (options.body ? "POST" : "GET"),
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
        ? JSON.stringify(options.body)
        : undefined,
    credentials: "include",
  });

  if (response.status === 401) {
    if (_retried) {
      await signOut({ callbackUrl: "/login" });
      window.location.href = "/login";
      throw new ApiError(401, "Unauthorized");
    }

    const newToken = await attemptTokenRefresh();

    if (!newToken) {
      await signOut({ callbackUrl: "/login" });
      window.location.href = "/login";
      throw new ApiError(401, "Unauthorized");
    }

    return request<T>(path, { ...options, token: newToken }, true);
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorBody = (await response.json()) as unknown;
      if (
        isMessagePayload(errorBody) &&
        typeof errorBody.message === "string"
      ) {
        message = errorBody.message;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  try {
    const json = (await response.json()) as unknown;

    if (options.unwrapResponse !== false && isWrappedResponse<T>(json)) {
      return json.data;
    }

    return json as T;
  } catch {
    return {} as T;
  }
}

export const apiClient = {
  get: <T>(
    path: string,
    options?: Omit<RequestOptions & { unwrapResponse?: boolean }, "body">
  ) => request<T>(path, { ...options, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<
      RequestOptions & { unwrapResponse?: boolean },
      "body" | "method"
    >
  ) => request<T>(path, { ...options, method: "POST", body }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<
      RequestOptions & { unwrapResponse?: boolean },
      "body" | "method"
    >
  ) => request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions & { unwrapResponse?: boolean }, "body">
  ) => request<T>(path, { ...options, method: "DELETE", body }),
};
