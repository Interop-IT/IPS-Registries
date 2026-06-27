import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Throws an Error carrying the status code and response body when the given
 * response is not ok; otherwise returns normally.
 *
 * @param res - The fetch Response to check.
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Performs a JSON fetch request with credentials and throws on non-ok responses.
 * Used by React Query mutations for POST/PATCH/DELETE calls.
 *
 * @param method - HTTP method.
 * @param url - Request URL.
 * @param data - Optional JSON-serializable request body.
 * @returns The successful Response.
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
/**
 * Builds the default React Query fetcher. It derives the request URL by joining
 * the query key with "/", sends credentials, and either returns `null` or throws
 * on a 401 depending on the configured behavior.
 *
 * @param options.on401 - How to handle a 401 response ("returnNull" or "throw").
 * @returns A typed QueryFunction for use by React Query.
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
