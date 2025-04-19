import { EventConfirmationStatus } from "./event-confirmation-status.enum";

export interface EventConfirmationFilters {
    eventId: string | undefined;
    eventConfirmationStatuses: (EventConfirmationStatus | undefined) [];
    updatedDates: (Date| undefined) [];
    eventConfirmationIds?: (string| undefined) [];
    memberIds?: (string| undefined) [];
}