import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { timer } from 'rxjs';

@Component({
  selector: 'app-session-warning',
  imports: [
    ButtonModule,
    CommonModule
  ],
  templateUrl: './session-warning.component.html',
  styleUrl: './session-warning.component.scss',
})
export class SessionWarningComponent {
  formattedTime = '0:30';
  private seconds : any ;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
  ) {
    this.seconds = this.config.data.seconds;
    timer(0, 1000).subscribe(() => {
      this.seconds--;
      const displaySeconds = this.seconds % 60;
      const displayMinutes = Math.floor(this.seconds / 60);
      
      this.formattedTime = 
        `${displayMinutes}:${displaySeconds.toString().padStart(2, '0')}`;
      
      if (this.seconds <= 0) this.ref.close(false);
    });
  }

  onContinue(): void {
    this.ref.close(true);
  }

  onLogout(): void {
    this.ref.close(false);
  }
}
