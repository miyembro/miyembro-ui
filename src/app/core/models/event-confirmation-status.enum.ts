export enum EventConfirmationStatus {
    YES = 'YES',
    NO = 'NO',
    MAYBE = 'MAYBE',
    UNCONFIRMED = 'UNCONFIRMED',
}

export const EventConfirmationColors: Record<EventConfirmationStatus, string> = {
    [EventConfirmationStatus.YES]: '--p-green-700', // Success (Green)
    [EventConfirmationStatus.NO]: '--p-red-700', // Danger (Red)
    [EventConfirmationStatus.MAYBE]: '--p-sky-700', // Info (Blue)
    [EventConfirmationStatus.UNCONFIRMED]: '--p-surface-600' // Secondary (Gray)
}