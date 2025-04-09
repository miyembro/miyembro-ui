import { EventAddress } from "./event-address";

export interface EventRequest {
    eventId: string;
    organizationId: string;
    name: string;
    description: string;
    eventPicUrl: string;
    startEventDate: Date;
    endEventDate: Date;
    eventAddress: EventAddress
}

