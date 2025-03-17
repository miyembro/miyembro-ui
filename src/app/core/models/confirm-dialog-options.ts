export interface ConfirmDialogOptions {
    key?: string;
    type?: 'save' | 'info' | 'warning';
    message?: string;
    header?: string;
    icon?: string;
    closable?: boolean;
    acceptButtonLabel?: string;
    clear?: boolean;
    accept?: any;
    acceptButtonSeverity?: string;
    reject?: any;
    rejectButtonSeverity?: string;
    event?: Event
  }
  