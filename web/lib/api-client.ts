"use client";

import { useSessionStore } from "@/store/session-store";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
  agentId?: string;
  skipAuth?: boolean;
  disableRefresh?: boolean;
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

type RefreshData = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    type: "SUPERADMIN" | "OWNER" | "EMPLOYEE";
    agentRoles?: Record<string, "OWNER" | "EMPLOYEE">;
  };
};

let refreshPromise: Promise<boolean> | null = null;

const attemptTokenRefresh = async () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { tokens, setTokens, setSession, clearSession } = useSessionStore.getState();
      const refreshToken = tokens?.refreshToken;
      if (!refreshToken) {
        clearSession();
        return false;
      }

      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          clearSession();
          return false;
        }

        const json = (await response.json()) as ApiResponse<RefreshData>;
        const { accessToken, refreshToken: newRefreshToken, user } = json.data;
        setTokens({ accessToken, refreshToken: newRefreshToken });
        setSession({ user });
        return true;
      } catch {
        clearSession();
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
};

async function request<T>(
  path: string,
  options: RequestOptions & { unwrapResponse?: boolean } = {},
  retried = false,
): Promise<T> {
  const session = useSessionStore.getState();
  const headers = new Headers();

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const authToken =
    options.skipAuth === true ? undefined : (options.token ?? session.tokens?.accessToken);

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  if (options.agentId) {
    headers.set("X-Agent-Id", options.agentId);
  }

  const response = await fetch("/api" + path, {
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

  if (response.status === 401 && !options.disableRefresh && !retried) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      return request<T>(
        path,
        {
          ...options,
          token: undefined,
        },
        true,
      );
    }
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorBody = (await response.json()) as unknown;
      if (isMessagePayload(errorBody) && typeof errorBody.message === "string") {
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
  get: <T>(path: string, options?: Omit<RequestOptions & { unwrapResponse?: boolean }, "body">) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions & { unwrapResponse?: boolean }, "body" | "method">,
  ) => request<T>(path, { ...options, method: "POST", body }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions & { unwrapResponse?: boolean }, "body" | "method">,
  ) => request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions & { unwrapResponse?: boolean }, "body">,
  ) => request<T>(path, { ...options, method: "DELETE", body }),
};
