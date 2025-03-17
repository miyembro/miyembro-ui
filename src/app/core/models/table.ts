import { Column } from "./column";

export interface Table<T> {
    rows: T[];
    columns: Column[];
    sortField?: string;
    sortOrder?: number;
  }
  