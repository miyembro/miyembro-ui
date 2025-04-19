import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventConfirmationResponse } from 'src/app/core/models/event-confirmation-response';
import { Table } from 'src/app/core/models/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/core/services/session.service';
import { EventConfirmationService } from 'src/app/core/services/event-confirmation.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { EventConfirmationFilters } from 'src/app/core/models/event-confirmation-filters';
import { map, Subscription, switchMap } from 'rxjs';
import { MembershipService } from 'src/app/core/services/membership.service';
import { MembershipFilters } from 'src/app/core/models/membership-filters';
import { ViewMemberDetailsComponent } from 'src/app/features/members/pages/view-member-details/view-member-details.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { EventConfirmationStatus } from 'src/app/core/models/event-confirmation-status.enum';
import { FormsModule } from '@angular/forms';
import { MembershipTypeService } from 'src/app/core/services/membership-type.service';
import { MembershipType } from 'src/app/core/models/membership-type';
import { EventComponent } from "../../components/event/event.component";
import { EventSummaryComponent } from "../../components/event-summary/event-summary.component";

@Component({
  selector: 'app-event-attendance-list-page',
  imports: [
    AvatarModule,
    ButtonModule,
    CommonModule,
    DrawerModule,
    FormsModule,
    MultiSelectModule,
    RouterModule,
    TableComponent,
    TagModule,
    EventComponent,
    EventSummaryComponent
],
  templateUrl: './event-attendance-list-page.component.html',
  styleUrl: './event-attendance-list-page.component.scss',
  providers: [DialogService]
})
export class EventAttendanceListPageComponent implements OnInit {

  dataLoadedTimestamp: number = Date.now();
  eventConfirmations: EventConfirmationResponse [] = [];
  eventConfirmationFilters: EventConfirmationFilters | undefined;
  eventConfirmationStatuses: any [] = [];
  selectedEventConfirmationStatuses: EventConfirmationStatus [] = [];
  
  eventId!: string;
  first = 0; 
  loading = false;
  membershipFilters: MembershipFilters | undefined;
  membershipTypes: MembershipType [] = [];
  organizationId!: string;
  ref: DynamicDialogRef | undefined;
  rowsPerPage = 10;  
  selectedEventConfirmations: EventConfirmationResponse [] = [];
  eventConfirmatioSortField = "event.eventId";
  sortField = "member.firstName";
  sortOrder = 1;  
  table: Table<any> = { rows: [], columns: [] };
  title = 'Event Confirmations';
  totalRecords = 0; 

  private routeSub!: Subscription;
  

  constructor(
    private activatedRoute: ActivatedRoute, 
    private dialogService: DialogService,
    private eventConfirmationService: EventConfirmationService,
    private loaderService: LoaderService,
    private membershipService: MembershipService,
    private membershipTypeService: MembershipTypeService,
    private router: Router,
    private sessionService: SessionService,
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
    ]
    const pageNo = this.first;
    this.routeSub = this.activatedRoute.paramMap.subscribe(params => {
      this.eventId = params.get('eventId')!;
      this.organizationId = params.get('organizationId')!;
      if (this.eventId && this.organizationId) {
        this.getMembershipTypes();
        this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
      }
    });
  }

  onEventConfirmationStatusChange(event: any) {
    if (!this.eventConfirmationFilters) {
      this.eventConfirmationFilters = {} as EventConfirmationFilters;
    }
    const eventConfirmationStatuses = this.selectedEventConfirmationStatuses.map((filter: any) => filter.value);

    this.eventConfirmationFilters.eventId = this.eventId;
    this.eventConfirmationFilters.eventConfirmationStatuses = eventConfirmationStatuses;

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
      this.eventConfirmationFilters.updatedDates = updatedDates;
    }

    this.sortField = "member.firstName";
    this.sortOrder = 1;
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

  clearFilterChangeTable() {
    this.membershipFilters = {} as MembershipFilters;
    this.eventConfirmationFilters = {} as EventConfirmationFilters;
    this.selectedEventConfirmationStatuses = [];
    this.sortField = "member.firstName";
    this.sortOrder = 1;
    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }

  // private setMembershipFilters() {

  // }

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
            memberships: membershipsPage.content
          }))
        );
      })
    ).subscribe(
      ({ confirmations, memberships }) => {
        
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
          sortable: true,
          columnWidth: '15%'
        },
        {
          dataField: 'membership.membershipType.name',
          dataType: 'string',
          headerFilterType: 'select',
          headerText: 'Membership Type',
          options: this.membershipTypes,
          sortable: true
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
          sortable: true
        },
        {
          dataField: 'membership.editMembership',
          dataType: 'templateRef',
          colTemplateRefName: 'editMembershipColumn',
          headerText: 'Membership Details'
        },
      ],
      rows: this.eventConfirmations,
      sortField: 'membership.member.firstName',
    };
  }
}