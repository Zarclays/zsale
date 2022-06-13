import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WizardComponent } from 'angular-archwizard';
import { Web3Service } from 'src/app/services/web3.service';
import contractList from '../../../models/contract-list'
import { BigNumber , constants, ethers, utils } from 'ethers';
import { NgxSpinnerService } from "ngx-spinner";

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

  isTokenApproved = false;

  
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
    this.titleService.setTitle('Launch Campaign | ZSale');

    this.mainFormGroup = this.fb.group({
      // existing formControls
      tokenInfoFG: this.fb.group({
        tokenToUse: ['', Validators.required],
        tokenAddress: this.fb.control('', { validators: [Validators.required, Validators.minLength(41),Validators.maxLength(43)]}),
        // tokenAddress: this.fb.control('', {updateOn: 'blur', validators: [Validators.required, Validators.minLength(41),Validators.maxLength(43)]}),
        // tokenType: ['basic', Validators.required],
     }),
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

  setTokenToUseValue(value: string): void {
    this.tokenInfoFG.patchValue({ tokenToUse: value });
  }

  setTokenTypeValue(value: string): void {
    this.tokenInfoFG.patchValue({ tokenType: value });
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

}
