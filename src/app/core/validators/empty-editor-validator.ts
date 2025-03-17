import { AbstractControl, ValidatorFn } from '@angular/forms';

export function emptyEditorValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value?.trim(); 

    // Check if the value is empty or contains only an empty paragraph
    if (!value || value === '<p></p>' || value === '<p><br></p>') {
      return { required: true }; // Mark as invalid
    }
    return null; // Valid
  };
}