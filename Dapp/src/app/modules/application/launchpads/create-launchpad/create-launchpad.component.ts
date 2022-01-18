import { Component, OnInit, ViewChild } from '@angular/core';
import { Web3Service,CampaignService } from 'src/app/modules/services';
import {FormBuilder, FormGroup,FormControl, FormGroupDirective, NgForm, Validators, AbstractControl} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ValidateEndDateLaterThanStartDate } from '../validators/create-launchpad-validator';
import {ErrorStateMatcher} from '@angular/material/core';
import { Router } from '@angular/router'; // CLI imports router



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
    'saleStartTime' : {
      'required'  :   'Start Date is Required.',
      'past': 'Start Date can not be in the past'
    },
    'saleEndTime' : {
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
    'refundType': {
      'required': 'Refund Type is required'
    }

  };


  //bypass error
  @ViewChild('picker', { static: true }) pickerFixed?: any;
  @ViewChild('endpicker', { static: true }) endPickerFixed?: any;

  constructor(public web3Service: Web3Service, public campaignService: CampaignService, private _formBuilder: FormBuilder, private ngRouter: Router) { }

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
        saleStartTime: ['', [Validators.required, this.ValidateDateIsNotInPast ] ],
        saleEndTime: ['', [Validators.required , this.ValidateDateIsNotInPast, ValidateEndDateLaterThanStartDate] ],
        refundType: ['', [Validators.required ] ]

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

 

  issubmitting =false;
  async submit(){

      
      this.issubmitting=true;

      const s2 = {...this.secondFormGroup.value};

      console.log('s2:', s2);

      const accs = await this.web3Service.web3.eth.getAccounts();
      console.log('accs: ',accs[0] );
      //_tokenAddress,_softCap,_hardCap, _saleStartTime, _saleEndTime,   _useWhiteList, _refundType, _dexRouterAddress,_liquidityPercent, _listRate, _dexListRate
      let tx = this.campaignService.createCampaign(accs[0], this.firstFormGroup.value.tokenAddress, s2.softcap,s2.hardcap,s2.saleStartTime, s2.saleEndTime, s2.refundType, s2.router, s2.liquidity,s2.presalerate, s2.listingrate );
      console.log('tx:',tx);

      
      tx
      // .on('transactionHash', function(hash){
      //   ...
      // })
      .on('confirmation', (confirmationNumber: any, receipt: any)=>  {
        // if( +confirmationNumber > 10 ){
        //   this.issubmitting=false;
        //   alert('Submission Succesful');

        //   // let receipt2 = {
        //   //   "transactionHash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
        //   //   "transactionIndex": 0,
        //   //   "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
        //   //   "blockNumber": 3,
        //   //   "contractAddress": "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
        //   //   "cumulativeGasUsed": 314159,
        //   //   "gasUsed": 30234,
        //   //   "events": {
        //   //       "MyEvent": {
        //   //           returnValues: {
        //   //               myIndexedParam: 20,
        //   //               myOtherIndexedParam: '0x123456789...',
        //   //               myNonIndexParam: 'My String'
        //   //           },
        //   //           raw: {
        //   //               data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
        //   //               topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
        //   //           },
        //   //           event: 'MyEvent',
        //   //           signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
        //   //           logIndex: 0,
        //   //           transactionIndex: 0,
        //   //           transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
        //   //           blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
        //   //           blockNumber: 1234,
        //   //           address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
        //   //       },
        //   //       "MyOtherEvent": {
                    
        //   //       }
        //   //   }
        //   // }
        //   console.log('receipt.events:',receipt.events)
        //   console.log('receipt.events.CampaignCreated:',receipt.events.CampaignCreated)
        //   let index = receipt.events.CampaignCreated.returnValues.index;
        //   console.log('inde x: ', index);

        // }
        
      })
      .on('receipt', (receipt: any)=> {
          // receipt example
          console.log(receipt);
        //   let receipt2 = {
        //     "transactionHash": "0x00070f7c6b211535346b979572b861af328e82a819a4ac08ab775eb12bf185ec",
        //     "transactionIndex": 0,
        //     "blockHash": "0x40404599822a962d8fe50fe1b6e37a033f105e4aa6c6402acf9a131debe66c10",
        //     "blockNumber": 226,
        //     "from": "0x858f7cf768583d6ba13bb019705ecb6cf6e64d38",
        //     "to": "0xe8c4ab8862ee87087dc87ba1c7dffe24cd36facf",
        //     "gasUsed": 2978336,
        //     "cumulativeGasUsed": 2978336,
        //     "contractAddress": null,
        //     "status": true,
        //     "logsBloom": "0x40000000000000000000000000000000000000000000000000800000000000000000000000000000000000000800000000000000000000000000000000040000000000000000000400000004000000000001010000040000000000000000000000000000020000000000000000000800000000000000000000000000000000420040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000420000000000000000200000000000000028000000060000000000000000000000000000080000000000000000000400000000000000000",
        //     "events": {
        //         "OwnershipTransferred": {
        //             "logIndex": 0,
        //             "transactionIndex": 0,
        //             "transactionHash": "0x00070f7c6b211535346b979572b861af328e82a819a4ac08ab775eb12bf185ec",
        //             "blockHash": "0x40404599822a962d8fe50fe1b6e37a033f105e4aa6c6402acf9a131debe66c10",
        //             "blockNumber": 226,
        //             "address": "0x0CDaB5a4179fAe2aF768fdf86b9B1F97c3b5FCef",
        //             "type": "mined",
        //             "id": "log_87e66b2b",
        //             "returnValues": {
        //                 "0": "0x0000000000000000000000000000000000000000",
        //                 "1": "0xE8C4aB8862eE87087dC87BA1C7DffE24CD36fAcf",
        //                 "previousOwner": "0x0000000000000000000000000000000000000000",
        //                 "newOwner": "0xE8C4aB8862eE87087dC87BA1C7DffE24CD36fAcf"
        //             },
        //             "event": "OwnershipTransferred",
        //             "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0",
        //             "raw": {
        //                 "data": "0x",
        //                 "topics": [
        //                     "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0",
        //                     "0x0000000000000000000000000000000000000000000000000000000000000000",
        //                     "0x000000000000000000000000e8c4ab8862ee87087dc87ba1c7dffe24cd36facf"
        //                 ]
        //             }
        //         },
        //         "CampaignCreated": {
        //             "logIndex": 1,
        //             "transactionIndex": 0,
        //             "transactionHash": "0x00070f7c6b211535346b979572b861af328e82a819a4ac08ab775eb12bf185ec",
        //             "blockHash": "0x40404599822a962d8fe50fe1b6e37a033f105e4aa6c6402acf9a131debe66c10",
        //             "blockNumber": 226,
        //             "address": "0xE8C4aB8862eE87087dC87BA1C7DffE24CD36fAcf",
        //             "type": "mined",
        //             "id": "log_6f31e732",
        //             "returnValues": {
        //                 "0": "0x858f7CF768583d6bA13bB019705ECb6Cf6E64D38",
        //                 "1": "1",
        //                 "2": "0x0CDaB5a4179fAe2aF768fdf86b9B1F97c3b5FCef",
        //                 "creator": "0x858f7CF768583d6bA13bB019705ECb6Cf6E64D38",
        //                 "index": "1",
        //                 "createdCampaignAddress": "0x0CDaB5a4179fAe2aF768fdf86b9B1F97c3b5FCef"
        //             },
        //             "event": "CampaignCreated",
        //             "signature": "0xa01c8e2b0a81830c2e4e199b4cb98ece9d41443b7f9ef51cbb778f0fa13b019d",
        //             "raw": {
        //                 "data": "0x0000000000000000000000000cdab5a4179fae2af768fdf86b9b1f97c3b5fcef",
        //                 "topics": [
        //                     "0xa01c8e2b0a81830c2e4e199b4cb98ece9d41443b7f9ef51cbb778f0fa13b019d",
        //                     "0x000000000000000000000000858f7cf768583d6ba13bb019705ecb6cf6e64d38",
        //                     "0x0000000000000000000000000000000000000000000000000000000000000001"
        //                 ]
        //             }
        //         }
        //     }
        // };

          this.issubmitting=false;
          alert('Submission Succesful');
          console.log('receipt.events:',receipt.events)
          console.log('receipt.events.CampaignCreated:',receipt.events.CampaignCreated)
          let index = receipt.events.CampaignCreated.returnValues.index;
          console.log('index: ', index);

          this.ngRouter.navigate(['/launchpads', index]);



      })
      .on('error', (error: any, receipt: any) => { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        this.issubmitting=false;
        alert('Submission failed');
      })



  }

}
