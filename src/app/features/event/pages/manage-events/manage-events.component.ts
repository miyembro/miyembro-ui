import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { OldEventsListComponent } from '../old-events-list/old-events-list.component';
import { ActiveEventsListComponent } from '../active-events-list/active-events-list.component';

@Component({
  selector: 'app-manage-events',
  imports: [
    CommonModule,
    FormsModule,
    SelectButtonModule,
    ActiveEventsListComponent,
    OldEventsListComponent
],
  templateUrl: './manage-events.component.html',
  styleUrl: './manage-events.component.scss',
})
export class ManageEventsComponent {

  selectedTab = 'activeEvents';
  tabOptions: any[] = [
    { label: 'Active Events', value: 'activeEvents', icon: 'pi pi-calendar-plus mr-1', },
    { label: 'Old Events', value: 'oldEvents', icon: 'pi pi-calendar-minus mr-1', }
  ];
}
