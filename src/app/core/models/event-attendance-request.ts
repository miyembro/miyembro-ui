import { EventConfirmationStatus } from "./event-confirmation-status.enum";

export interface EventAttendanceRequest {
    eventId: string | undefined;
    memberId: string | undefined;
    eventConfirmationStatus: EventConfirmationStatus | undefined;
}