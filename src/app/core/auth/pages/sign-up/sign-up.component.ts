import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { TooltipModule } from 'primeng/tooltip';
import { passwordValidator } from 'src/app/shared/directives/password-validator.directive';
import { FormErrorsFilterPipe } from 'src/app/shared/pipes/form-errors-filter.pipe';
import { FormErrorsPipe } from 'src/app/shared/pipes/form-errors.pipe';
import { MemberRequest } from 'src/app/core/models/member-request';
import { GoogleRequest } from 'src/app/core/models/google-request';
import { LoginType } from 'src/app/core/models/login-type.enum';
import { Member } from 'src/app/core/models/member';
import { LogoComponent } from "../../../../shared/components/logo/logo.component";

@Component({
  selector: 'app-sign-up',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    FormErrorsFilterPipe,
    FormErrorsPipe,
    FormsModule,
    IftaLabelModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    TooltipModule,
    LogoComponent
],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {

  loginErrorMessage: string | null = null;
  signupForm: FormGroup;

  private client: any;

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  get fgErrors(): { [key: string]: ValidationErrors } | null {
      return this.signupForm.errors;
  }
    
  constructor(
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.signupForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.buildForm();
  }
 
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.onClickLogin();
    }
  }

  onClickLogin() {
    this.router.navigate(['/login']);
  }

  onClickSignup() {
    const loginFormVal = { ...this.signupForm.value };
    delete loginFormVal.confirmPassword;
    const memberRequest: MemberRequest = loginFormVal;
    this.authenticationService.register(memberRequest).subscribe(
      (res) => {
        this.successfulSignup(res);
      },
      (err: any) => {
        this.errorSignup(err);
      }
    );
  }

  onClickSignupWithGoogle() {
    if(this.client) {
      this.client.requestCode();
    } 
  }

  private buildForm() {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phoneNumber: [null],
      profilePicUrl: [null],
      loginType: [LoginType.NORMAL],
      confirmPassword: ['', Validators.required],
      memberAddress: [null]
    }, {
      validators: [
        passwordValidator('password', 'confirmPassword')
      ],
    });
    this.signupForm.reset();
  }
  
  private errorSignup(error: any) {
    this.loginErrorMessage = error.error.message;
    this.alertService.error('/signup', 'Error', error.error.message);
  }

  private successfulSignup(member: Member) {
    this.alertService.success('/signup', '', 'Succefully Registered');
    this.router.navigate(['/additional-info-signup'], {
      state: { member: member }
    });
  }

}
