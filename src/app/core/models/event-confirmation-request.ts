import { EventConfirmationStatus } from "./event-confirmation-status.enum";
import { EventResponse } from "./event-response";

export interface EventConfirmationRequest {
    eventConfirmationId: string | undefined | null;
    eventId: string | undefined;
    memberId: string | undefined;
    eventConfirmationStatus: EventConfirmationStatus | undefined
}