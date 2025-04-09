import { AbstractControl, ValidationErrors } from '@angular/forms';

export function startDateBeforeEndDateValidator(endDateControlName: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null;

    const endDate = control.parent.get(endDateControlName)?.value;
    const startDate = control.value;

    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return start <= end ? null : { startDateAfterEndDate: true };
  };
}
