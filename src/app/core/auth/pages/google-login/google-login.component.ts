import { Component, OnInit } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { SessionService } from '../../../services/session.service';
import { GoogleRequest } from 'src/app/core/models/google-request';

@Component({
  selector: 'app-google-login',
  imports: [ProgressSpinnerModule],
  templateUrl: './google-login.component.html',
  styleUrl: './google-login.component.scss'
})
export class GoogleLoginComponent implements OnInit {

  loginErrorMessage: string | null = null;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private sessionService: SessionService,
    private alertService: AlertService,
    private oauthService: OAuthService
  ) {
  }

  ngOnInit() {
    this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.tryLogin().then(() => {
        const accessToken = this.oauthService.getAccessToken();
        const idToken = this.oauthService.getIdToken();
        this.onTokenCaptured(accessToken, idToken);
      }).catch((error) => {
        this.router.navigate(['/login']);
      });
    });
  }

  private onClickLoginGoogleContinue(googleToken: string) {
    const googleLoginRequest: GoogleRequest = {
      googleToken: googleToken
    };

    this.authenticationService.loginWithGoogle(googleLoginRequest).subscribe(
      (res) => {
        this.sessionService.setSession(res);  
        this.successFulLogin();
      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
        this.alertService.error('/login', 'Error', err.error.message);
      }
    );
  }

  private onTokenCaptured(accessToken: string, idToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('id_token', idToken);
    if (idToken) {
      this.onClickLoginGoogleContinue(idToken);  // Send the ID token to the backend for processing
    }
  }
 
  private successFulLogin() {
    const numberOfJoinedOrganizations: number | undefined = this.sessionService.getSession()?.organizationIdsOfMember?.length;
    if (numberOfJoinedOrganizations && numberOfJoinedOrganizations > 1) {
      this.router.navigate(['/choose-organization']);
    } else {
      const session = this.sessionService.getSession();
      if (session) {
        localStorage.setItem('authToken', session.accessToken);
      }
      this.alertService.success('/login', 'Success', 'Successfully logged in');
      this.router.navigate(['/home/explore']);  // Redirect after successful backend login
    }
  }

}
