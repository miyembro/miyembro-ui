import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { OldEventsListComponent } from '../old-events-list/old-events-list.component';
import { ActiveEventsListComponent } from '../active-events-list/active-events-list.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-manage-events',
  imports: [
    ActiveEventsListComponent,
    CommonModule,
    FormsModule,
    OldEventsListComponent,
    SelectButtonModule,
    RouterModule,
],
  templateUrl: './manage-events.component.html',
  styleUrl: './manage-events.component.scss',
})
export class ManageEventsComponent {

  selectedTab = 'active';
  tabOptions: any[] = [
    { label: 'Active Events', value: 'active', icon: 'pi pi-calendar-plus mr-1', },
    { label: 'Old Events', value: 'old', icon: 'pi pi-calendar-minus mr-1', }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    // Sync tab state with initial route
    this.updateTabFromRoute();

    // Sync tab state on navigation changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTabFromRoute();
    });
  }

  private updateTabFromRoute() {
    const childPath = this.route.snapshot.firstChild?.routeConfig?.path;
    if (childPath === 'active' || childPath === 'old') {
      this.selectedTab = childPath;
    }
  }

  onTabChange(value: string) {
    this.router.navigate([value], { 
      relativeTo: this.route,
      replaceUrl: true // Preserve browser history integrity
    });
  }
}
