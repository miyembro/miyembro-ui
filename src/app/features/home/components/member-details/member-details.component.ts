import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { Member } from 'src/app/core/models/member';
import { Role } from 'src/app/core/models/role';

@Component({
  selector: 'app-member-details',
  imports: [AvatarModule, CommonModule],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss'
})
export class MemberDetailsComponent implements OnChanges{
 
  @Input() member: Member | undefined;
  @Input() role: Role | undefined;
  @Input() showAvatar = true;

  profilePicUrl: string | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['member'] && this.member) {
      this.profilePicUrl = `${this.member.profilePicUrl}?v=${new Date().getTime()}`;
    }
  }

}
