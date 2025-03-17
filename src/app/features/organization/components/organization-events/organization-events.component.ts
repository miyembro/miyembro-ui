import { Component, Input } from '@angular/core';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';

@Component({
  selector: 'app-organization-events',
  imports: [],
  templateUrl: './organization-events.component.html',
  styleUrl: './organization-events.component.scss'
})
export class OrganizationEventsComponent {
  
  @Input() organization: OrganizationResponse | null = null;

}
