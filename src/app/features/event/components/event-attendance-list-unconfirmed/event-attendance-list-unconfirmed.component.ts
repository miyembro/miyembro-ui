import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipFilters } from 'src/app/core/models/membership-filters';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MembershipType } from 'src/app/core/models/membership-type';
import { Table } from 'src/app/core/models/table';
import { MemberListComponent } from 'src/app/features/members/pages/member-list/member-list.component';
import { Router } from '@angular/router';
import { MembershipStatusResponse } from 'src/app/core/models/membership-status-response';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MembershipStatusService } from 'src/app/core/services/membership-status.service';
import { MembershipTypeService } from 'src/app/core/services/membership-type.service';
import { MembershipService } from 'src/app/core/services/membership.service';
import { RoleService } from 'src/app/core/services/role.service';
import { SessionService } from 'src/app/core/services/session.service';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { Session } from 'src/app/core/models/session';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ViewMemberDetailsComponent } from 'src/app/features/members/pages/view-member-details/view-member-details.component';
import { EditMembershipComponent } from 'src/app/features/members/pages/edit-membership/edit-membership.component';
import { EditEventConfirmationComponent } from '../edit-event-confirmation/edit-event-confirmation.component';
import { switchMap, map, Subscription } from 'rxjs';
import { EventConfirmationFilters } from 'src/app/core/models/event-confirmation-filters';
import { EventConfirmationService } from 'src/app/core/services/event-confirmation.service';
import { EventConfirmationResponse } from 'src/app/core/models/event-confirmation-response';
import { EditEventConfirmationsComponent } from '../edit-event-confirmations/edit-event-confirmations.component';

@Component({
  selector: 'app-event-attendance-list-unconfirmed',
  imports: [
    AvatarGroupModule,
    AvatarModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    MemberListComponent,
    MultiSelectModule,
    TableComponent,
    TagModule
  ],
  templateUrl: './event-attendance-list-unconfirmed.component.html',
  styleUrl: './event-attendance-list-unconfirmed.component.scss',
})
export class EventAttendanceListUnconfirmedComponent {

  @Input() eventId!: string;
  @Input() organizationId!: string;

  eventConfirmations: EventConfirmationResponse [] = [];
  first = 0; 
  loading = false;
  memberships: MembershipResponse [] = [];
  membershipFilters: MembershipFilters | undefined;
  membershipTypes: MembershipType [] = [];
  membershipStatuses: MembershipStatusResponse [] = [];
  multiSelectButtonItems: MenuItem[] = [];
  ref: DynamicDialogRef | undefined;
  rowsPerPage = 5;  
  selectedMemberships: MembershipResponse [] = [];
  selectedMembershipStatuses: MembershipStatusResponse [] = [];
  sortField = "member.firstName";
  sortOrder = 1;  
  table: Table<any> = { rows: [], columns: [] };
  tableFooterCountTitle = 'Member'
  title = 'Event Confirmations';
  totalRecords = 0; 

  private eventConfirmationUpdateSubscription!: Subscription;
  

  constructor(
      private dialogService: DialogService,
      private eventConfirmationService: EventConfirmationService,
      private loaderService: LoaderService,
      private membershipService: MembershipService,
      private membershipStatusService: MembershipStatusService,
      private membershipTypeService: MembershipTypeService,
      private router: Router,
    ) {}
  
  ngOnInit(): void {
    this.multiSelectButtonItems = [
      {
          label: 'Edit Attendances',
          command: () => {
            this.editAttendances();
          }
      }
    ];
    const pageNo = this.first;
    this.populateTable(pageNo, this.rowsPerPage, this.sortField, this.sortOrder);
    this.getMembershipTypes();
    this.getMembershipStatuses();
    this.subscribeToEventConfirmationUpdates();
  }

  ngOnDestroy(): void {
    if (this.eventConfirmationUpdateSubscription) {
      this.eventConfirmationUpdateSubscription.unsubscribe();
    }
  }

  clearFilterChangeTable() {
    this.membershipFilters = {} as MembershipFilters;
    this.membershipFilters.membershipStatusNames = this.selectedMembershipStatuses.map((filter: any) => filter.name);
    this.sortField = "member.firstName";
    this.sortOrder = 1;
    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }

  filterChangeTable(event:any) {
    const eventFilters = event.filters;
    console.log(eventFilters)
    const membershipStatuses = this.selectedMembershipStatuses.map((filter: any) => filter.name);
    const membershipTypes = eventFilters['membershipType.name'][0].value;

    if(this.membershipFilters) {
      this.membershipFilters.memberFirstName  = eventFilters['member.firstName'][0].value;
      this.membershipFilters.membershipStatusNames  = membershipStatuses;
      this.membershipFilters.membershipTypeNames  = membershipTypes ? membershipTypes.map((filter: any) => filter.name) : null;
    }
    this.sortField = "member.firstName";
    this.sortOrder = 1;
    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }

