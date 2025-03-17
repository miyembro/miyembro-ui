import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';

@Component({
  selector: 'app-organization-information',
  imports: [
    AvatarGroupModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    CommonModule
  ],
  templateUrl: './organization-information.component.html',
  styleUrl: './organization-information.component.scss'
})
export class OrganizationInformationComponent {

  @Input() selectedOrganization: OrganizationResponse | null = null;

}
