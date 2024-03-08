import type { UseQueryOptions as RQUseQueryOptions } from "@tanstack/react-query";
import { ApiError } from "./api";

export interface SearchPageParams { page: number; size: number };

export interface SearchResultType<Schema = unknown> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Array<Schema>;
}

export type UseQueryOptions<
  TQueryFnData = unknown,
  TError = ApiError,
  TData = TQueryFnData,
> = Omit<
  RQUseQueryOptions<TQueryFnData, TError, TData>,
  "queryKey" | "queryFn"
>;
