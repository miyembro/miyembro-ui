import { EventConfirmationStatus } from "./event-confirmation-status.enum";
import { EventResponse } from "./event-response";

export interface EventConfirmationResponse {
    eventConfirmationId: string | undefined;
    eventId: string | undefined;
    memberId: string | undefined;
    eventConfirmationStatus: EventConfirmationStatus | undefined;
    createdAt: Date | undefined;
    updatedAt: Date| undefined;
}