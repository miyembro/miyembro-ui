import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EventItemGridComponent } from '../event-item-grid/event-item-grid.component';
import { EventSummaryResponse } from 'src/app/core/models/event-summary-response';
import { EventFilters } from 'src/app/core/models/event-filters';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-event-list',
  imports: [
    ButtonModule,
    CommonModule,
    DataViewModule,
    EventItemGridComponent,
    FormsModule,
    InfiniteScrollDirective
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent implements OnInit, OnChanges{

  @Input() organizationId: string | undefined;
  @Input() isOnline: boolean | null = null;
  @Input() searchName: string | null = null;
  @Input() selectedCity: string | null = null;
  @Input() selectedCountry: string | null = null;

  events: EventSummaryResponse [] = [];
  page = 0; 
  size = 6;
  eventFilters : EventFilters | undefined;
  hasMore = true;
  loading = false;

  constructor(
    private alertService: AlertService,
    private eventService: EventService,
    private loaderService: LoaderService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.size = this.calculateDynamicSize();
    this.loadEvents(this.page, this.size);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('sdadas');
  }

  onClickEvent(event: EventSummaryResponse | undefined) {
    this.router.navigate(['/home/event-details'], {
      state: { eventId: event?.eventId }
    });
  }

  onScroll(): void {
    if (this.loading || !this.hasMore) return;

    this.page++;

    this.size = this.calculateDynamicSize();

    this.loadEvents(this.page, this.size);
  }
  
  getScrollContainer() {
    return document.querySelector('#home-body') as HTMLElement;
  }
  
  private calculateDynamicSize(): number {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;  
    if (screenWidth >= 1280) {  // XL screen (Large screens)
      return 16;  // Load 18 items for large screens
    } else if (screenWidth >= 1024) {  // LG screen (Large screens)
      return 12;  // Load 18 items for large screens
    } else if (screenWidth >= 768) {  // MD screen (Medium screens)
      return 10;  // Load 12 items for medium screens
    } else if (screenWidth >= 640) {  // SM screen (Small screens)
      return 6;  // Load 10 items for small screens
    } else {
      return 6;  // Default: Load 10 items for very small screens
    }
  }

  private loadEvents(pageNo: number, pageSize: number) : void {
    this.loading = true; 

    this.loaderService.showLoader(this.router.url, false);
    const sortField = "startEventDate";
    const sortOrder = "ASC"; 
    this.eventFilters = {
      name: this.searchName,
      isOnline: this.isOnline,
      eventEventAddressCity: this.selectedCity,
      eventEventAddressCountry: this.selectedCountry,
      startEventDate: null,
      endEventDate: null
    }
    
    this.eventService.getEventsByOrganizationIdPage(this.organizationId, pageNo, pageSize, sortField, sortOrder, this.eventFilters).subscribe(
      (res) => {
        console.log(res);
        const newEvents = res.content.filter(event => !this.events.some(existingEvent => existingEvent.eventId === event.eventId));
        this.events = [...this.events, ...newEvents];
        if (res.content.length === 0) {
          this.hasMore = false;  
        } else {
          this.hasMore = true;  
        }
        this.loading = false;
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        console.log(err);
        this.loading = false;
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error(this.router.url, 'Error', err.error.message);
      }
    );
  }

}