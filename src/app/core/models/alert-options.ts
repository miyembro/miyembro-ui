export interface AlertOptions {
    type?: 'error' | 'info' | 'success';
    summary?: string;
    detail?: string;
    key?: string;
    clear?: boolean;
    includeGlobalAlerts?: boolean;
  }
  