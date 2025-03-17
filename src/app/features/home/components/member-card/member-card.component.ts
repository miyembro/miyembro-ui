import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Menubar } from 'primeng/menubar';
import { Popover, PopoverModule } from 'primeng/popover';
import { Ripple } from 'primeng/ripple';
import { Session } from 'src/app/core/models/session';
import { MemberOtherDetailsComponent } from "../member-other-details/member-other-details.component";
import { MemberDetailsComponent } from "../member-details/member-details.component";
import { MembershipCardDetailsComponent } from "../../../../shared/components/membership-card-details/membership-card-details.component";
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-member-card',
  imports: [
    AvatarModule,
    BadgeModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    CommonModule,
    DividerModule,
    FloatLabelModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    Menubar,
    MemberDetailsComponent,
    MemberOtherDetailsComponent,
    MembershipCardDetailsComponent,
    PopoverModule,
    Ripple,
    RouterModule
  ],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent {

  @Input() session: Session | null = null;
  @Output() logout = new EventEmitter<void>();
  @ViewChild('op') popover!: Popover;

  items: MenuItem[] | undefined;
  

  constructor(
    private router: Router
  ) {
    
  }

  goToCreateOrganization() {
    const exists = this.items?.some(item => item.label === 'Create Organization');
    if (!exists) {
        this.items = [...this.items || [], {
            label: 'Create Organization',
            icon: 'pi pi-user',
            route: '/create-organization'
        }];
    }
    this.router.navigate(['/create-organization']);  
  }

  onClickLogout() {
    this.logout.emit(); // Emit event when logout is clicked
    this.popover.hide(); // Close the popover after logout
  }

  editDetails() {
    this.router.navigate(['/edit-member-details']);
  }

  togglePopover(event: Event) {
    this.popover.toggle(event);
  }
 
}

