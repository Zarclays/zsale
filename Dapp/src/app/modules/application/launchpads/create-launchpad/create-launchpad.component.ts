import { Component, OnInit, ViewChild } from '@angular/core';
import { Web3Service } from 'src/app/modules/services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
      'required'  :   'Start Date is Required.'
    },
    'endDate' : {
      'required'  :   'End Date is Required.',
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

  constructor(public web3Service: Web3Service, private _formBuilder: FormBuilder) { }

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
      startDate: ['', [Validators.required ] ],
      endDate: ['', [Validators.required ] ]

    }, {validator: this.dateLessThan('startDate', 'endDate')});

    this.thirdFormGroup = this._formBuilder.group({

      twitter: ['', [Validators.required]],

      telegram: ['', [Validators.required]],

      website: ['', [Validators.required]],



    });



    this.firstFormGroup.get('tokenAddress')?.valueChanges.subscribe(async value => {
      console.log('new token: ',value);
      if(value.length>=42){
        this.tokenDetails = await this.web3Service.getERC20Details(value);
        console.log(this.tokenDetails)
      }
    });


  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "Start Date should be less than End Date"
        };
      }
      return {};
    }
}

   // convenience getter for easy access to form fields
  get f1() { return this.firstFormGroup.controls; }

  get f2() { return this.secondFormGroup.controls; }

  get f3() { return this.thirdFormGroup.controls; }

  onSubmit() {
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model, null, 4));
  }


  submit(){

      console.log(this.firstFormGroup.value);

      console.log(this.secondFormGroup.value);

  }

}
