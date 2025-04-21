import { EventConfirmationStatus } from "./event-confirmation-status.enum";
import { EventSummaryResponse } from "./event-summary-response";

export interface EventAttendanceSummary {
    label: string | undefined;
    eventConfirmationStatus: EventConfirmationStatus | undefined;
    attendanceNumber: number;
    eventSummaryResponse: EventSummaryResponse;
}