import { EventConfirmationStatus } from "./event-confirmation-status.enum";

export interface EventConfirmationFilters {
    eventId: string | undefined;
    eventConfirmationStatuses: (EventConfirmationStatus | undefined) [];
    createdAt: Date | undefined;
    updatedAt: Date| undefined;
}