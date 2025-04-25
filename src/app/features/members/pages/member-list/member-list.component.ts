import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/core/services/session.service';
import { Table } from 'src/app/core/models/table';
import { CommonModule } from '@angular/common';
import { Session } from 'src/app/core/models/session';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { EditMembershipComponent } from '../edit-membership/edit-membership.component';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { MenuItem, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MembershipTypeService } from 'src/app/core/services/membership-type.service';
import { MembershipType } from 'src/app/core/models/membership-type';
import { MultiSelectModule } from 'primeng/multiselect';
import { MembershipStatusResponse } from '../../../../core/models/membership-status-response';
import { Role } from 'src/app/core/models/role';
import { RoleService } from 'src/app/core/services/role.service';
import { MembershipStatusService } from 'src/app/core/services/membership-status.service';
import { MembershipFilters } from '../../../../core/models/membership-filters';
import { MembershipService } from 'src/app/core/services/membership.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EditMultipleMembershipsComponent } from '../edit-multiple-memberships/edit-multiple-memberships.component';
import { TagModule } from 'primeng/tag';
import { ViewMemberDetailsComponent } from '../view-member-details/view-member-details.component';

@Component({
  selector: 'app-member-list',
  imports: [
    AvatarGroupModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    ReactiveFormsModule,
    TableComponent,
    TableModule,
    TagModule
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
  providers: [MessageService]
})
export class MemberListComponent implements OnInit {

  addressOptions: any [] = [];
  first = 0; 
  loading = false;
  memberships: MembershipResponse [] = [];
  membershipFilters: MembershipFilters | undefined;
  membershipStatuses: MembershipStatusResponse [] = [];
  membershipTypes: MembershipType [] = [];
  multiSelectButtonItems: MenuItem[] = [];
  organizationId: string | undefined | null = null;
  ref: DynamicDialogRef | undefined;
  roles: Role [] = [];  
  rowsPerPage = 10;  
  sortField = "member.firstName";
  sortOrder = 1;  
  table: Table<any> = { rows: [], columns: [] };
  tableFooterCountTitle = 'Member'
  title = 'Members';
  totalRecords = 0; 
  selectedMemberships: MembershipResponse [] = [];
  selectedMembershipStatuses: MembershipStatusResponse [] = [];
  session: Session | null = null;

  constructor(
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private membershipService: MembershipService,
    private membershipStatusService: MembershipStatusService,
    private membershipTypeService: MembershipTypeService,
    private roleService: RoleService,
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
          label: 'Edit Memberships',
          command: () => {
            this.editMemberships();
          }
      }
    ];
    const pageNo = this.first;
    this.populateTable(pageNo, this.rowsPerPage, this.sortField, this.sortOrder);
    this.session = this.sessionService.getSession();
    if(this.sessionService.getSession()?.organization?.organizationId) {
      this.organizationId = this.sessionService.getSession()?.organization?.organizationId;
    }
    this.getMembershipTypes();
    this.getRoles();
    this.getMembershipStatuses();
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
    //const memberEmail = eventFilters['member.email'][0].value;
    const membershipStatuses = this.selectedMembershipStatuses.map((filter: any) => filter.name);
    const membershipTypes = eventFilters['membershipType.name'][0].value;
    const membershipRoles = eventFilters['role.name'][0].value;

    const memberAddress =  eventFilters['member.memberAddress.city'][0].value;

    const memberMemberAddressCity = memberAddress && memberAddress.dataField !== 'member.memberAddress.country' ? memberAddress.value : null;
    const memberMemberAddressCountry = memberAddress && memberAddress.dataField === 'member.memberAddress.country' ? memberAddress.value : null;
        
    const filters = {
      memberFirstName: eventFilters['member.firstName'][0].value,
      memberEmail: null,
     // memberEmail: memberEmail,
      memberMemberAddressCity: memberMemberAddressCity,
      memberMemberAddressCountry: memberMemberAddressCountry,
      membershipStatusNames: membershipStatuses,
     // membershipStatusNames: membershipStatuses? membershipStatuses.map((filter: any) => filter.name) : null,
      membershipTypeNames: membershipTypes ? membershipTypes.map((filter: any) => filter.name) : null,
      roleNames:  membershipRoles ? membershipRoles.map((filter: any) => filter.name) : null,
      startDates:  eventFilters['startDate'][0].value,
      endDates:  eventFilters['endDate'][0].value,
    }
    this.membershipFilters = filters;
    this.sortField = "member.firstName";
    this.sortOrder = 1;
    this.populateTable(0, this.rowsPerPage, this.sortField, this.sortOrder);
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

  private editMemberships() {
    const organizationId = this.sessionService.organizationId;
    this.ref = this.dialogService.open(EditMultipleMembershipsComponent, {
      header: 'Edit Memberships',
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

  private getRoles() {
    this.roleService.getVisibleRoles().subscribe(
      (res) => {
        this.roles = res;
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

    const filters = this.membershipFilters ?? {} as MembershipFilters;

    this.membershipService.getMembershipsByOrganization(organizationId, pageNo, pageSize, sortField, order, filters).subscribe(
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
          headerFilterType: 'text',
          headerText: 'Name (status)',
          sortable: true,
          columnWidth: '15%'
        },
        // {
        //   dataField: 'member.email',
        //   dataType: 'string',
        //   colTemplateRefName: 'userFullnameColumn',
        //   headerFilterType: 'text',
        //   headerText: 'Email',
        //   sortable: true
        // },
        // {
        //   dataField: 'member.phoneNumber',
        //   dataType: 'string',
        //   colTemplateRefName: 'userFullnameColumn',
        //   headerText: 'Mobile Number',
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
          dataField: 'membershipType.name',
          dataType: 'string',
          headerFilterType: 'select',
          headerText: 'Membership Type',
          options: this.membershipTypes,
          sortable: true
        },
        {
          dataField: 'role.name',
          dataType: 'string',
          headerFilterType: 'select',
          headerText: 'Role',
          options: this.roles,
        },
        {
          dataField: 'startDate',
          dataType: 'templateRef',
          colTemplateRefName: 'startDateColumn',
          headerFilterType: 'customDate',
          headerText: 'Membership Start Date',
          sortable: true
        },
        {
          dataField: 'endDate',
          dataType: 'templateRef',
          colTemplateRefName: 'endDateColumn',
          headerFilterType: 'customDate',
          headerText: 'Membership End Date',
          sortable: true
        },
        {
          dataField: 'editMembership',
          dataType: 'templateRef',
          colTemplateRefName: 'editMembershipColumn',
          headerText: 'Details/Edit Membership'
        },
      ],
      rows: this.memberships,
      sortField: 'member.firstName',
    };
  }

  

}
