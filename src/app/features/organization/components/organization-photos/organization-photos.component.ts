import { Component, Input } from '@angular/core';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';

@Component({
  selector: 'app-organization-photos',
  imports: [],
  templateUrl: './organization-photos.component.html',
  styleUrl: './organization-photos.component.scss'
})
export class OrganizationPhotosComponent {

  @Input() organization: OrganizationResponse | null = null;
  

}
