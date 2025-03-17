import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/core/services/session.service';
import { Table } from 'src/app/core/models/table';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonModule } from '@angular/common';
import { Session } from 'src/app/core/models/session';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApproveJoinOrganizationRequestComponent } from '../approve-join-organization-request/approve-join-organization-request.component';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { MembershipService } from 'src/app/core/services/membership.service';
import { MembershipFilters } from '../../../../core/models/membership-filters';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MembershipRequest } from 'src/app/core/models/membership-request';
import { MenuItem, MessageService } from 'primeng/api';
import { MembershipStatusResponse } from 'src/app/core/models/membership-status-response';
import { MembershipStatusService } from 'src/app/core/services/membership-status.service';
import { ApproveMultipleJoinOrganizationRequestsComponent } from '../approve-multiple-join-organization-requests/approve-multiple-join-organization-requests.component';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-join-requests',
  imports: [
    AvatarGroupModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    CommonModule,
    DynamicDialogModule,
    FormsModule,
    MultiSelectModule,
    TableComponent,
    TagModule
  ],
  templateUrl: './member-join-requests.component.html',
  styleUrl: './member-join-requests.component.scss',
  providers: [DialogService, MessageService]
})
export class MemberJoinRequestsComponent implements OnInit {

  addressOptions: any [] = [];
  first = 0; 
  joinRequestsMembershipStatuses: MembershipStatusResponse [] = [];
  loading = false;
  memberships: MembershipResponse [] = [];
  membershipFilters: MembershipFilters | undefined;
  multiSelectButtonItems: MenuItem[] = [];
  ref: DynamicDialogRef | undefined;
  rowsPerPage = 10;
  selectedMemberships: MembershipResponse [] = [];
  selectedJoinRequestsMembershipStatuses: MembershipStatusResponse [] =[];
  session: Session | null = null;
  sortField = "member.firstName";
  sortOrder = 1;  
  table: Table<any> = { rows: [], columns: [] };
  tableFooterCountTitle = 'Member'
  title = 'Members';
  totalRecords = 0; 
  
  constructor(
    private alertService: AlertService,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private membershipService: MembershipService, 
    private membershipStatusService: MembershipStatusService,
    private router: Router,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.addressOptions = [{
      dataField: 'member.memberAddress.city',
      name: 'City',
      value: 'member.memberAddress.city',
    },
    {
      dataField: 'member.memberAddress.country',
      name: 'Country',
      value: 'member.memberAddress.country',
    }];
    this.multiSelectButtonItems = [
      {
          label: 'Edit Requests',
          command: () => {
            this.editRequests();
          }
      }
    ];
    const pageNo = this.first;
    this.getMembershipStatuses();
    this.populateTable(pageNo, this.rowsPerPage, this.sortField, this.sortOrder);
    this.session = this.sessionService.getSession();
  }

  approveJoinRequest(row: any) {
    this.ref = this.dialogService.open(ApproveJoinOrganizationRequestComponent, {
        header: 'Approve Request',
        modal: true,
        contentStyle: { overflow: 'auto' },
        breakpoints: { '960px': '75vw', '640px': '90vw' },
        data: { organizationId: row.organizationId , membership: row },
        closable: true
    });
    this.ref.onClose.subscribe((data: any) => {
        if (data?.membership) {
            this.alertService.success(this.router.url, 'Success', "Succesfully approve request");
            this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
          }
    });
  }
  
  clearFilterChangeTable() {
      this.membershipFilters = {} as MembershipFilters;
      this.membershipFilters.membershipStatusNames = this.selectedJoinRequestsMembershipStatuses.map((filter: any) => filter.name);
      this.sortField = "member.firstName";
      this.sortOrder = 1;
      this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }

