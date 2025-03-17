import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { City } from 'src/app/core/models/city';
import { State } from 'src/app/core/models/state';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { FormErrorsFilterPipe } from 'src/app/shared/pipes/form-errors-filter.pipe';
import { FormErrorsPipe } from 'src/app/shared/pipes/form-errors.pipe';
import { SelectModule } from 'primeng/select';
import { CountryService } from 'src/app/core/services/country.service';
import { OrganizationFormType } from 'src/app/core/models/organization-form-type';
import { Country } from 'src/app/core/models/country';
import { FloatLabelModule } from 'primeng/floatlabel';
import { OrganizationAddressResponse } from 'src/app/core/models/organization-address-response';

@Component({
  selector: 'app-organization-address-form',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DividerModule,
    FloatLabelModule,
    FormErrorsFilterPipe,
    FormErrorsPipe,
    FormsModule,
    IftaLabelModule,
    InputNumberModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
    ToastModule,
    TooltipModule
  ],
  templateUrl: './organization-address-form.component.html',
  styleUrl: './organization-address-form.component.scss'
})
export class OrganizationAddressFormComponent implements OnInit, OnChanges {

  @Input() formType: OrganizationFormType = OrganizationFormType.ADD_ORGANIZATION;
  @Input() organizationAddress : OrganizationAddressResponse | undefined;
  @Input() organizationAddressForm: FormGroup = new FormGroup({}); 
  @Output() organizationAddressFormChange = new EventEmitter<FormGroup>();

  cities: City [] = [];
  countries: Country [] = [];
  loginErrorMessage: string | null = null;
  selectedCity: string | null = null;
  selectedCountry: string | undefined;
  selectedState: string | null = null;
  states: State [] = [];

  constructor(
    private countrySevice: CountryService,
  ) {
    
  }

  ngOnInit() {
    this.patchForm();
    this.getCountries();
    this.organizationAddressForm.get('country')?.valueChanges.subscribe(selectedCountry => {
      if(selectedCountry) {
        this.selectedCountry = selectedCountry;
        this.getStates();
      } 
      this.states = [];
      this.cities = [];
      this.organizationAddressForm.get('provinceState')?.setValue(null);
      this.selectedState = null;
      this.organizationAddressForm.get('city')?.setValue(null);
      this.selectedCity = null;
    });
    this.organizationAddressForm.get('provinceState')?.valueChanges.subscribe(selectedState => {
      if(selectedState) {
        this.selectedState = selectedState;
        this.getCities();
      } 
      this.cities = [];
      this.organizationAddressForm.get('city')?.setValue(null);
      this.selectedCity = null;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['organizationAddress'] && this.organizationAddress) {
      this.patchForm();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.organizationAddressForm.controls;
  }

  get fgErrors(): { [key: string]: ValidationErrors } | null {
    return this.organizationAddressForm.errors;
  }
  
  emitForm() {
    this.organizationAddressFormChange.emit(this.organizationAddressForm);
  }

  getCities() {
    const country = this.countries.find((country) => country.name === this.organizationAddressForm.get('country')?.value);
    const state = this.states.find((state) => state.name === this.organizationAddressForm.get('provinceState')?.value);
    this.countrySevice.getCitiesByStateAndCountry(country?.iso2, state?.iso2 ).subscribe(
      (res) => {
        if(res.length == 0) {
          this.getCitiesByCountry();
        } else {
          this.cities = res;
        }
        if(this.formType === OrganizationFormType.UPDATE_ORGANIZATION) {
          this.patchCity();
        }
        this.setFormToPristine();
      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
      }
    );
  }

  getCitiesByCountry() {
    const country = this.countries.find((country) => country.name === this.organizationAddressForm.get('country')?.value);
    this.countrySevice.getCitiesByCountry(country?.iso2).subscribe(
      (res) => {
        this.cities = res;
        if(this.formType === OrganizationFormType.UPDATE_ORGANIZATION) {
          this.patchCity();
        }
        this.setFormToPristine();

      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
      }
    );
  }

  getCountries() {
    this.countrySevice.getCountries().subscribe(
      (res) => {
        this.countries = res;
        if(this.formType === OrganizationFormType.UPDATE_ORGANIZATION) {
          this.patchCountry();
          this.getStates();
        }
        const selectedCountry = this.organizationAddressForm.get('country')?.value; 
        if(selectedCountry !== null && selectedCountry !== null) {
          this.getStates();
        }
        this.setFormToPristine();
      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
      }
    );
  }

  getStates() {
    const iso2CountryCode = this.countries.find((country) => country.name === this.organizationAddressForm.get('country')?.value);
    this.countrySevice.getStatesByCountry(iso2CountryCode?.iso2).subscribe(
      (res) => {
        this.states = res;
        if(this.formType === OrganizationFormType.UPDATE_ORGANIZATION) {
          this.patchState();
          this.getCities();
        }
        const selectedCity = this.organizationAddressForm.get('city')?.value; 
        if(selectedCity !== null && selectedCity !== null) {
          this.getCities();
        }
        this.setFormToPristine();
      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
      }
    );
  }

  patchCity() {
    this.organizationAddressForm.get('city')?.setValue(this.organizationAddress?.city);
  }

  patchCountry() {
    this.organizationAddressForm.get('country')?.setValue(this.organizationAddress?.country);
  }

  patchState() {
    this.organizationAddressForm.get('provinceState')?.setValue(this.organizationAddress?.provinceState);
  }

  setFormToPristine() {
    if(this.formType === OrganizationFormType.UPDATE_ORGANIZATION) {
      this.organizationAddressForm.markAsPristine();
    }
  }

  private patchForm() {
    if(this.organizationAddress) {
      this.organizationAddressForm.patchValue({
        organizationAddressId: this.organizationAddress?.organizationAddressId,
        street: this.organizationAddress?.street,
        city: this.organizationAddress.city,
        provinceState: this.organizationAddress.provinceState,
        postalCode: this.organizationAddress.postalCode,
        country: this.organizationAddress.country
      });
    }
  }

}
