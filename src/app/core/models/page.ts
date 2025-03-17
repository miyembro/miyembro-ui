import { Pageable } from "./pageable";

export interface Page<T> {
    content: T[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: any[];
    first: boolean;
    numberOfElements: number;
    empty: boolean
}