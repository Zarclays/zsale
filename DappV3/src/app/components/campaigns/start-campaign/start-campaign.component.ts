import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { WizardComponent } from 'angular-archwizard';
import { Web3Service } from 'src/app/services/web3.service';
import contractList from '../../../models/contract-list'
import { BigNumber , constants, Contract, ethers, utils } from 'ethers';
import { NgxSpinnerService } from "ngx-spinner";
import { ValidateEndDateLaterThanStartDate , ValidateDateIsNotInPast, ValidateVestingPercentUpto100, ValidateHardCap} from '../../../validators/create-launchpad-validators';
import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { AppToastComponent } from 'src/app/views/notifications/toasters/toast-simple/toast.component';
// import { AppToastComponent } from '../../toast/toast.component';
const CampaignListAbi = require('../../../../assets/CampaignList.json');
const CampaignAbi = require('../../../../assets/Campaign.json');



@Component({
  selector: 'app-start-campaign',
  templateUrl: './start-campaign.component.html',
  styleUrls: ['./start-campaign.component.scss']
})
export class StartCampaignComponent implements OnInit {
  campaignId: number|undefined;
  @ViewChild('wizard') wizard!: WizardComponent;
  mainFormGroup!: FormGroup;

  testFG!: FormGroup;

  placement = ToasterPlacement.TopCenter;

  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  tokenAddress: string;
  tokenDetails: any;
  nativeCoin= '';

  datePickerConfig: any={
    format: 'YYYY/MM/DD HH:mm'
  };

