import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-event-list-page',
  imports: [
    CommonModule,
    SelectButtonModule
  ],
  templateUrl: './event-list-page.component.html',
  styleUrl: './event-list-page.component.scss',
})
export class EventListPageComponent {}
