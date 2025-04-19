import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventConfirmationStatus } from 'src/app/core/models/event-confirmation-status.enum';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-confirmation-select-button',
  imports: [
    CommonModule,
    FormsModule,
    SelectButtonModule,
  ],
  templateUrl: './event-confirmation-select-button.component.html',
  styleUrl: './event-confirmation-select-button.component.scss',
})
export class EventConfirmationSelectButtonComponent implements OnInit, OnChanges {

  @Input() eventConfirmationStatus: EventConfirmationStatus | undefined; 
  @Output() eventConfirmationStatusChange = new EventEmitter<EventConfirmationStatus>();
  @Output() eventConfirmationChange = new EventEmitter<EventConfirmationStatus>();

  eventConfirmationStatuses: any [] = [];
  selectButtonStyleClass = 'event-attendance-buttons';

  ngOnInit(): void {
    this.eventConfirmationStatuses = [
      { 
        label: 'Going', 
        value: EventConfirmationStatus.YES,
        icon: 'pi pi-check', 
      },
      { 
        label: 'Nope', 
        value: EventConfirmationStatus.NO,
        icon: 'pi pi-times',
      },
      { 
        label: 'Maybe', 
        value: EventConfirmationStatus.MAYBE ,
        icon: 'pi pi-question',
      }
    ]
  }

   ngOnChanges(changes: SimpleChanges): void {
      if (changes['eventConfirmationStatus'] && this.eventConfirmationStatus) {
        this.updateSelectButtonStyleClass();
      }
    }

  onChangeAttendance() {
    this.updateSelectButtonStyleClass();
    this.eventConfirmationStatusChange.emit(this.eventConfirmationStatus);
    this.eventConfirmationChange.emit(this.eventConfirmationStatus);
  }

  private updateSelectButtonStyleClass() {
    const value = this.eventConfirmationStatus;
    this.selectButtonStyleClass = 'event-attendance-buttons';
    switch (value) {
      case EventConfirmationStatus.YES:
        this.selectButtonStyleClass = this.selectButtonStyleClass + "-selectbutton-success";
        break;
      case EventConfirmationStatus.NO:
        this.selectButtonStyleClass = this.selectButtonStyleClass + "-selectbutton-danger";
        break;
      case EventConfirmationStatus.MAYBE:
        this.selectButtonStyleClass = this.selectButtonStyleClass + "-selectbutton-info";
        break;
      default:
        this.selectButtonStyleClass = this.selectButtonStyleClass + "";
        break;
    }
  }

}
