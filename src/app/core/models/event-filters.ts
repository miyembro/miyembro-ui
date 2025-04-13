export interface EventFilters {
    name:string | null;
    onlineStatuses: boolean [] | null;
    startDates: Date [] | null;
    endDates: Date [] | null;
    eventEventAddressCity: string | null;
    eventEventAddressCountry: string | null;
}