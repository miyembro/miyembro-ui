import { Component, Input } from '@angular/core';
import { Address } from '../../../core/models/address';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MembershipResponse } from 'src/app/core/models/membership-response';

@Component({
  selector: 'app-contact-details',
  imports: [ButtonModule, CommonModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})
export class ContactDetailsComponent {

  @Input() address: Address | undefined;
  @Input() email: string | undefined;
  @Input() phoneNumber: string | undefined;
  @Input() showEmail = false;
  @Input() showTitleHeader = false;
  @Input() textSize = 'normal';
  @Input() websiteUrl: string | undefined;
  @Input() showMembership = false;
  @Input() membership: MembershipResponse | undefined;


}
