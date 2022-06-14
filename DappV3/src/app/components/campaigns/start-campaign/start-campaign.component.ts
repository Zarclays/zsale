import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WizardComponent } from 'angular-archwizard';
import { Web3Service } from 'src/app/services/web3.service';
import contractList from '../../../models/contract-list'
import { BigNumber , constants, ethers, utils } from 'ethers';
import { NgxSpinnerService } from "ngx-spinner";
import { ValidateEndDateLaterThanStartDate , ValidateDateIsNotInPast, ValidateVestingPercentUpto100} from '../../../validators/create-launchpad-validators';

@Component({
  selector: 'app-start-campaign',
  templateUrl: './start-campaign.component.html',
  styleUrls: ['./start-campaign.component.scss']
})
export class StartCampaignComponent implements OnInit {
  campaignId: number|undefined;
  @ViewChild('wizard') wizard!: WizardComponent;
  mainFormGroup!: FormGroup;

  tokenAddress: string;
  tokenDetails: any;
  nativeCoin= '';

  datePickerConfig: any={};

  isTokenApproved = false;

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
     'campaignType': {
       'required':'Campaign Type is Required'
     },
	  'presaleRate' : {
       'required'  :   'Presale Rate is required.',
		    'min':  'Presale Rate must be at least 0.'
     },
     'dexRate' : {
       'required'  :   'DEX Rate is required.',
		    'min':  'DEX Rate must be at least 0.'
     },
     'liquidity' : {
       'required'  :   'Liquidity is required.',
		    'min':  'Liquidity must be at least 50.',
        'max':  'Liquidity must be at most 100.'
     },
     'liquidityLockupDays':{
      'required'  :   'Liquidity Lockup Days is required.',
       'min':  'Liquidity Lockup Days must be at least 30.',
       'max':  'Liquidity Lockup Days must be at most 730.'
    },

