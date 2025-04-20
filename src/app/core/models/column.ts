export interface Column {
    dataField?: string; // custom columns may not have dataField
    dataType: string;
    // all properties below do not exist in the backend Column model
    textAlign?: string; // row custom alignment
    headerText?: string; // custom table header text
    headerFilterType?: HeaderFilterType;
    colTemplateRefName?: string; // template reference name for custom rows
    colHeaderTemplateRefName?: string; // template reference name for custom columns
    durationFormat?: string; // selected format for duration field
    dateFormat?: string; // format for date field
    minDate?: Date | undefined;
    maxDate?: Date | undefined;
    buttonIcon?: string;
    buttonLabel?: string;
    options?: any [];
    sortable?: boolean;
    columnWidth?: string;
  }
  
  export type HeaderFilterType = 'text' | 'date' | 'boolean' | 'combo' | 'select' | 'customDate' ;
