import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appMultipleOf1000]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MultipleOf1000Directive, multi: true }]
})
export class MultipleOf1000Directive implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return multipleOf1000Validator()(control);
  }
}

export function multipleOf1000Validator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value % 1000 === 0) {
      return null;
    }
    else
    return { 'multipleOf1000': true };
  };
}
