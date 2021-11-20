import { Component, OnInit, ViewChild } from '@angular/core';
import { Web3Service,CampaignService } from 'src/app/modules/services';
import {FormBuilder, FormGroup,FormControl, FormGroupDirective, NgForm, Validators, AbstractControl} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ValidateEndDateLaterThanStartDate } from '../validators/create-launchpad-validator';
import {ErrorStateMatcher} from '@angular/material/core';


/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    //ts-ignore
    return (control?.dirty??false) && (form?.invalid??false);
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
// export class CrossFieldErrorMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

@Component({
  selector: 'app-create-launchpad',
  templateUrl: './create-launchpad.component.html',
  styleUrls: ['./create-launchpad.component.scss']
})
export class CreateLaunchpadComponent implements OnInit {
  model: any = {};
  isLinear = false;
  
  // @ts-ignore
  tokenDetails: any;
  // @ts-ignore
  firstFormGroup: FormGroup;
  // @ts-ignore
  secondFormGroup: FormGroup; 
   // @ts-ignore
  thirdFormGroup: FormGroup; 

  baseTokenSymbol = 'CELO';

  errorMatcher = new CrossFieldErrorMatcher();

  validationMessages : {
   [index: string]: any
  } = {
    'username' : {
      'required'  :   'Username Name is Required.',
      'minlength' :   'Username must be at least 3 characters long..',
      'maxlength' :   'Username cannot be more than 25 characters long'
    },
    'tokenAddress' : {
      'required'  :   'Token Address is required',
      'minlength' :   'Token Address must be at least 41 Characters',
      'maxlength' :   'Token Address cannot be more than 43 characters long'
    },
    'email' : {
      'required'  :   'Email is Required.',
      'email'     :   'Invalid Email'
    },
    'firstName' : {
      'required'  :   'First Name is required'
    },
    'router' : {
      'required'  :   'Router is required.'
    },
    'minbuy' : {
      'required'  :   'Min Buy is Required.',
      'min': 'Min Buy must be at least 1 '
    },
    'maxbuy' : {
      'required'  :   'Max Buy is Required.',
      'min': 'Max Buy must be at least 1 ',
      'max': 'Max Buy must be at most 1,000,000 '
    },
    'softcap' : {
      'required'  :   'Soft cap is Required.',
      'min': 'Soft cap must be at least 1 '
    },
    'hardcap' : {
      'required'  :   'Hard Cap is Required.',
      'min': 'Hard cap must be at least 1 ',
      'max': 'Hard cap must be at most 1,000,000 '
    },
    'startDate' : {
      'required'  :   'Start Date is Required.',
      'past': 'Start Date can not be in the past'
    },
    'endDate' : {
      'required'  :   'End Date is Required.',
      'past': 'End Date can not be in the past',
      //'less': 'End date cannot be less than Start date'
      // 'pattern'   :   'Contact No. should only contain Numbers '
    },
    'logo' : {
      'required'  :   'Token Logo is Required.'
    },
    'twitter' : {
      'required'  :   'Twitter handle is Required.'
    },
    'telegram' : {
      'required'  :   'Telegram is Required.'
    },
    'website' : {
      'required'  :   'Website URl is Required.'
    },

  };


  //bypass error
  @ViewChild('picker', { static: true }) pickerFixed?: any;
  @ViewChild('endpicker', { static: true }) endPickerFixed?: any;

  constructor(public web3Service: Web3Service, public campaignService: CampaignService, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({

      tokenAddress: ['', [Validators.required,Validators.minLength(42) ] ]

    });

    this.secondFormGroup = this._formBuilder.group({

        presalerate: ['', [Validators.required]],
        softcap: ['', [Validators.required, Validators.min(1)]],
        hardcap: ['', [Validators.required,Validators.min(1),Validators.max(1000000)]],
        minbuy: ['', [Validators.required, Validators.min(0)]],
        maxbuy: ['', [Validators.required,Validators.min(0),Validators.max(1000000)]],
        liquidity: ['50', [Validators.required, Validators.min(50), Validators.max(100)]],
        listingrate : ['', [Validators.required,Validators.min(0)]],
        router: ['', [Validators.required ] ],
        startDate: ['', [Validators.required, this.ValidateDateIsNotInPast ] ],
        endDate: ['', [Validators.required , this.ValidateDateIsNotInPast, ValidateEndDateLaterThanStartDate] ]

      }, 
      {validator: [ValidateEndDateLaterThanStartDate]}// this.dateLessThan('startDate', 'endDate')    
    );

    this.thirdFormGroup = this._formBuilder.group({

      twitter: ['', [Validators.required]],

      telegram: ['', [Validators.required]],

      website: ['', [Validators.required]],

      desc: ['', [Validators.required]],
      reddit: ['', []],



    });



    this.firstFormGroup.get('tokenAddress')?.valueChanges.subscribe(async value => {
      
      if(value && value.length>=42){
        this.tokenDetails = await this.web3Service.getERC20Details(value);
        
      }
    });
  }

  
  ValidateDateIsNotInPast(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value && new Date(control.value) < new Date() ) {
      return { 'past': true };
    }
    return null;
  }


  // dateLessThan(from: string, to: string) {
  //   return (group: FormGroup): {[key: string]: any} => {
  //     let f = group.controls[from];
  //     let t = group.controls[to];
      
  //     if (f.value > t.value) {
  //       return {
  //         startDate: "Start Date should be less than End Date"
  //       };
  //     }
  //     return {}; 
  //   }
  // }




  resetStepper(stepper: MatStepper){
      stepper.reset();
      this.tokenDetails= undefined;
  }
   // convenience getter for easy access to form fields
  get f1() { return this.firstFormGroup.controls; }

  get f2() { return this.secondFormGroup.controls; }

  get f3() { return this.thirdFormGroup.controls; }

 


  submit(){

      console.log(this.firstFormGroup.value);

      console.log(this.secondFormGroup.value);



  }

}
