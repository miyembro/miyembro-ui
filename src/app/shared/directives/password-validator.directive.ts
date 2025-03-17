import { FormGroup, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export function passwordValidator(password: string, confirmPassword: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const passwordControl = group.get(password);
    const confirmPasswordControl = group.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null; // Return null if controls are not found
    }

    const passwordValue = passwordControl.value;
    const confirmPasswordValue = confirmPasswordControl.value;

    if (passwordValue !== confirmPasswordValue) {
      confirmPasswordControl.setErrors({ passwordNotMatch: true });
      return { passwordNotMatch: true };
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  };
}
