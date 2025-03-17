import { Component } from '@angular/core';
import { MemberListComponent } from '../member-list/member-list.component';
import { TabsModule } from 'primeng/tabs';
import { MemberJoinRequestsComponent } from '../member-join-requests/member-join-requests.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-member-page',
  imports: [
    CommonModule,
    MemberListComponent,
    MemberJoinRequestsComponent,
    FormsModule,
    SelectButtonModule,
    TabsModule
  ],
  templateUrl: './member-page.component.html',
  styleUrl: './member-page.component.scss'
})
export class MemberPageComponent {

  selectedTab = 'members';
  tabOptions: any[] = [
    { label: 'Members', value: 'members', icon: 'pi pi-users mr-1', },
    { label: 'Requests', value: 'requests', icon: 'pi pi-user-plus mr-1', }
  ];

}
