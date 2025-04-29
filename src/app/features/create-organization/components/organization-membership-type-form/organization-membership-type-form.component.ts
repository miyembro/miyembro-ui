import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';
import { FormErrorsFilterPipe } from 'src/app/shared/pipes/form-errors-filter.pipe';
import { FormErrorsPipe } from 'src/app/shared/pipes/form-errors.pipe';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MembershipTypeValidity } from '../../../../core/models/membership-type-validity';
import { SelectModule } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-organization-membership-type-form',
  templateUrl: './organization-membership-type-form.component.html',
  styleUrls: ['./organization-membership-type-form.component.scss'],
  imports: [
    AlertComponent,
    ButtonModule,
    CardModule,
    CommonModule,
    DividerModule,
    FloatLabel,
    FormErrorsFilterPipe,
    FormErrorsPipe,
    FormsModule,
    IftaLabelModule,
    InputNumberModule,
    InputTextModule,
    PasswordModule,
    RadioButtonModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
    ToastModule,
    TooltipModule
  ],
})
export class OrganizationMembershipTypeFormComponent {
  
  @Input() membershipTypeValidities: MembershipTypeValidity [] = [];
  @Input() organizationMembershipTypesForm: FormGroup = new FormGroup({});
   
  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  get membershipTypes(): FormArray {
    return this.organizationMembershipTypesForm.get('membershipTypes') as FormArray;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.organizationMembershipTypesForm.controls;
  }

  get fgErrors(): { [key: string]: ValidationErrors } | null {
    return this.organizationMembershipTypesForm.errors;
  }

  addMembershipType(): void {
    this.membershipTypes.push(this.createMembershipType(false));
  }

  removeMembershipType(index: number): void {
    if (this.membershipTypes.length > 1) {
      const isDefault = this.membershipTypes.at(index).get('isDefault')?.value;
      this.membershipTypes.removeAt(index);

      // If the removed membership was default, set another one as default
      if (isDefault) {
        this.membershipTypes.at(0).get('isDefault')?.setValue(true);
      }
    } else {
      alert('At least one membership type is required.');
    }
  }

  setDefaultType(index: number): void {
    this.membershipTypes.controls.forEach((control, i) => {
      control.get('isDefault')?.setValue(i === index);
    });
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
