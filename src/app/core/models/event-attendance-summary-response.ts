import { EventConfirmationStatus } from "./event-confirmation-status.enum";
import { EventSummaryResponse } from "./event-summary-response";

export interface EventAttendanceSummaryResponse {
    UUID: string;
    eventName: string;
    startEventDate: Date;
    yesCount: number;
    noCount: number;
    maybeCount: number;
    unconfirmedCount: number;
    eventSummaryResponse: EventSummaryResponse;
}