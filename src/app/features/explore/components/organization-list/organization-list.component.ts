import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import {  Router } from '@angular/router';
import { SessionService } from 'src/app/core/services/session.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { JoinOrganizationRequest } from 'src/app/core/models/join-membership-request';
import { MembershipService } from 'src/app/core/services/membership.service';
import { OrganizationItemGridComponent } from '../organization-item-grid/organization-item-grid.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { OrganizationItemGridSkeletonComponent } from "../organization-item-grid-skeleton/organization-item-grid-skeleton.component";  // Import FormsModule here
import { OrganizationService } from 'src/app/core/services/organization.service';
import { MembershipResponse } from 'src/app/core/models/membership-response';

@Component({
  selector: 'app-organization-list',
  imports: [
    ButtonModule,
    CommonModule,
    DataViewModule,
    DialogModule,
    FormsModule,
    InfiniteScrollDirective,
    OrganizationItemGridComponent,
    OrganizationItemGridSkeletonComponent,
    SelectButtonModule,
    Tag
  ],
  templateUrl: './organization-list.component.html',
  styleUrl: './organization-list.component.scss'
})
export class OrganizationListComponent implements OnInit{


  @Input() searchName: string | null = null;
  @Input() selectedCity: string | null = null;
  @Input() selectedCountry: string | null = null;

  emptyMessage = " ";
  hasMore = true;
  layout = 'grid';
  loading = false;
  loginErrorMessage: string | null = null;
  membership: MembershipResponse | null = null;
  options = ['list', 'grid'];
  organizations: OrganizationResponse [] = [];
  page = 0; 
  selectedOrganization: OrganizationResponse | undefined;
  size = 10;
  visible = false;

  constructor(
    private alertService: AlertService,
    private membershipService: MembershipService,
    private organizationService: OrganizationService,
    private router: Router,
    private sessionService: SessionService,
  ) {
    
  }

  ngOnInit(): void {
    this.size = this.calculateDynamicSize();
    this.loadOrganizations(this.page, this.size);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchName'] && !changes['searchName'].firstChange) {
      this.searchOrganizationWithFilter();
    }
    if (changes['selectedCountry'] && !changes['selectedCountry'].firstChange) {
      this.searchOrganizationWithFilter();
    }
    if (changes['selectedCity'] && !changes['selectedCity'].firstChange) {
      this.searchOrganizationWithFilter();
    }
  }
  
  counterArray(): any[] {
    return Array(this.calculateDynamicSize());
  }

  getScrollContainer() {
    return document.querySelector('#home-body') as HTMLElement;
  }

  joinOrganization() {
    const session = this.sessionService.getSession();
    const joinOrganizationRequest: JoinOrganizationRequest = {
      organizationId: this.selectedOrganization?.organizationId,
      memberId: session?.member.memberId
    };

    this.membershipService.requestMembership(joinOrganizationRequest).subscribe(
      (res) => {
        this.visible = false;
        this.alertService.success('/home/explore', 'Success', 'Successfully sent the request to join the group');
      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
      }
    );
  }

  onClickOrganization(organization: OrganizationResponse | undefined) {
    
    this.selectedOrganization = organization;
    this.router.navigate(['/home/organization-details', this.selectedOrganization?.organizationId]);
    // this.visible = true;
    // this.getMembershipByMemberIdAndOrganizationId(organization);
  }

  onScroll(): void {
    if (this.loading || !this.hasMore) return;

    this.page++;

    this.size = this.calculateDynamicSize();

    this.loadOrganizations(this.page, this.size);
  }

  private calculateDynamicSize(): number {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;  
    if (screenWidth >= 1280) {  // XL screen (Large screens)
      return 24;  // Load 18 items for large screens
    } else if (screenWidth >= 1024) {  // LG screen (Large screens)
      return 18;  // Load 18 items for large screens
    } else if (screenWidth >= 768) {  // MD screen (Medium screens)
      return 12;  // Load 12 items for medium screens
    } else if (screenWidth >= 640) {  // SM screen (Small screens)
      return 10;  // Load 10 items for small screens
    } else {
      return 10;  // Default: Load 10 items for very small screens
    }
  }

  private loadOrganizations(page: number, size: number): void {
    this.loading = true; 
    this.organizationService.getOrganizations(page, size, this.searchName, this.selectedCountry, this.selectedCity).subscribe(
      (res) => {
        const newOrganizations = res.content.filter(org => !this.organizations.some(existingOrg => existingOrg.organizationId === org.organizationId));
        this.organizations = [...this.organizations, ...newOrganizations];
        this.loading = false;

        if (res.content.length === 0) {
          this.hasMore = false;  
        } else {
          this.hasMore = true;  
        }

        if(this.organizations.length == 0) {
          this.emptyMessage = "No results found";
        }
      },
      (err: any) => {
        this.loading = false;
        this.loginErrorMessage = err.error.message;
      }
    );
  }

  private searchOrganizationWithFilter() {
    if (!this.searchName || this.searchName.trim().length === 0) {
      this.searchName = null;
    }

    this.page = 0;
    this.organizations = [];
    this.hasMore = true; 

    this.loadOrganizations(this.page, this.size);
  }

}
