import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { Subscription, switchMap, map } from 'rxjs';
import { EventConfirmationFilters } from 'src/app/core/models/event-confirmation-filters';
import { EventConfirmationResponse } from 'src/app/core/models/event-confirmation-response';
import { EventConfirmationStatus } from 'src/app/core/models/event-confirmation-status.enum';
import { MembershipFilters } from 'src/app/core/models/membership-filters';
import { MembershipType } from 'src/app/core/models/membership-type';
import { EventConfirmationService } from 'src/app/core/services/event-confirmation.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MembershipTypeService } from 'src/app/core/services/membership-type.service';
import { MembershipService } from 'src/app/core/services/membership.service';
import { ViewMemberDetailsComponent } from 'src/app/features/members/pages/view-member-details/view-member-details.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { EditEventConfirmationComponent } from '../edit-event-confirmation/edit-event-confirmation.component';
import { EventSummaryComponent } from '../event-summary/event-summary.component';
import { EventComponent } from '../event/event.component';
import { Table } from 'src/app/core/models/table';

@Component({
  selector: 'app-event-attendance-list-confirmed',
    imports: [
      AvatarModule,
      ButtonModule,
      CommonModule,
      DrawerModule,
      EventComponent,
      EventSummaryComponent,
      FormsModule,
      MultiSelectModule,
      RouterModule,
      TableComponent,
      TagModule
  ],
  templateUrl: './event-attendance-list-confirmed.component.html',
  styleUrl: './event-attendance-list-confirmed.component.scss',
})
export class EventAttendanceListConfirmedComponent implements OnInit , OnDestroy {

  @Input() eventId!: string;
  @Input() organizationId!: string;

  dataLoadedTimestamp: number = Date.now();
  eventConfirmations: EventConfirmationResponse [] = [];
  eventConfirmationFilters: EventConfirmationFilters | undefined;
  eventConfirmationStatuses: {
    label: string; 
    value: EventConfirmationStatus;
    icon: string; 
  } [] = [];
  eventConfirmatioSortField = "event.eventId";
  first = 0; 
  loading = false;
  membershipFilters: MembershipFilters | undefined;
  membershipTypes: MembershipType [] = [];
  multiSelectButtonItems: MenuItem[] = [];
  ref: DynamicDialogRef | undefined;
  rowsPerPage = 5;  
  selectedEventConfirmations: EventConfirmationResponse [] = [];
  selectedEventConfirmationStatuses: EventConfirmationStatus [] = [];
  sortField = "member.firstName";
  sortOrder = 1;  
  table: Table<any> = { rows: [], columns: [] };
  title = 'Event Confirmations';
  totalRecords = 0; 

  private eventConfirmationUpdateSubscription!: Subscription;

