import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { FormErrorsPipe } from 'src/app/shared/pipes/form-errors.pipe';
import { FloatLabelModule } from 'primeng/floatlabel';
import { City } from 'src/app/core/models/city';
import { State } from 'src/app/core/models/state';
import { IftaLabelModule } from 'primeng/iftalabel';
import { CountryService } from 'src/app/core/services/country.service';
import { Country } from 'src/app/core/models/country';
import { InputTextModule } from 'primeng/inputtext';

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
export class AddressFormComponent implements OnInit {

  @Input({ required: true }) addressForm!: FormGroup;

  cities: City[] = [];
  countries: Country[] = [];
  states: State[] = [];
  selectedCountry: string | null = null;
  selectedState: string | null = null;
  selectedCity: string | null = null;

  constructor(
    private countryService: CountryService
  ) { 
  }

  ngOnInit(): void {
   
    this.getCountries();

    this.addressForm.get('country')?.valueChanges.subscribe(selectedCountry => {
      if (selectedCountry) {
        this.selectedCountry = selectedCountry;
        this.getStates();
      } else {
        this.clearStatesAndCities();
      }
    });

    this.addressForm.get('provinceState')?.valueChanges.subscribe(selectedState => {
      if (selectedState) {
        this.selectedState = selectedState;
        this.getCities();
      } else {
        this.clearCities();
      }
    });

    // Check initial values
    const initialCountry = this.addressForm.get('country')?.value;
    if (initialCountry) {
      this.selectedCountry = initialCountry;
      this.getStates();
    }

    const initialState = this.addressForm.get('provinceState')?.value;
    if (initialState) {
      this.selectedState = initialState;
      this.getCities();
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

  private getCountries(): void {
    this.countryService.getCountries().subscribe(
      (res) => {
        this.countries = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private getStates(): void {
    const country = this.countries.find(c => c.name === this.selectedCountry);
    this.countryService.getStatesByCountry(country?.iso2).subscribe(
      (res) => {
        this.states = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private getCities(): void {
    const country = this.countries.find(c => c.name === this.selectedCountry);
    const state = this.states.find(s => s.name === this.selectedState);
    this.countryService.getCitiesByStateAndCountry(country?.iso2, state?.iso2).subscribe(
      (res) => {
        if (res.length === 0) {
          this.getCitiesByCountry();
        } else {
          this.cities = res;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private getCitiesByCountry(): void {
    const country = this.countries.find(c => c.name === this.selectedCountry);
    this.countryService.getCitiesByCountry(country?.iso2).subscribe(
      (res) => {
        this.cities = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  private clearStatesAndCities(): void {
    this.states = [];
    this.cities = [];
    this.addressForm.get('provinceState')?.setValue(null);
    this.addressForm.get('city')?.setValue(null);
    this.selectedState = null;
    this.selectedCity = null;
  }

  private clearCities(): void {
    this.cities = [];
    this.addressForm.get('city')?.setValue(null);
    this.selectedCity = null;
  }
}