import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Member } from 'src/app/core/models/member';
import { DatePipe, Location } from '@angular/common';
import { MemberFormComponent } from '../../components/member-form/member-form.component';
import { MemberFormType } from 'src/app/core/models/member-form-type.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { dataURLToFile } from 'src/app/core/helpers/data-url-to-file';
import { MemberService } from 'src/app/core/services/member.service';

@Component({
  selector: 'app-additional-info-signup',
  imports: [ButtonModule, MemberFormComponent],
  templateUrl: './additional-info-signup.component.html',
  styleUrl: './additional-info-signup.component.scss',
  providers: [DatePipe]
})
export class AdditionalInfoSignupComponent {

  member: Member | undefined;
  memberForm: FormGroup; 
  MemberFormType = MemberFormType;

  constructor(
    private alertService: AlertService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private location: Location, 
    private memberService: MemberService,

    private router: Router,
  ) {
    this.memberForm = this.formBuilder.group({
      memberId: [null],
      firstName: [null],
      lastName: [null],
      email: [null],
      password: [null],
      phoneNumber: [null, Validators.required],
      profilePicUrl: [null],
      birthDate: [null, Validators.required],
      loginType: [null],
      memberAddress: this.formBuilder.group({
        street: [null],
        city: [null, Validators.required],
        provinceState: [null, Validators.required],
        postalCode: [null],
        country: [null, Validators.required]
      })
    });
  }

  ngOnInit(): void {
    const state = this.location.getState() as { member?: Member };
    if (state && state.member) {
      this.member = state.member;
    }
  }

  onClickRegisterAdditionalInfo() {
    const birthDate: Date = this.memberForm.controls['birthDate'].value;

    const formattedBirthDate = this.datePipe.transform(birthDate, 'yyyy-MM-dd');

    const memberRequest = { ...this.memberForm.value };
    memberRequest.birthDate = formattedBirthDate;

    const formData = new FormData();
    let profilePicImage = null;
    if(this.member?.profilePicUrl !== memberRequest.profilePicUrl) {
      profilePicImage = dataURLToFile(memberRequest.profilePicUrl, "profile-pic");
      memberRequest.profilePicUrl = null;
    }

    if (profilePicImage) {
      formData.append('profilePicImage', profilePicImage);
    }
   
    formData.append('additionalInfoRequest', JSON.stringify({
      memberRequest: memberRequest
    }));

    this.memberService.updateMemberAfterRegistration(memberRequest.memberId, formData).subscribe(
      (res) => {
        this.router.navigate(['/login']);
        this.alertService.success('/additional-info-signup', 'Success', "Succesfully added details. You can now login");
      },
      (err: any) => {
        this.alertService.error('/login', 'Error', err.error.message);
      }
    );
  }

  onSkipAdditionalInfo() {
    this.router.navigate(['/login']);
  }
}
