import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { SessionService } from 'src/app/core/services/session.service';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { OrganizationAboutUsComponent } from '../organization-about-us/organization-about-us.component';
import { OrganizationEventsComponent } from '../organization-events/organization-events.component';
import { OrganizationPhotosComponent } from '../organization-photos/organization-photos.component';
import { OrganizationMembershipComponent } from '../organization-membership/organization-membership.component';
import { OrganizationCollapsingHeaderComponent } from "../organization-collapsing-header/organization-collapsing-header.component";
import { MembershipResponse } from 'src/app/core/models/membership-response';

@Component({
  selector: 'app-organization',
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    OrganizationAboutUsComponent,
    OrganizationCollapsingHeaderComponent,
    OrganizationEventsComponent,
    OrganizationMembershipComponent,
    OrganizationPhotosComponent,
    TabsModule
  ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent implements OnInit {
  
  @Input() isMyOrganization = false;
  @Input() membership: MembershipResponse | null = null;
  @Input() organization: OrganizationResponse | null = null;

  activeTab: WritableSignal<string> = signal('0');

  isEditAllowed = false;

  constructor( 
    private sessionService: SessionService
  ) {

  }

  ngOnInit(): void {
    this.isEditAllowed = this.isMyOrganization && (this.sessionService.getSession()?.role.name === 'Admin' || this.sessionService.getSession()?.role.name === 'Super Admin');
  }

}
