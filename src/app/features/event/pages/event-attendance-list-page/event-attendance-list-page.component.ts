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
    private alertService : AlertService,
    private dialogService: DialogService,
    private eventConfirmationService: EventConfirmationService,
    private loaderService: LoaderService,
    private membershipService: MembershipService,
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
        this.populateTable(null, 0, this.eventConfirmatioSortField, this.sortOrder);
      }
    });
  }

  onEventConfirmationStatusChange(event: any) {
    if (!this.eventConfirmationFilters) {
      this.eventConfirmationFilters = {} as EventConfirmationFilters;
    }
    const eventConfirmationStatuses = this.selectedEventConfirmationStatuses.map((filter: any) => filter.value);
    this.eventConfirmationFilters  = {
      eventId: this.eventId,
      eventConfirmationStatuses: eventConfirmationStatuses,
      createdAt: undefined,
      updatedAt: undefined
    };

    console.log(this.selectedEventConfirmations);

    console.log(eventConfirmationStatuses);

    this.populateTable(null, null, this.eventConfirmatioSortField, this.sortOrder);
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

  private populateTable(pageNo: number | null, pageSize: number | null, sortField: string, sortOrder: number) {
    this.loaderService.showLoader(this.router.url, false);
  
    const order = sortOrder == 1 ? 'ASC' : 'DESC';
    const filters = this.eventConfirmationFilters ?? {} as EventConfirmationFilters;
  
    this.eventConfirmationService.getEventConfirmations(
      this.eventId, pageNo, pageSize, sortField, order, filters
    ).pipe(
      switchMap((res) => {
        this.eventConfirmations = res.content;
        console.log(this.eventConfirmations);
        const memberIds = this.eventConfirmations.map(c => c.memberId);
  
        // Initialize ALL filter fields
        this.membershipFilters = {
          memberFirstName: null,
          memberEmail: null,
          memberMemberAddressCity: null,
          memberMemberAddressCountry: null,
          membershipStatusNames: null,
          membershipTypeNames: null,
          roleNames: null,
          startDates: null,
          endDates: null,
          memberIds: memberIds // This is the critical filter
        };
  
        // Fetch ALL memberships (adjust pageSize)
        return this.membershipService.getMembershipsByOrganization(
          this.organizationId,
          0, // pageNo
          1000, // pageSize (fetch all records)
          'member.firstName',
          'ASC',
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
        console.log('Memberships:', memberships);
        
        // Verify memberId mapping (adjust property path if needed)
        this.eventConfirmations = confirmations.map(conf => ({
          ...conf,
          membership: memberships.find(m => m.member?.memberId === conf.memberId)
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
          dataField: 'membership.member.memberAddress.city',
          dataType: 'templateRef',
          colTemplateRefName: 'addressColumn',
          headerText: 'Address',
          headerFilterType: 'combo',
          sortable: true
        },
        {
          dataField: 'membership.membershipType.name',
          dataType: 'string',
          headerFilterType: 'select',
          headerText: 'Membership Type',
          sortable: true
        },
        {
          dataField: 'eventConfirmationStatus',
          dataType: 'templateRef',
          colTemplateRefName: 'eventConfirmationStatusColumn',
          headerText: 'Going?',
        },
        // {
        //   dataField: 'membership.role.name',
        //   dataType: 'string',
        //   headerFilterType: 'select',
        //   headerText: 'Role',
        // },
        // {
        //   dataField: 'membership.startDate',
        //   dataType: 'templateRef',
        //   colTemplateRefName: 'startDateColumn',
        //   headerFilterType: 'customDate',
        //   headerText: 'Membership Start Date',
        //   sortable: true
        // },
        // {
        //   dataField: 'membership.endDate',
        //   dataType: 'templateRef',
        //   colTemplateRefName: 'endDateColumn',
        //   headerFilterType: 'customDate',
        //   headerText: 'Membership End Date',
        //   sortable: true
        // },
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




// private setTableData() {
//   this.table = {
//     columns: [
//       {
//         dataField: 'memberId',
//         dataType: 'templateRef',
//         colTemplateRefName: 'memberIdColumn',
//         headerFilterType: 'text',
//         headerText: 'MemberId',
//         sortable: true,
//         columnWidth: '15%'
//       },
//       {
//         dataField: 'eventConfirmationStatus',
//         dataType: 'templateRef',
//         colTemplateRefName: 'eventConfirmationStatusColumn',
//         headerFilterType: 'select',
//         headerText: 'Attendance',
//         // options: this.eventConfirmationStatusOptions,
//         sortable: true
//       },
      
//     ],
//     rows: this.eventConfirmations,
//     sortField: 'memberId',
//   };
// }
