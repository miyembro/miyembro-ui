import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';
import { OrganizationAddressFormComponent } from 'src/app/features/create-organization/components/organization-address-form/organization-address-form.component';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { OrganizationFormType } from 'src/app/core/models/organization-form-type';
import { AlertService } from 'src/app/core/services/alert.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-organization-address',
  imports: [
    BackgroundComponent,
    ButtonModule,
    OrganizationAddressFormComponent,
    ProgressBarModule,
    ToastModule
  ],
  templateUrl: './edit-organization-address.component.html',
  styleUrl: './edit-organization-address.component.scss'
})
export class EditOrganizationAddressComponent  implements OnInit{

  loading = false;
  loginErrorMessage: string | null = null;
  organizationAddressForm: FormGroup;
  organizationId: string | null = null;
  organization: OrganizationResponse | undefined;
  OrganizationFormType = OrganizationFormType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private location: Location,
    private organizationService: OrganizationService,
    private router: Router,
  ) {
    this.organizationAddressForm = this.formBuilder.group({
      organizationAddressId: [null],
      street: [''],
      city: ['', Validators.required],
      provinceState: ['', Validators.required],
      region: [''],
      postalCode: [''],
      country: ['', Validators.required]
    });
    
  }


ngOnInit(): void {
  this.organizationId = this.activatedRoute.snapshot.paramMap.get('organizationId');
  this.getOrganization();
}

cancelEditOrganizationAddress() {
  this.location.back();
}

updateOrganizationAddress() {
  this.loading =  true;
  if(this.organization) {
    const organization = JSON.parse(JSON.stringify(this.organization)); // Deep copy
    organization.organizationAddress = this.organizationAddressForm.value; 
    this.organizationService.updateOrganization(organization.organizationId, organization).subscribe(
      (res) => {
        this.organization = res;
        this.alertService.success('/edit-organization-address', 'Success', "Succesfully udpated address");

        this.location.back();
      },
      (err: any) => {
        this.loading = false;
        this.loginErrorMessage = err.error ? err.error.message :   err.message;      
      }
    );
  }
}

private getOrganization() {
  this.organizationService.getMyOrganizationById(this.organizationId).subscribe(
    (res) => {
      this.organization = res;
    },
    (err: any) => {
      this.loading = false;
      this.loginErrorMessage = err.error ? err.error.message :   err.message;    
    }
  );
}




}

