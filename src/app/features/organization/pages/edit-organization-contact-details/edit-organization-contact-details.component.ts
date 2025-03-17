import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { OrganizationFormComponent } from "../../../create-organization/components/organization-form/organization-form.component";
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { OrganizationFormType } from 'src/app/core/models/organization-form-type';

@Component({
  selector: 'app-edit-organization-contact-details',
  imports: [
    BackgroundComponent,
    ButtonModule,
    OrganizationFormComponent
  ],
  templateUrl: './edit-organization-contact-details.component.html',
  styleUrl: './edit-organization-contact-details.component.scss'
})
export class EditOrganizationContactDetailsComponent implements OnInit{

  formType: OrganizationFormType = OrganizationFormType.UPDATE_ORGANIZATION_CONTACT_DETAILS;
  loginErrorMessage: string | null = null;
  organizationForm: FormGroup;
  organizationId: string | null = null;
  organization: OrganizationResponse | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private location: Location,
    private organizationService: OrganizationService,
    private router: Router,
  ) {
    this.organizationForm = this.formBuilder.group({
      organizationId: [null],
      name: [null],
      description: [null],
      logoUrl: [null],
      backgroundImageUrl: [null],
      email: [null],
      phoneNumber: [null],
      websiteUrl: [null],
      organizationAddress: [null]
    });
  }

  ngOnInit(): void {
    this.organizationId = this.activatedRoute.snapshot.paramMap.get('organizationId');
    this.getOrganization();
  }

  cancelEditOrganizationContactDetails() {
    this.location.back();
  }

  updateOrganizationContactDetails() {
    this.loaderService.showLoader(this.router.url, false);
    if(this.organization) {
      this.organizationService.updateOrganization(this.organization.organizationId, this.organizationForm.value).subscribe(
        (res) => {
          this.organization = res;
          this.alertService.success(this.router.url, 'Success', "Succesfully udpated contact details");
          this.loaderService.hideLoader(this.router.url);
          this.location.back();
        },
        (err: any) => {
          this.loaderService.hideLoader(this.router.url);
          this.loginErrorMessage = err.error.message;
          this.alertService.error(this.router.url, 'Error', this.loginErrorMessage ? this.loginErrorMessage : '');

        }
      );
    }
  }

  private getOrganization() {
    this.organizationService.getMyOrganizationById(this.organizationId).subscribe(
      (res) => {
        this.organization = res;
        this.patchForm();
      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
        this.alertService.error(this.router.url, 'Error', this.loginErrorMessage ? this.loginErrorMessage : '');
      }
    );
  }

  patchForm() {
    this.organizationForm.patchValue({
      organizationId: this.organization?.organizationId,
      name: this.organization?.name,
      description: this.organization?.description,
      logoUrl: this.organization?.logoUrl,
      backgroundImageUrl: this.organization?.backgroundImageUrl,
      email: this.organization?.email,
      phoneNumber: this.organization?.phoneNumber,
      websiteUrl: this.organization?.websiteUrl,
      organizationAddress: this.organization?.organizationAddress
    })
  }


}