  denyJoinRequest(membership: MembershipResponse) {
  
    const { role, ...membershipToUpdate } = { ...membership };
  
    const membershipRequest: MembershipRequest = membershipToUpdate as MembershipRequest;
    const organizationId = this.sessionService.organizationId;

    this.membershipService.denyMembershipRequest(organizationId, membershipRequest).subscribe(
      (res) => {
        this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
        this.alertService.success(this.router.url, 'Success', "Succesfully denied request");
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  filterChangeTable(event:any) {
    const eventFilters = event.filters;    
    const memberAddress =  eventFilters['member.memberAddress.city'][0].value;

    const memberMemberAddressCity = memberAddress && memberAddress.dataField !== 'member.memberAddress.country' ? memberAddress.value : null;
    const memberMemberAddressCountry = memberAddress && memberAddress.dataField === 'member.memberAddress.country' ? memberAddress.value : null;
        
    //const membershipStatuses = eventFilters['membershipStatus.name'][0].value;
    const membershipStatuses = this.selectedJoinRequestsMembershipStatuses.map((filter: any) => filter.name);

    const filters = {
      memberFirstName: eventFilters['member.firstName'][0].value,
      memberEmail: eventFilters['member.email'][0].value,
      memberMemberAddressCity: memberMemberAddressCity,
      memberMemberAddressCountry: memberMemberAddressCountry,
      membershipStatusNames: membershipStatuses,
      //membershipStatusNames: membershipStatuses? membershipStatuses.map((filter: any) => filter.name) : null,
      membershipTypeNames: null,
      roleNames:  null,
      startDates:  null,
      endDates:  null,
    }
    this.membershipFilters = filters;
    this.sortField = "member.firstName";
    this.sortOrder = 1;
    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }

  onMembershipStatusChange(event: any) {
    if (!this.membershipFilters) {
      this.membershipFilters = {} as MembershipFilters;
    }
    this.membershipFilters.membershipStatusNames = this.selectedJoinRequestsMembershipStatuses.map((filter: any) => filter.name);
    this.sortField = "member.firstName";
    this.sortOrder = 1;
    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
  }

  pageChangeTable(event: any) {
    const pageNo = event.first / event.rowsPerPage;
    this.populateTable(pageNo, event.rowsPerPage, event.sortField, event.sortOrder);
  }

  sortChangeTable(event: any) {
    const pageNo = event.first / event.rowsPerPage;
    this.populateTable(pageNo, event.rowsPerPage, event.sortField, event.sortOrder);
  }


  private editRequests() {
    const organizationId = this.sessionService.organizationId;
    this.ref = this.dialogService.open(ApproveMultipleJoinOrganizationRequestsComponent, {
      header: 'Edit Requests',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: { organizationId: organizationId , memberships: this.selectedMemberships },
      closable: true
    });

    this.ref.onClose.subscribe((data: any) => {
        if (data?.memberships) {
          this.selectedMemberships = [];
          this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
        }
    });
  }

  private getMembershipStatuses() {
    this.membershipStatusService.getJoinReqqestsMembershipStatuses().subscribe(
      (res) => {
        this.joinRequestsMembershipStatuses = res;
        this.selectedJoinRequestsMembershipStatuses = this.joinRequestsMembershipStatuses.filter(status => status.name === 'Pending');
        this.onMembershipStatusChange(null);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private populateTable(pageNo: number, pageSize: number, sortField: string, sortOrder: number) {
    this.loading = true;
    this.loaderService.showLoader(this.router.url, false);
    const session = this.sessionService.getSession();
    const organizationId = session?.organization?.organizationId;
    const order = sortOrder == 1 ? 'ASC': 'DESC';

    const filters = this.membershipFilters ?? {} as MembershipFilters


    this.membershipService.getRequestsMembershipsByOrganization(organizationId, pageNo, pageSize, sortField, order, filters).subscribe(
      (res) => {
        this.memberships = res.content;
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

  private setTableData() {
    this.table = {
      columns: [
        {
          dataField: 'member.firstName',
          dataType: 'templateRef',
          colTemplateRefName: 'nameColumn',
          headerText: 'Name',
          headerFilterType: 'text',
          sortable: true
        },
        {
          dataField: 'member.email',
          dataType: 'string',
          colTemplateRefName: 'userFullnameColumn',
          headerText: 'Email',
          headerFilterType: 'text',
          sortable: true
        },
        // {
        //   dataField: 'member.phoneNumber',
        //   dataType: 'string',
        //   colTemplateRefName: 'userFullnameColumn',
        //   headerText: 'Mobile Number',
        //   sortable: true
        // },
        // {
        //   dataField: 'membershipStatus.name',
        //   dataType: 'string',
        //   headerFilterType: 'select',
        //   headerText: 'Status',
        //   options: this.joinRequestsMembershipStatuses,
        //   sortable: true
        // },
        {
          dataField: 'member.memberAddress.city',
          dataType: 'templateRef',
          colTemplateRefName: 'addressColumn',
          headerText: 'Address',
          headerFilterType: 'combo',
          options: this.addressOptions,
          sortable: true
        },
        {
          dataField: 'approveDeny',
          dataType: 'templateRef',
          colTemplateRefName: 'approveDenyColumn',
          headerText: 'Approval'
        },
      ],
      rows: this.memberships,
      sortField: 'member.firstName',
    };
  }

}
