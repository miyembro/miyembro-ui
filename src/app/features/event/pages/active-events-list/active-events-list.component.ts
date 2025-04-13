import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventSummaryResponse } from 'src/app/core/models/event-summary-response';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/core/services/session.service';
import { Table } from 'src/app/core/models/table';
import { EventService } from 'src/app/core/services/event.service';
import { EventFilters } from 'src/app/core/models/event-filters';
import { MessageService } from 'primeng/api';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-active-events-list',
  imports: [
    AvatarModule,
    ButtonModule,
    CommonModule,
    TableComponent,
    TagModule
  ],
  templateUrl: './active-events-list.component.html',
  styleUrl: './active-events-list.component.scss',
  providers: [DialogService, MessageService]
})
export class ActiveEventsListComponent implements OnInit {

  addressOptions: any [] = [];
  events: EventSummaryResponse [] = [];
  eventFilters: EventFilters | undefined;
  first = 0; 
  loading = false;
  rowsPerPage = 10;  
  sortField = "name";
  sortOrder = 1;  
  table: Table<any> = { rows: [], columns: [] };
  title = 'Events';
  totalRecords = 0; 
  selectedEvents: EventSummaryResponse [] = [];
  onlineOptions: any [] = [];
  

  constructor(
    private alertService : AlertService,
    private dialogService: DialogService,
    private eventService: EventService,
    private loaderService: LoaderService,
    private router: Router,
    private sessionService: SessionService,
  ) {}


  ngOnInit(): void {
    this.addressOptions = [{
      dataField: 'eventAddress.city',
      name: 'City',
      value: 'eventAddress.city',
    },
    {
      dataField: 'eventAddress.country',
      name: 'Country',
      value: 'eventAddress.country',
    }];
    this.onlineOptions = [{
      name: 'Online',
      value: true,
    },
    {
      name: 'In-person',
      value: false,
    }];
    const pageNo = this.first;
    this.populateTable(pageNo, this.rowsPerPage, this.sortField, this.sortOrder);
  }


  private populateTable(pageNo: number, pageSize: number, sortField: string, sortOrder: number) {
    this.loaderService.showLoader(this.router.url, false);

    const session = this.sessionService.getSession();
    const organizationId = session?.organization?.organizationId;
    const order = sortOrder == 1 ? 'ASC': 'DESC';

    const filters = this.eventFilters ?? {} as EventFilters

    this.eventService.getEventsByOrganizationIdPage(organizationId, pageNo, pageSize, sortField, order, filters).subscribe(
      (res) => {
        this.events = res.content;
        this.totalRecords = res.totalElements;
        this.first = pageNo * res.pageable.pageSize;
        this.setTableData();
        this.loading = false;
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        this.loading = false;
        this.loaderService.hideLoader(this.router.url);
      }
    );
  }

  clearFilterChangeTable() {
    this.eventFilters = {} as EventFilters;
    this.sortField = "name";
    this.sortOrder = 1;
    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }



  onEditEvent(row: any) {
    // this.ref = this.dialogService.open(EditMembershipComponent, {
    //     header: 'Edit Membership',
    //     modal: true,
    //     contentStyle: { overflow: 'auto' },
    //     breakpoints: { '960px': '75vw', '640px': '90vw' },
    //     data: { organizationId: row.organizationId , membership: row },
    //     closable: true
    // });

    // this.ref.onClose.subscribe((data: any) => {
    //     if (data?.membership) {
    //       this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
    //     }
    // });
  }

  filterChangeTable(event:any) {
    const eventFilters = event.filters;
    console.log(eventFilters);
    const nameFilter = eventFilters['name'][0].value;
    const onlineStatuses: boolean[] = eventFilters['isOnline'][0].value.map(
      (item: { name: string; value: boolean }) => item.value
    );
    
    const startEventDateFilter =  eventFilters['startEventDate'][0].value;
    const endEventDateFilter =  eventFilters['endEventDate'][0].value;

    const eventAddress =  eventFilters['eventAddress.city'][0].value;

    const eventAddressCity = eventAddress && eventAddress.dataField !== 'eventAddress.country' ? eventAddress.value : null;
    const eventAddressCountry = eventAddress && eventAddress.dataField === 'eventAddress.country' ? eventAddress.value : null;
        
    const filters = {
      name: nameFilter,
      onlineStatuses: onlineStatuses,
      startDates: startEventDateFilter,
      endDates: endEventDateFilter,
      eventEventAddressCity: eventAddressCity,
      eventEventAddressCountry: eventAddressCountry
    }

    console.log(filters);
    this.eventFilters = filters;
    this.sortField = "name";
    this.sortOrder = 1;
    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }


  onViewEventDetails(row: any) {
    // this.ref = this.dialogService.open(ViewMemberDetailsComponent, {
    //   header: 'Member Details',
    //   modal: true,
    //   contentStyle: { overflow: 'auto' },
    //   breakpoints: { '960px': '75vw', '640px': '90vw' },
    //   data: { organizationId: row.organizationId, membership: row, member: row.member },
    //   closable: true
    // });
  }

  pageChangeTable(event: any) {
    const pageNo = event.first / event.rowsPerPage;
    this.populateTable(pageNo, event.rowsPerPage, event.sortField, event.sortOrder);
  }

  sortChangeTable(event: any) {
    const pageNo = event.first / event.rowsPerPage;
    this.populateTable(0, event.rowsPerPage, event.sortField, event.sortOrder);
  } 

    

  private setTableData() {
    this.table = {
      columns: [
        {
          dataField: 'name',
          dataType: 'templateRef',
          colTemplateRefName: 'nameColumn',
          headerFilterType: 'text',
          headerText: 'Name',
          sortable: true,
          columnWidth: '15%'
        },
        {
          dataField: 'isOnline',
          dataType: 'templateRef',
          colTemplateRefName: 'isOnlineColumn',
          headerFilterType: 'select',
          headerText: 'Online',
          options: this.onlineOptions,
          sortable: true
        },
        {
          dataField: 'eventAddress.city',
          dataType: 'templateRef',
          colTemplateRefName: 'addressColumn',
          headerText: 'Address',
          headerFilterType: 'combo',
          options: this.addressOptions,
          sortable: true
        },
        {
          dataField: 'startEventDate',
          dataType: 'templateRef',
          colTemplateRefName: 'startEventDateColumn',
          headerFilterType: 'customDate',
          headerText: 'Start Date',
          sortable: true
        },
        {
          dataField: 'endEventDate',
          dataType: 'templateRef',
          colTemplateRefName: 'endEventDateColumn',
          headerFilterType: 'customDate',
          headerText: 'End Date',
          sortable: true
        },
        {
          dataField: 'editEvent',
          dataType: 'templateRef',
          colTemplateRefName: 'editEventColumn',
          headerText: 'Details/Edit Event'
        },
      ],
      rows: this.events,
      sortField: 'member.firstName',
    };
  }
}