  routers: any = [];

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
       'min': 'Min Buy must be at least 0 '
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
       'max': 'Hard cap must be at most 1,000,000,000 ',
       'outOfRange': 'Hard Cap cannot be lesser than Soft Cap or greater than 4x Soft Cap'
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
       },
     },

     'desc': {
      'required': 'Required'
     },
     'tokenLogo' : {
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
     'discord': {
       'required': 'Required'
     },
     'reddit': {
       'required': 'Required'
     },
 
   };

  
  constructor(private titleService: Title, 
    public web3Service: Web3Service,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router) { }

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
      const currentChainId = await this.web3Service.getCurrentChainId();
      this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency.symbol??'Coin';
      this.routers= contractList[currentChainId].routers;
    }, 2500);
    this.titleService.setTitle('Launch Campaign | ZSale');

    // this.testFG = this.fb.group({
    //   name: ['', , Validators.required],
    //   age: ['', , Validators.required]
    // })

    this.testFG = this.fb.group({
      name: ['Sammy', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(15)]],
    });

    this.mainFormGroup = this.fb.group({
      // existing formControls
      tokenInfoFG: this.fb.group({
        tokenToUse: ['', Validators.required],
        tokenAddress: ['',  [Validators.required, Validators.minLength(41),Validators.maxLength(43)]],
        // tokenAddress: this.fb.control('', {updateOn: 'blur', validators: [Validators.required, Validators.minLength(41),Validators.maxLength(43)]}),
        // tokenType: ['basic', Validators.required],
     }),

     campaignInfoFG: this.fb.group({
        campaignType: ['capped', [Validators.required ]],
        presaleRate: ['', [Validators.required ,Validators.min(0)]],
        softCap: ['0', [Validators.required, Validators.min(0)]],
        hardCap: ['', [Validators.required,Validators.min(0),Validators.max(1000000), ValidateHardCap()]],
        minBuy: ['', [Validators.required, Validators.min(0)]],
        maxBuy: ['', [Validators.required,Validators.min(0),Validators.max(100000000)]],
        liquidity: ['50', [Validators.required, Validators.min(50), Validators.max(100)]],
        dexRate : ['', [Validators.required,Validators.min(0)]],
        router: ['', [Validators.required ] ],
        startDate: ['', [Validators.required, ValidateDateIsNotInPast ] ],
        endDate: ['', [Validators.required , ValidateDateIsNotInPast] ],
        // refundType: ['', [Validators.required ] ],
        liquidityLockupDays: ['90', [Validators.required, Validators.min(30), Validators.max(730)]],
        useTokenVesting : [false, [Validators.required ]],
        tokenVestings: new FormArray([
          new FormGroup({
            amount: new FormControl('', [Validators.required, Validators.min(0)]),
            releaseDate: new FormControl('', [Validators.required])
          })
        ],  {validators: ValidateVestingPercentUpto100()})
     } ,{validator: [ValidateEndDateLaterThanStartDate('startDate', 'endDate')]}),

     teamInfoFG: this.fb.group({
      tokenLogo: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      twitter: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
    
      telegram: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
    
      website: ['', [Validators.required, , Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?') ]],
      desc: ['', [Validators.required]],
      discord: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      //reddit: ['', []],
    } ,{validator: []}),

    })

    this.onFormChanges();

    // this.mainFormGroup.markAsPristine();
    // this.mainFormGroup.markAsUntouched();
    // this.mainFormGroup.reset()
    // this.spinner.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 55000);
  }

  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    console.log('Name', form.value.name);
    console.log('Email', form.value.email);
    console.log('Message', form.value.message);
  }

  ngAfterViewInit(): void {
    
    setTimeout(() => {
      
      this.mainFormGroup.reset()
      this.mainFormGroup.get('teamInfoFG')?.markAsPristine()
      this.mainFormGroup.get('teamInfoFG')?.markAsPristine()


      this.mainFormGroup.get('teamInfoFG')?.markAsUntouched()
    }, 7000);
    
  }

  t(): void {
    this.mainFormGroup.get('teamInfoFG')?.reset();
    console.log('afterviw rt')
      this.mainFormGroup.get('teamInfoFG')?.markAsPristine()
      this.mainFormGroup.get('teamInfoFG')?.setErrors(null);

      this.mainFormGroup.get('teamInfoFG')?.markAsUntouched();

      const grp = this.mainFormGroup.get('teamInfoFG');

      if (grp instanceof FormGroup) {
        
        Object.keys(grp.controls).forEach((name) => {
        let control = grp.controls[name];
        // control.setErrors(null);
        control.markAsUntouched()
        control.markAsPristine()
      });
          
        
      }
    
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

  get teamInfoFG(): any {
    return this.mainFormGroup.get('teamInfoFG');
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


  async finishFunction(){
    const currentChain = await this.web3Service.getCurrentChain();
    const currentChainId = currentChain.chainId;
	
    this.spinner.show();
    const campaignListContract = new Contract(contractList[currentChainId].campaignList, CampaignListAbi, this.web3Service.signer);
    const now = new Date();
    const nowTimeStamp = Math.floor(now.getTime() / 1000)

    

    try{
      const tx = await campaignListContract.createNewCampaign(this.tokenInfoFG.get('tokenAddress')?.value, 
      [
        utils.formatUnits( utils.parseEther(this.campaignInfoFG.get('softCap')?.value), 'wei'),
        utils.formatUnits( utils.parseEther(this.campaignInfoFG.get('hardCap')?.value), 'wei'), 
        Math.floor(Date.parse(this.campaignInfoFG.get('startDate')?.value) / 1000) , 
        Math.floor(Date.parse(this.campaignInfoFG.get('endDate')?.value) / 1000), 
        utils.formatUnits( utils.parseEther((+this.campaignInfoFG.get('hardCap')?.value/ 2).toString()), 'wei'),
        utils.formatUnits( utils.parseEther((+this.campaignInfoFG.get('hardCap')?.value/ 2).toString()), 'wei'),
        utils.formatUnits( utils.parseEther(this.campaignInfoFG.get('minBuy')?.value.toString()), 'wei'),
        utils.formatUnits( utils.parseEther(this.campaignInfoFG.get('maxBuy')?.value.toString()), 'wei'),
        utils.formatUnits( utils.parseEther(this.campaignInfoFG.get('maxBuy')?.value.toString()), 'wei'),
        0
      ], 0, this.campaignInfoFG.get('router')?.value, 
      [(100 * +this.campaignInfoFG.get('liquidity')?.value).toFixed(0) , this.campaignInfoFG.get('liquidityLockupDays')?.value,this.campaignInfoFG.get('presaleRate')?.value, this.campaignInfoFG.get('dexRate').value ],
      
      [this.teamInfoFG.get('logo')?.value,this.teamInfoFG.get('desc')?.value,this.teamInfoFG.get('website')?.value, this.teamInfoFG.get('twitter')?.value, this.teamInfoFG.get('telegram')?.value, this.teamInfoFG.get('discord')?.value ],
      this.tokenVestings.controls.map((v,ix)=>{ 
        let n = new Date(now.getTime()) ;
        
        
        return {
          releaseDate:  Math.floor( n.setDate(n.getDate() + +this.tokenVestings.controls[ix].get('releaseDate')?.value) / 1000), 
          releaseAmount: utils.parseEther(this.tokenVestings.controls[ix].get('amount')?.value), 
          hasBeenClaimed: false
        }
        }),
      [
        {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
        {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
        {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
        {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
        {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
        {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
        {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
        {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false}
      ],

      {
        value: utils.parseEther(currentChain.creationFee.toString())
      }
      );

      
      //Wait for the transaction to be mined...
      const txResult = await tx.wait();

      console.log('txResult: ', txResult)

      this.showToast('Success!','Campaign Created succesfully');


      const campaignAddress = txResult.events.filter((f: any)=>f.event=='CampaignCreated')[0].args['createdCampaignAddress'];
      const campaignIndex = txResult.events.filter((f: any)=>f.event=='CampaignCreated')[0].args['index'];
      
      console.log('camp: ', campaignAddress)

      const campaignContract = new Contract(campaignAddress, CampaignAbi, this.web3Service.signer);
      const transferTokenTx = await campaignListContract.transferTokens(campaignAddress);        
      let transfrTxResult =   await transferTokenTx.wait();

      this.spinner.hide();

	  this.router.navigate(['/campaigns', currentChain.shortName,'p',  campaignIndex]);
      // navigate(`/campaigns/${campaignIndex}`);

    }catch(err){
      console.error('error creating campaign: ', err)
      this.showToast('Oops!','Campaign Created Failed', 'danger');
      this.spinner.hide();
    }
  }

  /*Colors 
  primary = 'primary',
  secondary = 'secondary',
  success = 'success',
  info = 'info',
  warning = 'warning',
  danger = 'danger',
  dark = 'dark',
  light = 'light',*/
  showToast(title: string, body: string, color='info') {
    const options = {
      title,
      delay: 5000,
      placement: this.placement,
      color,
      autohide: true,
      body
    }
    const componentRef = this.toaster.addToast(AppToastComponent, { ...options });
  }

  addToast() {
    const options = {
      title: `Successful`,
      delay: 5000,
      placement: this.placement,
      color: 'info',
      autohide: true,
      body: 'Campaign Created Successfuly!'
    }
    const componentRef = this.toaster.addToast(AppToastComponent, { ...options });
  }

  objectKeys(o: any){
    if(!o){
      return []
    }
    return Object.keys(o)
  }

}