  constructor(
    private dialogService: DialogService,
    private eventConfirmationService: EventConfirmationService,
    private loaderService: LoaderService,
    private membershipService: MembershipService,
    private membershipTypeService: MembershipTypeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.eventConfirmationStatuses = [
      { 
        label: 'Going', 
        value: EventConfirmationStatus.YES,
        icon: 'pi pi-check', 
      },
      { 
        label: 'Nope', 
        value: EventConfirmationStatus.NO,
        icon: 'pi pi-times',
      },
      { 
        label: 'Maybe', 
        value: EventConfirmationStatus.MAYBE ,
        icon: 'pi pi-question',
      }
    ];
    this.multiSelectButtonItems = [
      {
          label: 'Edit Attendances',
          command: () => {
            this.editAttendances();
          }
      }
    ];
    this.subscribeToEventConfirmationUpdates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventId'] && this.eventId && this.organizationId) {
      this.getMembershipTypes();
      this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
    }
  }

  ngOnDestroy(): void {
    if (this.eventConfirmationUpdateSubscription) {
      this.eventConfirmationUpdateSubscription.unsubscribe();
    }
  }

  clearFilterChangeTable() {
    this.membershipFilters = {} as MembershipFilters;
    if(this.eventConfirmationFilters) {
      this.eventConfirmationFilters.updatedDates = [];
      //this.eventConfirmationFilters.eventConfirmationStatuses = this.selectedEventConfirmationStatuses;
    }
 
    this.sortField = "member.firstName";
    this.sortOrder = 1;
    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }

  filterChangeTable(event:any) {
    const eventFilters = event.filters;
    const memberName = eventFilters['membership.member.firstName'][0].value
    const membershipTypes = eventFilters['membership.membershipType.name'][0].value;
    const membershipTypeNames = membershipTypes ? membershipTypes.map((filter: any) => filter.name) : null;
    const updatedDates = eventFilters['updatedAt'][0].value;

    if(this.membershipFilters) {
      this.membershipFilters.memberFirstName = memberName;
      this.membershipFilters.membershipTypeNames = membershipTypeNames;
    }
    this.eventConfirmationFilters = this.eventConfirmationFilters ?? {} as EventConfirmationFilters;
    if(this.eventConfirmationFilters) {
      this.eventConfirmationFilters.updatedDates = updatedDates ? updatedDates  : [];
    }

    this.sortField = "member.firstName";
    this.sortOrder = 1;
    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }

  onEditAttendance(row: any) {
    this.ref = this.dialogService.open(EditEventConfirmationComponent, {
        header: "Edit Member's Attendance",
        modal: true,
        contentStyle: { overflow: 'auto' },
        breakpoints: { '960px': '75vw', '640px': '90vw' },
        data: { eventId: this.eventId, eventConfirmationId: row.eventConfirmationId , memberId: row.membership.member.memberId, organizationId: this.organizationId },
        closable: true
    });
  }

  onEventConfirmationStatusChange(event: any) {
    if (!this.eventConfirmationFilters) {
      this.eventConfirmationFilters = {} as EventConfirmationFilters;
    }
    const eventConfirmationStatuses = this.selectedEventConfirmationStatuses.map((filter: any) => filter.value);

    this.eventConfirmationFilters.eventId = this.eventId;
    this.eventConfirmationFilters.eventConfirmationStatuses = eventConfirmationStatuses;

    this.membershipFilters = {} as MembershipFilters;

    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }

  onViewMemberDetails(row: any) {
    this.ref = this.dialogService.open(ViewMemberDetailsComponent, {
      header: 'Member Details',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: { organizationId: this.organizationId, membership: row.membership, member: row.membership.member },
      closable: true
    });
  }

  private editAttendances() {
    console.log('dsadasds');
  }

  private getMembershipTypes() {
    this.membershipTypeService.getMembershipTypesByOrganizationId(this.organizationId).subscribe(
      (res) => {
        this.membershipTypes = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private populateTable(pageNo: number, pageSize: number, sortField: string, sortOrder: number) {
    this.loaderService.showLoader(this.router.url, false);
  
    const order = sortOrder == 1 ? 'ASC' : 'DESC';
    const eventConfirmationFilters = this.eventConfirmationFilters ?? {} as EventConfirmationFilters;
  
    this.eventConfirmationService.getEventConfirmations(
      this.eventId, null, null, this.eventConfirmatioSortField, 'ASC', eventConfirmationFilters
    ).pipe(
      switchMap((res) => {
        this.eventConfirmations = res.content;
        const memberIds = this.eventConfirmations.map(c => c.memberId);
  
        this.membershipFilters = this.membershipFilters ?? {} as MembershipFilters;

        this.membershipFilters.memberIds = memberIds;

        return this.membershipService.getMembershipsByOrganization(
          this.organizationId,
          pageNo,
          pageSize,
          sortField,
          order,
          this.membershipFilters
        ).pipe(
          map(membershipsPage => ({
            confirmations: this.eventConfirmations,
            memberships: membershipsPage.content,
            totalRecords: membershipsPage.totalElements
          }))
        );
      })
    ).subscribe(
      ({ confirmations, memberships, totalRecords }) => {
        
        const memberIdSet = new Set<string>(
          memberships
            .map(m => m.member?.memberId)
            .filter((id): id is string => id != null)  // ← type‐guard here
        );
        
        const validConfs = confirmations.filter(
          conf => conf.memberId != null           // ← rule out undefined
               && memberIdSet.has(conf.memberId) // ← now memberId is definitely string
        );
        
        this.eventConfirmations = validConfs.map(conf => ({
          ...conf,
          membership: memberships.find(
            m => m.member?.memberId === conf.memberId
          )!
        }));

        this.totalRecords = totalRecords;

        this.setTableData();
  
        this.loading = false;
        this.loaderService.hideLoader(this.router.url);
      },
      (err) => {
        console.error('Error:', err); // Debugging
        this.loading = false;
        this.loaderService.hideLoader(this.router.url);
      }
    );
  }

  private setTableData() {
    this.table = {
      columns: [
        {
          dataField: 'membership.member.firstName',
          dataType: 'templateRef',
          colTemplateRefName: 'nameColumn',
          headerFilterType: 'text',
          headerText: 'Name (status)',
        },
        {
          dataField: 'membership.membershipType.name',
          dataType: 'string',
          headerFilterType: 'select',
          headerText: 'Membership Type',
          options: this.membershipTypes,
        },
        {
          dataField: 'eventConfirmationStatus',
          dataType: 'templateRef',
          colTemplateRefName: 'eventConfirmationStatusColumn',
          headerText: 'Going?',
        },
        {
          dataField: 'updatedAt',
          dataType: 'templateRef',
          colTemplateRefName: 'updatedAtColumn',
          headerFilterType: 'customDate',
          headerText: 'Confirmation Date',
        },
        {
          dataField: 'membership.editMembership',
          dataType: 'templateRef',
          colTemplateRefName: 'editMembershipColumn',
          headerText: ''
        },
      ],
      rows: this.eventConfirmations,
      sortField: 'membership.member.firstName',
    };
  }

  private subscribeToEventConfirmationUpdates() {
    this.eventConfirmationUpdateSubscription = this.eventConfirmationService.eventConfirmationUpdated$.subscribe(() => {
      const pageNo = this.first / this.rowsPerPage;
      this.populateTable(pageNo, this.rowsPerPage, this.sortField, this.sortOrder);
    });
  }
}