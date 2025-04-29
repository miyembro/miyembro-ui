import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { OrganizationFormComponent } from "../../components/organization-form/organization-form.component";
import { OrganizationAddressFormComponent } from "../../components/organization-address-form/organization-address-form.component";
import { OrganizationMembershipTypeFormComponent } from "../../components/organization-membership-type-form/organization-membership-type-form.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { emptyEditorValidator } from 'src/app/core/validators/empty-editor-validator';
import { MembershipTypeService } from '../../../../core/services/membership-type.service';
import { MembershipTypeValidity } from '../../../../core/models/membership-type-validity';
import { OrganizationUploadImageComponent } from "../../components/organization-upload-image/organization-upload-image.component";
import { OrganizationRequest } from 'src/app/core/models/organization-request';
import { CreateOrganizationRequest } from 'src/app/core/models/create-organization-request';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { MembershipTypeRequest } from 'src/app/core/models/membership-type-request';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { Location } from '@angular/common';
import { dataURLToFile } from 'src/app/core/helpers/data-url-to-file';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { OrganizationFormType } from 'src/app/core/models/organization-form-type';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-create-organization-page',
  imports: [
    BackgroundComponent,
    ButtonModule,
    CommonModule,
    OrganizationAddressFormComponent,
    OrganizationFormComponent,
    OrganizationMembershipTypeFormComponent,
    OrganizationUploadImageComponent,
    ProgressBarModule,
    StepperModule,
    ToastModule
  ],
  templateUrl: './create-organization-page.component.html',
  styleUrl: './create-organization-page.component.scss'
})
export class CreateOrganizationPageComponent implements OnInit{
  
  loading = false;
  membershipTypeValidities: MembershipTypeValidity [] = [];
  organizationAddressForm: FormGroup;
  organizationForm: FormGroup;
  OrganizationFormType = OrganizationFormType;
  organizationImageFileForm: FormGroup;
  organizationMembershipTypesForm: FormGroup;

  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private location: Location,
    private membershipTypeService: MembershipTypeService,
    private organizationService: OrganizationService,
    private router: Router,
  ) {
    this.organizationForm = this.formBuilder.group({
      organizationId: [null],
      name: ['', Validators.required],
      description: ['', [emptyEditorValidator(), Validators.required]],
      logoUrl: [''],
      backgroundImageUrl: [''],
      email: ['', [Validators.email]],
      phoneNumber: [''],
      websiteUrl: ['',
        [
          Validators.pattern(
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
          )
        ]],
      organizationAddress: [null]
    });
    this.organizationAddressForm = this.formBuilder.group({
      organizationAddressId: [null],
      street: [''],
      city: ['', Validators.required],
      provinceState: ['', Validators.required],
      region: [''],
      postalCode: [''],
      country: ['', Validators.required]
    });
    this.organizationMembershipTypesForm = this.formBuilder.group({
      membershipTypes: this.formBuilder.array([this.createMembershipType(true)]) 
    });
    this.organizationImageFileForm = this.formBuilder.group({
      logoImage: [null, Validators.required],
      backgroundImage: [null, Validators.required]
    })
  }
  
  ngOnInit(): void {
    this.membershipTypeService.getAllMembershipTypeValidity().subscribe(
      (res) => {
        this.membershipTypeValidities = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  cancelCreateOrganization(){
    this.location.back();
  }

  createOrganization() {
    this.loading = true;
    this.loaderService.showLoader(this.router.url, false);
    const organizationFormVal  = this.organizationForm.value;
    const organizationAddressFormVal  = this.organizationAddressForm.value;

    const organization: OrganizationRequest = organizationFormVal;
    organization.organizationAddress = organizationAddressFormVal;
  
    const membershipTypes: MembershipTypeRequest [] = this.organizationMembershipTypesForm.controls['membershipTypes'].value;
    const logoImage: File | null = dataURLToFile(this.organizationImageFileForm.controls['logoImage'].value, "organization-logo");
    const backgroundImage: File | null = dataURLToFile(this.organizationImageFileForm.controls['backgroundImage'].value, "organization-background");

    const createOrganizationRequest: CreateOrganizationRequest = {
      organizationRequest: organization,
      membershipTypes: membershipTypes
    }

    const formData = new FormData();

    if(logoImage) {
      formData.append('logoImage', logoImage);
    }
    if(backgroundImage) {
      formData.append('backgroundImage', backgroundImage);
    }

    // Append JSON as a Blob (ensure correct key and structure)
    const jsonBlob = new Blob([JSON.stringify({
      organizationRequest: organization, 
      membershipTypes: membershipTypes
    })], { type: 'application/json' });

    formData.append('createOrganizationRequest', jsonBlob);
    this.organizationService.createOrganization(formData).subscribe(
      (res) => {
        this.loading = false;
        this.loaderService.hideLoader(this.router.url);
        this.router.navigate(['/home/explore']);
        this.alertService.success('/login', 'Success', 'Succefully Created Organization');
      },
      (err: any) => {
        this.loading = false;
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error('/login', 'Error', err);
      }
    );
  }

  private createMembershipType(isDefault= false): FormGroup {
    return this.formBuilder.group({
      membershipTypeId: [null],
      organizationId: [null],
      membershipTypeValidity: [null, Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      isDefault: [isDefault]
    });
  }

}
