import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { DrawerModule } from 'primeng/drawer';
import { EventDetailsDrawerComponent } from "../event-details-drawer/event-details-drawer.component";
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-active-events-list',
  imports: [
    AvatarModule,
    ButtonModule,
    CommonModule,
    DrawerModule,
    EventDetailsDrawerComponent,
    RouterModule,
    TableComponent,
    TagModule,
],
  templateUrl: './active-events-list.component.html',
  styleUrl: './active-events-list.component.scss',
  providers: [DialogService, MessageService]
})
export class ActiveEventsListComponent implements OnInit, OnDestroy {

  addressOptions: any [] = [];
  dataLoadedTimestamp: number = Date.now();
  events: EventSummaryResponse [] = [];
  eventFilters: EventFilters | undefined;
  first = 0; 
  loading = false;
  onlineOptions: any [] = [];
  rowsPerPage = 10;  
  selectedEvents: EventSummaryResponse [] = [];
  sortField = "name";
  sortOrder = 1;  
  table: Table<any> = { rows: [], columns: [] };
  title = 'Events';
  totalRecords = 0; 

  private eventUpdateSubscription!: Subscription;

  constructor(
    private alertService : AlertService,
    private dialogService: DialogService,
    private eventService: EventService,
    private loaderService: LoaderService,
    private router: Router,
    private sessionService: SessionService,
  ) {}


  ngOnInit(): void {
    this.populateSelectOptions();
    const pageNo = this.first;
    this.populateTable(pageNo, this.rowsPerPage, this.sortField, this.sortOrder);
    this.subscribeToEventUpdates();
  }

  ngOnDestroy(): void {
    if (this.eventUpdateSubscription) {
      this.eventUpdateSubscription.unsubscribe();
    }
  }

  private populateSelectOptions() {
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
        this.dataLoadedTimestamp = Date.now();
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

  private subscribeToEventUpdates() {
    this.eventUpdateSubscription = this.eventService.eventUpdated$.subscribe(() => {
      const pageNo = this.first / this.rowsPerPage;
      this.populateTable(pageNo, this.rowsPerPage, this.sortField, this.sortOrder);
    });
  }

  clearFilterChangeTable() {
    this.eventFilters = {} as EventFilters;
    this.sortField = "name";
    this.sortOrder = 1;
    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }

  filterChangeTable(event:any) {
    const eventFilters = event.filters;
    console.log(eventFilters);
    const nameFilter = eventFilters['name'][0].value;
    const onlineStatuses: boolean[] = eventFilters['isOnline'][0].value ? eventFilters['isOnline'][0].value.map(
      (item: { name: string; value: boolean }) => item.value
    ) : null;
    
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

  onEditEvent(row: any) {
    this.router.navigate(['/home/manage-events/active/edit', row.eventId]); 
  }

  onViewEventDetails(row: any) {
    this.router.navigate(['/home/manage-events/active/view', row.eventId]);
  }

  pageChangeTable(event: any) {
    const pageNo = event.first / event.rowsPerPage;
    this.populateTable(pageNo, event.rowsPerPage, event.sortField, event.sortOrder);
  }

  sortChangeTable(event: any) {
    const pageNo = event.first / event.rowsPerPage;
    this.populateTable(0, event.rowsPerPage, event.sortField, event.sortOrder);
  } 

}


    // this.router.navigate(['/edit-event'], {
    //   state: { eventId: row?.eventId, organizationId: row.organizationId }
    // });