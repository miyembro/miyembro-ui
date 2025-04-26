import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../services/session.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../../services/authentication.service';
import { SelectOrganizationLoginRequest } from 'src/app/core/models/select-login-organization-request';
import { Session } from 'src/app/core/models/session';
import { AlertService } from 'src/app/core/services/alert.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { Skeleton } from 'primeng/skeleton';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-choose-organization',
  imports: [
    CardModule,  
    CommonModule, 
    FormsModule, 
    ListboxModule,
    Skeleton
  ],
  templateUrl: './choose-organization.component.html',
  styleUrl: './choose-organization.component.scss'
})
export class ChooseOrganizationComponent implements OnInit{

  loading = false;
  loginErrorMessage: string | null = null;
  organizations: OrganizationResponse [] = [];
  selectedOrganization: OrganizationResponse | undefined;
  session: Session | null = null;

  constructor(
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private loaderService: LoaderService,
    private organizationService: OrganizationService,
    private router: Router,
    private sessionService: SessionService,
  ) {
    
  }
  ngOnInit(): void {
    this.session = this.sessionService.getSession();
    this.getMemberOrganization();
  }

  onSelectOrganization(event: any) {
    this.loaderService.showLoader(this.router.url, false);

    const memberId = this.sessionService.getSession()?.member.memberId;
    const selectOrganizationLoginRequest: SelectOrganizationLoginRequest = {
        organizationId: this.selectedOrganization?.organizationId ?? null,
        memberId: memberId ?? null
    }
    this.authenticationService.selectLoginOrganization(selectOrganizationLoginRequest).subscribe(
      (res) => {
        this.sessionService.setSession(res);
        const session = this.sessionService.getSession();
        if(session) {
          localStorage.setItem('authToken', session.accessToken);
        }
        this.loaderService.hideLoader(this.router.url);
        this.router.navigate(['/home/explore']);
        this.alertService.success('/login', 'Success', 'Succefully Login');
      },
      (err: any) => {
        this.loaderService.hideLoader(this.router.url);
        this.loginErrorMessage = err.error ? err.error.message :   err.message;      
      }
    );
  }

  private getMemberOrganization() {
    this.loading = true;
    const memberId = this.sessionService.getSession()?.member?.memberId;
    this.organizationService.getOrganizationsByMemberId(memberId).subscribe(
      (res) => {
        this.loading = false;
        this.organizations = res;
      },
      (err: any) => {
        this.loading = false;
        this.loginErrorMessage = err.error ? err.error.message :   err.message;
      }
    );
  }

}
