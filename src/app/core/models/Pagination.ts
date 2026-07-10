export interface PaginationRequest {
  page: number;
  pageSize: number;
}

export interface PaginationMeta extends PaginationRequest {
  totalItems: number;
}

export const DEFAULT_MAX_PAGE_SIZE = 5;

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export type PaginationResponse<T> = {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};