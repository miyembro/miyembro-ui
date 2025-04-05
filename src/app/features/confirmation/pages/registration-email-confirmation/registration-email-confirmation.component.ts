import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'src/app/core/services/confirmation.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationEmailConfirmationResponse } from 'src/app/core/models/registration-email-confirmation-response';
import { ConfirmationResultType } from 'src/app/core/models/confirmation-result-type.enum';

@Component({
  selector: 'app-registration-email-confirmation',
  imports: [CommonModule],
  templateUrl: './registration-email-confirmation.component.html',
  styleUrl: './registration-email-confirmation.component.scss',
})
export class RegistrationEmailConfirmationComponent implements OnInit {

  ConfirmationResultType = ConfirmationResultType;
  error = false;
  loading = false;
  memberId: string | undefined;
  registrationEmailConfirmationResponse: RegistrationEmailConfirmationResponse | undefined;

  constructor(
    private activatedRoute : ActivatedRoute, 
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const memberId = params.get('memberId');
      if (memberId) {
        this.memberId = memberId;
        this.confirmMemberEmail(memberId);
      } else {
        this.router.navigate(['**']);
      }
    });
  }


  continueToLogin() {
    this.router.navigate(['/login']);
  }

  onRetryConfirmMemberEmail() {
    if(this.memberId) {
      this.confirmMemberEmail(this.memberId);
    }
  }


  private confirmMemberEmail(memberId: string) {
    this.loading = true;
    this.error = false;
     
    this.confirmationService.confirmMemberEmail(memberId).subscribe({
      next: (response) => {
        this.registrationEmailConfirmationResponse = response;
        this.loading = false;
      },
      error: (error) => {
        // Log error details
        console.error('Confirmation failed:', error);
        this.loading = false;
        this.error = true;
      }
    });
  }
  
}
