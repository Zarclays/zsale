import { ValidatorFn, FormBuilder, FormGroup, Validators,ValidationErrors, AbstractControl } from '@angular/forms';

// const CapRangeValidator: ValidatorFn = (fg: FormGroup) => {
//     const start = fg.get('softcap')?.value;
//     const end = fg.get('hardcap')?.value;
//     return start !== null && end !== null && start < end
//       ? null
//       : { range: true };
// };

const  CapRangeValidator = (fromControlName: string, toControlName: string)=> {
    return (group: FormGroup): {[key: string]: any} => {
        let f = group.controls[fromControlName];
        console.log('f is ', f)
        let t = group.controls[toControlName];
        if (f.value !== null && t.value !== null && f.value > t.value) {
            return {
                dates: `${fromControlName} should be less than ${toControlName}`
            };
        }
        return {};
    }
}

// const ValidateEndDateLaterThanStartDate = (control: AbstractControl): {[key: string]: any} | null => {
//     console.log('control: ', control);
//     let group = <any>control.parent;
//     console.log('group: ', group);
//     let startDateControl = group.controls['endDate'];
//     if (control.value && startDateControl.value && new Date(control.value) <= new Date(startDateControl.value) ) {
//       return { 'less': true };
//     }
//     return null;
// }

// const ValidateEndDateLaterThanStartDate = (form: FormGroup): {[key: string]: any} | null => {
//     console.log('form: ', form);
//     let group = <any>form.parent;
//     // console.log('group: ', group);
//     // let startDateControl = group.controls['endDate'];
//     // if (control.value && startDateControl.value && new Date(control.value) <= new Date(startDateControl.value) ) {
//     //   return { 'less': true };
//     // }
//     let f = group.controls['startDate'];
//     let t = group.controls['endDate'];
    
//     if (f.value > t.value) {
//         return {
//             startDate: "Start Date should be less than End Date",
//             endDate: "Start Date should be less than End Date"
//         };
//     }
//     return {};
    
// }








class ColorValidators {  

    static blue(control: AbstractControl): any | null {  
        return ColorValidators.color('blue')(control);  
    }  

    static red(control: AbstractControl): any | null {
        return ColorValidators.color('red')(control);  
    }  

    static white(control: AbstractControl): any | null {
        return ColorValidators.color('white')(control);  
    }  

    static color(colorName: string): ValidatorFn {

        return (control: AbstractControl): { [key: string]: any } | null => {
            return control.value?.toLowerCase() === colorName 
            ? null : {wrongColor: control.value};
        }
    }
}

const ValidateEndDateLaterThanStartDate = (fromControl : string, toControl : string) => {
    //ts-ignore
    return (form: FormGroup): {[key: string]: any}  => {

        const start:Date = form.get(fromControl)?.value;

        const end:Date = form.get(toControl)?.value;

        if (start && end) {
            const isRangeValid = (end.getTime() - start.getTime() > 0);

            return isRangeValid ? {} : { endDateLater:true };
        }

        return {};
    }
}



export {CapRangeValidator, ValidateEndDateLaterThanStartDate };