     'minBuy' : {
       'required'  :   'Min Buy is Required.',
       'min': 'Min Buy must be at least 1 '
     },
     'maxBuy' : {
       'required'  :   'Max Buy is Required.',
       'min': 'Max Buy must be at least 1 ',
       'max': 'Max Buy must be at most 1,000,000 '
     },
     'softCap' : {
       'required'  :   'Soft cap is Required.',
       'min': 'Soft cap must be at least 0 '
     },
     'hardCap' : {
       'required'  :   'Hard Cap is Required.',
       'min': 'Hard cap must be at least 0 ',
       'max': 'Hard cap must be at most 1,000,000,000 '
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
     'refundType': {
       'required': 'Refund Type is required'
     },
     'vesting':{
       'amount': {
        'required'  :   'Amount (%) is Required.',
        'min': 'Amount (%) must be at least 0 ',
        'max': 'Amount (%) must be at most 100 '
       },
       'releaseDate': {
        'required'  :   'Lock duration (Days) is Required.',
        'min': 'Lock duration (Days) must be at least 0 ',
        'max': 'Lock duration (Days) must be at most 100 '
       }
     }
 
   };

  
  constructor(private titleService: Title, 
    public web3Service: Web3Service,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const userChain = params.get('chain');
      this.campaignId = +params.get('campaignId')!;
      if(userChain){
        
        setTimeout(()=>{
          this.web3Service.switchNetworkByChainShortName(userChain).then(()=>{
            
            this.web3Service.connect().then(async ()=>{
              const selectedNetwork = await this.web3Service.getCurrentChainId();
              console.log('loaded chain: ', selectedNetwork)
            });
          });
        },1700)
        
      }
      
    })

    setTimeout(async () => {
      this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency.symbol??'Coin';
    }, 2500);
    this.titleService.setTitle('Launch Campaign | ZSale');

    this.mainFormGroup = this.fb.group({
      // existing formControls
      tokenInfoFG: this.fb.group({
        tokenToUse: ['', Validators.required],
        tokenAddress: this.fb.control('', { validators: [Validators.required, Validators.minLength(41),Validators.maxLength(43)]}),
        // tokenAddress: this.fb.control('', {updateOn: 'blur', validators: [Validators.required, Validators.minLength(41),Validators.maxLength(43)]}),
        // tokenType: ['basic', Validators.required],
     }),

     campaignInfoFG: this.fb.group({
        campaignType: ['capped', [Validators.required ]],
        presaleRate: ['', [Validators.required ,Validators.min(0)]],
        softCap: ['', [Validators.required, Validators.min(0)]],
        hardCap: ['', [Validators.required,Validators.min(0),Validators.max(1000000)]],
        minBuy: ['', [Validators.required, Validators.min(0)]],
        maxBuy: ['', [Validators.required,Validators.min(0),Validators.max(100000000)]],
        liquidity: ['50', [Validators.required, Validators.min(50), Validators.max(100)]],
        dexRate : ['', [Validators.required,Validators.min(0)]],
        router: ['', [Validators.required ] ],
        startDate: ['', [Validators.required, ValidateDateIsNotInPast ] ],
        endDate: ['', [Validators.required , ValidateDateIsNotInPast, ValidateEndDateLaterThanStartDate] ],
        refundType: ['', [Validators.required ] ],
        liquidityLockupDays: ['90', [Validators.required, Validators.min(30), Validators.max(730)]],
        useTokenVesting : [false, [Validators.required ]],
        tokenVestings: new FormArray([
          new FormGroup({
            amount: new FormControl('', [Validators.required, Validators.min(0)]),
            releaseDate: new FormControl('', [Validators.required])
          })
        ],  {validators: ValidateVestingPercentUpto100()})
     } ,{validator: [ValidateEndDateLaterThanStartDate]}),
    })

    this.onFormChanges();

    // this.spinner.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 55000);
  }

  


  onFormChanges(): void {
    this.mainFormGroup.get('tokenInfoFG.tokenAddress')!.valueChanges.subscribe(async val => {
      //this.formattedMessage = `My name is ${val}.`;
      const currentChainId = await this.web3Service.getCurrentChainId();
    
      this.tokenAddress = val;
      

      if(this.mainFormGroup.get('tokenInfoFG.tokenAddress')?.valid){
        try{
          this.tokenDetails = await this.web3Service.getERC20Details(this.tokenAddress)
          
        }catch(err){
          console.error('eror gting erc20 details:', err, new Date())
        }

        try{
          this.isTokenApproved= (await this.web3Service.getERC20ApprovalAllowance(this.tokenAddress, contractList[currentChainId].campaignList)).gte(constants.Zero);
          
        }catch(err){
          console.error('eror gting erc20 details:', err, new Date())
        }
      }
      
      
    });

    this.mainFormGroup.get('tokenInfoFG.tokenToUse')!.valueChanges.subscribe(val => {
      //this.formattedMessage = `My name is ${val}.`;
      if(val=='useMyToken'){
        // this.mainFormGroup.get('tokenInfoFG.tokenType')!.disable()
        this.mainFormGroup.get('tokenInfoFG.tokenAddress')!.enable()
        
      }else{
        // this.mainFormGroup.get('tokenInfoFG.tokenType')!.enable()
        this.mainFormGroup.get('tokenInfoFG.tokenAddress')!.disable()
      }
      
    });

    //todo unsunbscribe
  }

  get tokenInfoFG(): any {
    return this.mainFormGroup.get('tokenInfoFG');
  }

  get campaignInfoFG(): any {
    return this.mainFormGroup.get('campaignInfoFG');
  }

  get tokenVestings() {
    return this.mainFormGroup.get('campaignInfoFG.tokenVestings') as FormArray;
  }

  addVestingSchedule() {
    const group = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.min(0)]),
      releaseDate: new FormControl('', [Validators.required])
    });

      this.tokenVestings.push(group);
  }

  removeVestingSchedule(index: number) {
    this.tokenVestings.removeAt(index);
  }

  setTokenToUseValue(value: string): void {
    this.tokenInfoFG.patchValue({ tokenToUse: value });
  }

  setTokenTypeValue(value: string): void {
    this.tokenInfoFG.patchValue({ tokenType: value });
  }

  setCampaignTypeValue(value: string){
    this.campaignInfoFG.patchValue({ campaignType: value });
  }

  async approveToken(){
    /** spinner starts on init */
    this.spinner.show();

    const currentChainId = await this.web3Service.getCurrentChainId();
    const result = await this.web3Service.approveERC20Contract(this.tokenAddress, contractList[currentChainId].campaignList, constants.MaxUint256)

    this.isTokenApproved= result=='succeeded';
    this.spinner.hide();
  }


  finishFunction(){
    console.log('finished');
  }

  objectKeys(o: any){
    if(!o){
      return []
    }
    return Object.keys(o)
  }

}
