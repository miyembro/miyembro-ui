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
    console.log(errors);
    if (typeof fieldName === 'string') {
      fieldName = [fieldName];
    }

    if (errors['required'] || errors['whitespace']) {
      errorMessage = `The ${fieldName[0]} is required.`;
    } else if (errors['email']) {
      errorMessage = 'Incorrect email format.';
    } else if (errors['startDateGreaterThanEndDate']) {
      errorMessage = `${fieldName[0]} must be before ${fieldName[1]}.`;
    } else if (errors['startDateAfterEndDate']) {
      errorMessage = `Start Date must be before End Date`;
    } else if (errors['startDateGreaterThanRegularizationDate']) {
      errorMessage = `${fieldName[0]} must be before ${fieldName[1]}.`;
    } else if (errors['passwordNotMatch']) {
      errorMessage = `Entered password didn't match.`;
    } else if (errors['minlength']) {
      errorMessage = `Minimum characters required (${errors['minlength'].requiredLength}).`;
    } else if (errors['incorrectPasswordFormat']) {
      errorMessage = 'Password must contain at least one lowercase, one uppercase, and one number or one special character. Must not have whitespace.';
    } else if (errors['passwordStrength']) {
      switch(errors['passwordStrength']) {
        case 'weakpassword': 
          errorMessage =  'At least 6 characters with 2 of: uppercase, lowercase, numbers';
          break;
        default:
          errorMessage = 'Should include uppercase, lowercase, and numbers (8+ characters)';
      }
    } else if (errors['invalidCountry']) {
      errorMessage = 'Invalid country code';
    } else if (errors['invalidNumber']) {
      errorMessage = 'Invalid phone number format';
    } else if (errors['pattern']) {
      if (fieldName[0] === 'websiteUrl') {
        errorMessage = 'Invalid website URL format (e.g., https://example.com)';
      } else {
        errorMessage = 'Invalid format';
      }
    } else {
      errorMessage = 'Unhandled Error.';
    }

    return errorMessage;
  }
}
