import { EventAddress } from "./event-address";

export interface EventSummaryResponse {
    eventId: string;
    organizationId: string;
    name: string;
    eventPicUrl: string;
    isOnline: boolean;
    startEventDate: Date;
    endEventDate: Date;
    eventAddress: EventAddress;
}