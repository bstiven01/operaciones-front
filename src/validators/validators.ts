import { AbstractControl , ValidatorFn } from '@angular/forms';


export function validateSmallerThan(greater_control: number): ValidatorFn {

  return (smaller_control: AbstractControl) => {
    if (smaller_control != undefined && smaller_control.value != undefined && greater_control != undefined) {

      let control_one: AbstractControl = smaller_control;

      let element_one = convertStringThousandsToInteger(control_one.value);

      console.log(element_one)
      console.log(greater_control)
      
      console.log(element_one > greater_control)

      if (element_one > greater_control) {
        let temp = {};
        temp['smallerThan'] = true;
        return temp;
      }

    }
  };

}

export function validateGreaterThan(smaller_control: number): ValidatorFn {

  return (greater_control: AbstractControl) => {
    if (greater_control != undefined && greater_control.value != undefined && smaller_control != undefined) {

      let control_one: AbstractControl = greater_control;

      let element_one = convertStringThousandsToInteger(control_one.value);

      if (element_one < smaller_control) {
        let temp = {};
        temp['greaterThan'] = true;
        return temp;
      }

    }
  };

}

export function convertStringThousandsToInteger(value: any): number {
  if (value != null && value !== '') {
    value = value.toString().replace(/,/g, '');
    return parseInt(value);
  }
  return value;
}
