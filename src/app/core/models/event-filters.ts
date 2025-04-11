export interface EventFilters {
    name:string | null;
    isOnline?: boolean | null;
    eventEventAddressCity: string | null;
    eventEventAddressCountry: string | null;
    startEventDate: Date [] | null;
    endEventDate: Date [] | null;
}