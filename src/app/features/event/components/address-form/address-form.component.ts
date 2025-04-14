import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { FormErrorsPipe } from 'src/app/shared/pipes/form-errors.pipe';
import { FloatLabelModule } from 'primeng/floatlabel';
import { City } from 'src/app/core/models/city';
import { State } from 'src/app/core/models/state';
import { IftaLabelModule } from 'primeng/iftalabel';
import { CountryService } from 'src/app/core/services/country.service';
import { Country } from 'src/app/core/models/country';
import { InputTextModule } from 'primeng/inputtext';
import { EventFormType } from 'src/app/core/models/event-form-type';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    CommonModule,
    FloatLabelModule, 
    FormErrorsPipe,
    IftaLabelModule, 
    InputTextModule, 
    SelectModule, 
    ReactiveFormsModule,
    TooltipModule
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent implements OnInit, OnChanges {

  @Input() address: any | undefined; 
  @Input({ required: true }) addressForm!: FormGroup;
  @Input() formType: EventFormType = EventFormType.ADD_EVENT;

  cities: City[] = [];
  countries: Country[] = [];
  loginErrorMessage: string | null = null;
  states: State[] = [];
  selectedCountry: string | null = null;
  selectedState: string | null = null;
  selectedCity: string | null = null;

  EventFormType = EventFormType;

  constructor(
    private countryService: CountryService
  ) { 
  }
  
  ngOnInit(): void {
    this.getCountries();
    this.addressForm.get('country')?.valueChanges.subscribe(selectedCountry => {
      if(selectedCountry) {
        this.selectedCountry = selectedCountry;
        this.getStates();
      } 
      this.states = [];
      this.cities = [];
      this.addressForm.get('provinceState')?.setValue(null);
      this.selectedState = null;
      this.addressForm.get('city')?.setValue(null);
      this.selectedCity = null;
    });
    this.addressForm.get('provinceState')?.valueChanges.subscribe(selectedState => {
      if(selectedState) {
        this.selectedState = selectedState;
        this.getCities();
      } 
      this.cities = [];
      this.addressForm.get('city')?.setValue(null);
      this.selectedCity = null;
    });
    this.addressForm.valueChanges.subscribe(() => {
      //this.emitForm();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address'] && this.address) {
      this.patchForm();
    }
  }

  getControlErrors(controlName: string): ValidationErrors | null {
    const control = this.addressForm.get(controlName);
    return control ? control.errors : null;
  }

  isControlInvalidAndTouched(controlName: string): boolean {
    const control = this.addressForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  private getCities() {
    const country = this.countries.find((country) => country.name === this.selectedCountry);
    const state = this.states.find((state) => state.name === this.selectedState);
    this.countryService.getCitiesByStateAndCountry(country?.iso2, state?.iso2 ).subscribe(
      (res) => {
        
        if(res.length == 0) {
          this.getCitiesByCountry();
        } else {
          this.cities = res;
        }
        if(this.formType === EventFormType.UPDATE_EVENT) {
          this.patchCity();
        }
        this.setFormToPristine();
      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
      }
    );
  }

  private getCitiesByCountry() {
    const country = this.countries.find((country) => country.name === this.selectedCountry);
    this.countryService.getCitiesByCountry(country?.iso2).subscribe(
      (res) => {
        this.cities = res;
        if(this.formType === EventFormType.UPDATE_EVENT) {
          this.patchCity();
        }
      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
      }
    );
  }

  private getCountries() {
    this.countryService.getCountries().subscribe(
      (res) => {
        this.countries = res;
        if(this.formType === EventFormType.UPDATE_EVENT) {
          this.patchCountry();
          this.getStates();
        }
        this.setFormToPristine();
      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
      }
    );
  }

  private getStates() {
    const iso2CountryCode = this.countries.find((country) => country.name === this.selectedCountry);
    this.countryService.getStatesByCountry(iso2CountryCode?.iso2).subscribe(
      (res) => {
        this.states = res;
        if(this.formType === EventFormType.UPDATE_EVENT) {
          this.patchState();
          this.getCities();
        }
        this.setFormToPristine();
      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
      }
    );
  }

  private patchCity() {
    if(this.address) {
      this.addressForm.get('city')?.setValue(this.address?.city);
    }
  }

  private patchCountry() {
    if(this.address) {
      this.addressForm.get('country')?.setValue(this.address.country);
    }
  }

  private patchForm() {
    if (this.address) {
      this.addressForm.patchValue({
        memberAddress: {
          street: this.address?.street,
          city: this.address?.city,
          provinceState: this.address?.provinceState,
          postalCode: this.address?.postalCode,
          country: this.address?.country
        }
      });
      this.selectedCountry = this.address?.country;
      this.selectedState = this.address?.provinceState;
      this.selectedCity = this.address?.city;
    }
  }

  private patchState() {
    if(this.address) {
      this.addressForm.get('provinceState')?.setValue(this.address?.provinceState);
    }
  }

  private setFormToPristine() {
    if(this.formType === EventFormType.UPDATE_EVENT) {
      this.addressForm.markAsPristine();
    }
  }

}