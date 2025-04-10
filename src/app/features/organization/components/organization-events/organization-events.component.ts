import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';

@Component({
  selector: 'app-organization-events',
  imports: [   
    ButtonModule, 
    CardModule,
    CommonModule
  ],
  templateUrl: './organization-events.component.html',
  styleUrl: './organization-events.component.scss'
})
export class OrganizationEventsComponent {
  
  @Input() isEditAllowed = false;
  @Input() organization: OrganizationResponse | null = null;

  constructor(
    private router: Router,
  ) {

  }

  goToCreateEvent() {
    this.router.navigate(['/create-event'], {
      state: { organizationId: this.organization?.organizationId }
    });
  }

}
