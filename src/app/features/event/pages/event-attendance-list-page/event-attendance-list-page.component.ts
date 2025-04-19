import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TagModule } from 'primeng/tag';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { EventComponent } from "../../components/event/event.component";
import { EventSummaryComponent } from "../../components/event-summary/event-summary.component";
import { Subscription } from 'rxjs';
import { EventAttendanceListConfirmedComponent } from '../../components/event-attendance-list-confirmed/event-attendance-list-confirmed.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { EventAttendanceListUnconfirmedComponent } from '../../components/event-attendance-list-unconfirmed/event-attendance-list-unconfirmed.component';

@Component({
  selector: 'app-event-attendance-list-page',
  imports: [
    AvatarModule,
    ButtonModule,
    CommonModule,
    DrawerModule,
    EventAttendanceListConfirmedComponent,
    EventAttendanceListUnconfirmedComponent,
    FormsModule,
    MultiSelectModule,
    RouterModule,
    SelectButtonModule,
    TableComponent,
    TagModule,
    EventComponent,
    EventSummaryComponent
],
  templateUrl: './event-attendance-list-page.component.html',
  styleUrl: './event-attendance-list-page.component.scss',
  providers: [DialogService]
})
export class EventAttendanceListPageComponent implements OnInit {

  eventId!: string;
  organizationId!: string;

  private routeSub!: Subscription;

  selectedTab = 'confirmed';
  tabOptions: any[] = [
    { label: 'Confirmed', value: 'confirmed', icon: 'pi pi-user-plus mr-1', },
    { label: 'Unconfirmed', value: 'unconfirmed', icon: 'pi pi-user mr-1', }
  ];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.paramMap.subscribe(params => {
      this.eventId = params.get('eventId')!;
      this.organizationId = params.get('organizationId')!;
    });
  }
}