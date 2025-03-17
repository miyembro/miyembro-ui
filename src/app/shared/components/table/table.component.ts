import { AfterContentInit, Component, ContentChild, ContentChildren, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, TemplateRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Table } from '../../../core/models/table';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { Table as PrimeTable} from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-table',
  imports: [
    ButtonModule, 
    CommonModule, 
    DatePickerModule, 
    FormsModule, 
    IconFieldModule, 
    InputIconModule, 
    InputTextModule, 
    MultiSelectModule, 
    ReactiveFormsModule, 
    SelectModule,
    SplitButtonModule, 
    TableModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements AfterContentInit, OnChanges{

  @ContentChildren(TemplateRef) tempList!: QueryList<TemplateRef<any>>;
  @ContentChild('customFilterButton') customFilterButton!: TemplateRef<any>;

  @Input() dataKey = "id";
  @Input() enableMultiSelectButton = false;
  @Input() first = 0; 
  @Input() loading = false;
  @Input() multiSelectButtonItems: MenuItem[] = [];
  @Input() multiSelectButtonLabel: string | undefined;
  @Input() paginator = false;
  @Input() rowsPerPage = 10;  
  @Input() selectedItems: any [] = [];
  @Input() sortField : string | undefined;
  @Input() sortOrder = 1;  
  @Input() table: Table<any> = { rows: [], columns: [] };
  @Input() tableFooterCountTitle: string | null = null;
  @Input() tableTitle: string | null = null;
  @Input() totalRecords = 0;  

  @Output() clearFilterChangeTable = new EventEmitter<void>();
  @Output() filterChangeTable = new EventEmitter<any>(); 
  @Output() firstChange = new EventEmitter<number>();
  @Output() pageChangeTable = new EventEmitter<any>(); 
  @Output() rowsPerPageChange = new EventEmitter<number>(); 
  @Output() selectedItemsChange = new EventEmitter<any[]>();   
  @Output() sortChangeTable = new EventEmitter<any>(); 
  @Output() sortFieldChange = new EventEmitter<string>();
  @Output() sortOrderChange = new EventEmitter<number>();
  @Output() totalRecordsChange = new EventEmitter<number>();  

  selectedValuesComboInputValueMap: { [key: string]: string } = {};
  selectedValuesComboSelectValueMap: { [key: string]: any[] } = {};
  selectedValuesDateMap: { [key: string]: Date | Date[] | null } = {}; 
  selectedValuesMultiSelectMap: { [key: string]: any[] } = {}; 
  templateList!: TemplateRef<any>[];
 
  ngAfterContentInit(): void {
    this.templateList = this.tempList.toArray();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table'] && changes['table'].currentValue) {
      this.initializeSelectedValuesMultiSelectMap(); 
      this.initializeSelectedValuesComboSelectValueMap(); 
    }
  }

  applyDateColumnFilter(col: any, filterCallback: any) {
    const key = col.dataField ?? 'default'; 
    const selectedDate = this.selectedValuesDateMap[key];
  
    if (typeof filterCallback === 'function') {
      filterCallback(selectedDate); 
    }
  }

  clear(table: PrimeTable) {
    table.clear();
    Object.keys(this.selectedValuesMultiSelectMap).forEach((key) => {
      this.selectedValuesMultiSelectMap[key] = [];
    });
    Object.keys(this.selectedValuesComboSelectValueMap).forEach((key) => {
      this.selectedValuesComboSelectValueMap[key] = [];
    });
    Object.keys(this.selectedValuesComboInputValueMap).forEach((key) => {
      this.selectedValuesComboInputValueMap[key] = '';
    });
    Object.keys(this.selectedValuesDateMap).forEach((key) => {
      this.selectedValuesDateMap[key] = null; 
    });
    this.clearFilterChangeTable.emit();
  }

  clearDateColumnFilter(col: any, filterCallback: any) {
    const key = col.dataField ?? 'default'; 
    this.selectedValuesDateMap[key] = null;
  
    if (typeof filterCallback === 'function') {
      filterCallback(null); 
    }
  }

  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  getTemplate(colTemplateRefName: string ): TemplateRef<any> {
    return this.templateList.find(
      (t) => (t as any)._declarationTContainer.localNames[0] === colTemplateRefName
    )!;
  }

  onApplyComboColumnFilter(value: any, filterCallback: (value: any) => void, dataField: string | undefined) {
  
    let selectedDataFieldValue;

    if(dataField) {
      selectedDataFieldValue = this.selectedValuesComboSelectValueMap[dataField];
    }
  
    const filterValue = {
      dataField: selectedDataFieldValue,
      value: value,
    };
  
    if (typeof filterCallback === 'function') {
      filterCallback(filterValue); 
    } else {
      console.error('filterCallback is not a function');
    }
  }

  onClearComboColumnFilter(col: any, filterCallback: (value: any) => void) {
    const key = col.dataField ?? 'default'; 
  
    this.selectedValuesComboSelectValueMap[key] = [];
    this.selectedValuesComboInputValueMap[key] = '';
    this.initializeSelectedValuesComboSelectValueMap();

    if (typeof filterCallback === 'function') {
      filterCallback(null); 
    }
  }

  onFilter(event: any) {
    this.filterChangeTable.emit(event);
  }

  onMultiSelectChange(value: any[], dataField: string | undefined, filterCallback: (value: any) => void) {
    const key = dataField ?? 'default'; 
    this.selectedValuesMultiSelectMap[key] = value;
  
    if (typeof filterCallback === 'function') {
      filterCallback(value); // Apply the filter
    } else {
      console.error('filterCallback is not a function');
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  
    this.firstChange.emit(this.first);
    this.rowsPerPageChange.emit(this.rowsPerPage);
    this.totalRecordsChange.emit(this.totalRecords); 
    this.pageChangeTable.emit({
      "first": this.first,
      "totalRecords": this.totalRecords,
      "rowsPerPage": this.rowsPerPage,
      "sortField": this.sortField,
      "sortOrder": this.sortOrder
    });
  }

  onSelect(event: any) {
    this.selectedItemsChange.emit(this.selectedItems);
  }

  onSort(event: any) {
    this.sortField = event.field;
    this.sortOrder = event.order;

    this.sortFieldChange.emit(this.sortField);
    this.sortOrderChange.emit(this.sortOrder);
    this.sortChangeTable.emit({
      "first": this.first,
      "totalRecords": this.totalRecords,
      "rowsPerPage": this.rowsPerPage,
      "sortField": this.sortField,
      "sortOrder": this.sortOrder
    });
  }

  private initializeSelectedValuesComboSelectValueMap(): void {
    this.selectedValuesComboSelectValueMap = {}; 
    this.table.columns.forEach((col) => {
      if (col.headerFilterType === 'combo' && col.options && col.options.length > 0) {
        const key = col.dataField ?? 'default'; 
        this.selectedValuesComboSelectValueMap[key] = col.options[0].value; 
      }
    });
  }

  private initializeSelectedValuesMultiSelectMap(): void {
    if(!this.selectedValuesMultiSelectMap) {
      this.selectedValuesMultiSelectMap = {};
      this.table.columns.forEach((col) => {
        if (col.headerFilterType === 'select') {
          const key = col.dataField ?? 'default'; 
          this.selectedValuesMultiSelectMap[key] = []; 
        }
      });
    }
   
  }  

}
