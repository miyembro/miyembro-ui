import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe takes a (FormControl or FormGroup) errors object and an optional fieldname array object
 * It will return an error message based on the properties in the errors object.
 */
@Pipe({
  name: 'formErrors',
  standalone: true
})
export class FormErrorsPipe implements PipeTransform {
  transform(errors: { [error: string]: any } | null, fieldName: string | string[]): string {
    if (errors) {
      const errorMessage = this.getError(errors, fieldName);
      return errorMessage;
    } else {
      return '';
    }
  }

  private getError(errors: { [error: string]: any }, fieldName: string | string[]): string {
    let errorMessage = '';

    if (typeof fieldName === 'string') {
      fieldName = [fieldName];
    }

    if (errors['required'] || errors['whitespace']) {
      errorMessage = `The ${fieldName[0]} field is required.`;
    } else if (errors['email']) {
      errorMessage = 'Incorrect email format.';
    } else if (errors['startDateGreaterThanEndDate']) {
      errorMessage = `${fieldName[0]} must be before ${fieldName[1]}.`;
    } else if (errors['startDateGreaterThanRegularizationDate']) {
      errorMessage = `${fieldName[0]} must be before ${fieldName[1]}.`;
    } else if (errors['passwordNotMatch']) {
      errorMessage = `Entered password didn't match.`;
    } else if (errors['minlength']) {
      errorMessage = `Minimum characters required (${errors['minlength'].requiredLength}).`;
    } else if (errors['incorrectPasswordFormat']) {
      errorMessage = 'Password must contain at least one lowercase, one uppercase, and one number or one special character. Must not have whitespace.';
    } else {
      errorMessage = 'Unhandled Error.';
    }

    return errorMessage;
  }
}
