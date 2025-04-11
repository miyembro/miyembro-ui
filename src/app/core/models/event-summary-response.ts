import { EventAddress } from "./event-address";

export interface EventSummaryResponse {
    eventId: string;
    organizationId: string;
    name: string;
    eventPicUrl: string;
    startEventDate: Date;
    endEventDate: Date;
    eventAddress: EventAddress;
}