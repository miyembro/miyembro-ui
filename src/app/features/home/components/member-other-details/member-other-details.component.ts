import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Member } from 'src/app/core/models/member';
import { ContactDetailsComponent } from 'src/app/shared/components/contact-details/contact-details.component';

@Component({
  selector: 'app-member-other-details',
  imports: [CommonModule, ContactDetailsComponent],
  templateUrl: './member-other-details.component.html',
  styleUrl: './member-other-details.component.scss'
})
export class MemberOtherDetailsComponent {

  @Input() member: Member | undefined;

  goToEditOrganizationAddress() {
    throw new Error('Method not implemented.');
  }

}