  onAddAttendance(row: any) {
    this.ref = this.dialogService.open(EditEventConfirmationComponent, {
        header: "Add Member's Attendance",
        modal: true,
        contentStyle: { overflow: 'auto' },
        breakpoints: { '960px': '75vw', '640px': '90vw' },
        data: { eventId: this.eventId, eventConfirmationId: null , memberId: row.member.memberId, organizationId: this.organizationId },
        closable: true
    });
  }

  onEditMembership(row: any) {
    this.ref = this.dialogService.open(EditMembershipComponent, {
        header: 'Edit Membership',
        modal: true,
        contentStyle: { overflow: 'auto' },
        breakpoints: { '960px': '75vw', '640px': '90vw' },
        data: { organizationId: row.organizationId , membership: row },
        closable: true
    });

    this.ref.onClose.subscribe((data: any) => {
        if (data?.membership) {
          this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
        }
    });
  }

  onMembershipStatusChange(event: any) {
    if (!this.membershipFilters) {
      this.membershipFilters = {} as MembershipFilters;
    }
    this.membershipFilters.membershipStatusNames = this.selectedMembershipStatuses.map((filter: any) => filter.name);
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
      data: { organizationId: row.organizationId, membership: row, member: row.member },
      closable: true
    });
  }

  pageChangeTable(event: any) {
    const pageNo = event.first / event.rowsPerPage;
    this.populateTable(pageNo, event.rowsPerPage, event.sortField, event.sortOrder);
  }

  sortChangeTable(event: any) {
    const pageNo = event.first / event.rowsPerPage;
    this.populateTable(0, event.rowsPerPage, event.sortField, event.sortOrder);
  } 

  private editAttendances() {
    const eventConfirmationIds = null;
    const memberIds = this.memberships.map(conf => conf.member.memberId);
    console.log(eventConfirmationIds);
    console.log(memberIds);

    this.ref = this.dialogService.open(EditEventConfirmationsComponent, {
      header: 'Edit Attendances',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: { organizationId: this.organizationId , eventId: this.eventId, eventConfirmationIds: eventConfirmationIds, memberIds: memberIds },
      closable: true
    });
  }

  private getMembershipStatuses() {
    this.membershipStatusService.getApprovedMembershipStatuses().subscribe(
      (res) => {
        this.membershipStatuses = res;
        this.selectedMembershipStatuses = this.membershipStatuses.filter(status => status.name === 'Active');
        this.onMembershipStatusChange(null);
      },
      (err: any) => {
        console.log(err);
      }
    );
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

  // private populateTable(pageNo: number, pageSize: number, sortField: string, sortOrder: number) {
  //   this.loading = true;
  //   this.loaderService.showLoader(this.router.url, false);

  //   const organizationId = this.organizationId;
  //   const order = sortOrder == 1 ? 'ASC': 'DESC';

  //   const filters = this.membershipFilters ?? {} as MembershipFilters;

  //   this.membershipService.getMembershipsByOrganization(organizationId, pageNo, pageSize, sortField, order, filters).subscribe(
  //     (res) => {
  //       this.memberships = res.content;
  //       this.totalRecords = res.totalElements;
  //       this.first = pageNo * res.pageable.pageSize;
  //       this.setTableData();
  //       this.loading = false;
  //       this.loaderService.hideLoader(this.router.url);
  //     },
  //     (err: any) => {
  //       this.loading = false;
  //       this.loaderService.hideLoader(this.router.url);
  //     }
  //   );
  // }


  private populateTable(pageNo: number, pageSize: number, sortField: string, sortOrder: number) {
    this.loaderService.showLoader(this.router.url, false);
  
    const order = sortOrder == 1 ? 'ASC' : 'DESC';
    const eventConfirmationFilters = {} as EventConfirmationFilters;
  
    this.eventConfirmationService.getEventConfirmations(
      this.eventId, null, null, 'eventConfirmationId', 'ASC', eventConfirmationFilters
    ).pipe(
      switchMap((res) => {
        this.eventConfirmations = res.content;
        const memberIds = this.eventConfirmations.map(c => c.memberId);
  
        this.membershipFilters = this.membershipFilters ?? {} as MembershipFilters;

        this.membershipFilters.excludedMemberIds = memberIds;

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
        this.memberships = memberships;
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
          dataField: 'member.firstName',
          dataType: 'templateRef',
          colTemplateRefName: 'nameColumn',
          headerFilterType: 'text',
          headerText: 'Name (status)',
          sortable: true,
        },
        {
          dataField: 'membershipType.name',
          dataType: 'string',
          headerFilterType: 'select',
          headerText: 'Membership Type',
          options: this.membershipTypes,
          sortable: true
        },
        {
          dataField: 'editMembership',
          dataType: 'templateRef',
          colTemplateRefName: 'editMembershipColumn',
          headerText: ''
        },
      ],
      rows: this.memberships,
      sortField: 'member.firstName',
    };
  }

  private subscribeToEventConfirmationUpdates() {
    this.eventConfirmationUpdateSubscription = this.eventConfirmationService.eventConfirmationUpdated$.subscribe(() => {
      const pageNo = this.first / this.rowsPerPage;
      this.populateTable(pageNo, this.rowsPerPage, this.sortField, this.sortOrder);
    });
  }

}
