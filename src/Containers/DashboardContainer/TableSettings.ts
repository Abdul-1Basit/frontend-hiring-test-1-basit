
import type {  TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

export interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue|null>;
  }
  