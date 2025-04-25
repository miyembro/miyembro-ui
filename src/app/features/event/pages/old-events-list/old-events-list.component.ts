import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { TagModule } from 'primeng/tag';
import { Subscription } from 'rxjs';
import { EventFilters } from 'src/app/core/models/event-filters';
import { EventSummaryResponse } from 'src/app/core/models/event-summary-response';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/core/services/session.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { EditEventsComponent } from '../../components/edit-events/edit-events.component';
import { EventDetailsDrawerComponent } from '../event-details-drawer/event-details-drawer.component';
import { Table } from 'src/app/core/models/table';

@Component({
  selector: 'app-old-events-list',
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
  templateUrl: './old-events-list.component.html',
  styleUrl: './old-events-list.component.scss',
  providers: [
    MessageService
  ]
})
export class OldEventsListComponent implements OnInit, OnDestroy {

  addressOptions: any [] = [];
  dataLoadedTimestamp: number = Date.now();
  events: EventSummaryResponse [] = [];
  eventFilters: EventFilters | undefined;
  first = 0; 
  loading = false;
  multiSelectButtonItems: MenuItem [] = [];
  onlineOptions: any [] = [];
  ref: DynamicDialogRef | undefined;
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
    this.multiSelectButtonItems = [
      {
          label: 'Edit Events',
          command: () => {
            this.editEvents();
          }
      }
    ];
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

  onViewEventDetails(row: any) {
    this.router.navigate(['/home/manage-events/old/view', row.eventId]);
  }

  onEventAttendanceDetails(row: any) {
    const session = this.sessionService.getSession();
    const organizationId = session?.organization?.organizationId;
    this.router.navigate(['/home/event-attendance-list', row.eventId, organizationId]);
  }

  pageChangeTable(event: any) {
    const pageNo = event.first / event.rowsPerPage;
    this.populateTable(pageNo, event.rowsPerPage, event.sortField, event.sortOrder);
  }

  sortChangeTable(event: any) {
    const pageNo = event.first / event.rowsPerPage;
    this.populateTable(0, event.rowsPerPage, event.sortField, event.sortOrder);
  } 

  private editEvents() {
    const organizationId = this.sessionService.organizationId;
    const eventIds: string [] = this.selectedEvents.map(item => item.eventId);
    this.ref = this.dialogService.open(EditEventsComponent, {
      header: 'Edit Events',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: { organizationId: organizationId , eventIds: eventIds },
      closable: true
    });
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

    const filters = this.eventFilters ?? {} as EventFilters;

    this.eventService.getOldEventsByOrganizationIdPage(organizationId, pageNo, pageSize, sortField, order, filters).subscribe(
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
          maxDate: new Date(),
          sortable: true
        },
        {
          dataField: 'endEventDate',
          dataType: 'templateRef',
          colTemplateRefName: 'endEventDateColumn',
          headerFilterType: 'customDate',
          headerText: 'End Date',
          maxDate: new Date(),
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
    this.selectedEvents = [];
    this.eventUpdateSubscription = this.eventService.eventUpdated$.subscribe(() => {
      const pageNo = this.first / this.rowsPerPage;
      this.populateTable(pageNo, this.rowsPerPage, this.sortField, this.sortOrder);
    });
  }

}