import { Component, Input } from '@angular/core';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';
import { ContactDetailsComponent } from 'src/app/shared/components/contact-details/contact-details.component';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SessionService } from 'src/app/core/services/session.service';
import { OrganizationDescriptionComponent } from "../../../../shared/components/organization-description/organization-description.component";

@Component({
  selector: 'app-organization-about-us',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    ContactDetailsComponent,
    OrganizationDescriptionComponent
  ],
  templateUrl: './organization-about-us.component.html',
  styleUrl: './organization-about-us.component.scss'
})
export class OrganizationAboutUsComponent {

  @Input() organization: OrganizationResponse | null = null;
  @Input() isEditAllowed = false;

  constructor(
    private router: Router, 
    private sanitizer: DomSanitizer,
    private sessionService: SessionService
  ) {

  }

  goToEditOrganizationAddress() {
    this.router.navigate(['/edit-organization-address/', this.organization?.organizationId]);
  }

  goToEditOrganizationContactDetails() {
    this.router.navigate(['/edit-organization-contact-details/', this.organization?.organizationId]);
  }

  goToEditOrganizationDescription() {
    this.router.navigate(['/edit-organization-description/', this.organization?.organizationId]);
  }

 

}
