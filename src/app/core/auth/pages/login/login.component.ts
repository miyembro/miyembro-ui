import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionService } from '../../../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { GoogleRequest } from 'src/app/core/models/google-request';
import { Session } from 'src/app/core/models/session';
import { LogoComponent } from "../../../../shared/components/logo/logo.component";
declare const google: any;

@Component({
  selector: 'app-login',
  imports: [ButtonModule, CardModule, CommonModule, IftaLabelModule, InputTextModule, FormsModule, PasswordModule, ReactiveFormsModule, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginErrorMessage: string | null = null;
  loginForm: FormGroup;

  private unsubscribe: Subject<any> = new Subject();
  private client: any;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private sessionService: SessionService,
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    // Replace your current Google client setup with this:
    google.accounts.id.initialize({
      client_id: '654581949282-dmvkqbivaa8rmvem7ipjbas30p5akkrm.apps.googleusercontent.com',
      callback: (response: any) => this.loginWithGoogle(response),
      ux_mode: 'popup', // or 'redirect' if preferred
      auto_select: true // Skips account selection if only 1 Google session exists
    });

    // Render the Google One Tap button
    google.accounts.id.renderButton(
        document.getElementById('google-login-button'), // HTML element ID in your template
        {
          type: 'standard', // Or 'icon' for a smaller button
          theme: 'filled_blue',
          size: 'large'
        }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(0);
    this.unsubscribe.complete();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.onClickRegister();
    }
  }

  onClickLogin() {
    const loginFormVal = this.loginForm.value;
    this.loginErrorMessage = null;
    this.authenticationService.login(loginFormVal).subscribe(
      (res) => {
        this.successFulLogin(res);
      },
      (err: any) => {
        this.errorLogin(err);
      }
    );
  }

  // onClickLoginWithGoogle() {
  //   if(this.client) {
  //     this.client.requestCode();
  //   }
  // }
  // Update your onClickLoginWithGoogle() method:
  onClickLoginWithGoogle() {
    google.accounts.id.prompt(); // Triggers One Tap UI
  }

  onClickRegister() {
    this.router.navigate(['/register']);
  }

  private errorLogin(error: any) {
    this.loginErrorMessage = error.error.message;
    this.alertService.error('/login', 'Error', error.error.message);
  }

  private loginWithGoogle(response: any) {
    console.log("Google login response", response);
    const googleToken = response.credential;

    
    const googleLoginRequest: GoogleRequest = {
      googleToken: googleToken
    };

    this.authenticationService.loginWithGoogle(googleLoginRequest).subscribe(
      (res) => {
        this.successFulLogin(res);
      },
      (err: any) => {
        this.errorLogin(err);
      }
    );
  }

  private successFulLogin(session: Session) {
    this.sessionService.setSession(session);  
    const numberOfJoinedOrganizations: number | undefined = this.sessionService.getSession()?.organizationIdsOfMember?.length;
    if (numberOfJoinedOrganizations && numberOfJoinedOrganizations > 1) {
      this.router.navigate(['/choose-organization']);
    } else {
      const session = this.sessionService.getSession();
      if (session) {
        localStorage.setItem('authToken', session.accessToken);
      }
      this.alertService.success(this.router.url, 'Success', 'Successfully logged in');
      this.router.navigate(['/home/explore']);  
    }
  }

}
