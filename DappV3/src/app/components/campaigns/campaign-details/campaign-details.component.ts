import { Component, OnInit , ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Web3Service } from 'src/app/services/web3.service';
import { CampaignService } from 'src/app/components/campaigns/campaign.service';
import { Campaign } from 'src/app/models/campaign';
import contractList from 'src/app/models/contract-list';
import {getDateFromEther, formatEtherDateToJs, formatDateToJsString} from 'src/app/utils/date';
import {formatPercent} from 'src/app/utils/numbers'
import {utils} from 'ethers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { cilList, cilShieldAlt } from '@coreui/icons';
import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { AppToastComponent } from 'src/app/views/notifications/toasters/toast-simple/toast.component';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent implements OnInit {
  mainFormGroup!: FormGroup;
  campaignId: string|undefined;
  campaign: Campaign|undefined;
  web3ServiceConnect$: Subscription|undefined;
  userChain: string|null = 'mtrt';

  isOpenForPayment = false;
  isOwner = false;

  now = Date.now();

  saleProgress: any;

  submittingBid = false;

  nativeCoin: {
    name: string;
    symbol: string;
    decimals: number;
  }| undefined;

  validationMessages : {
    [index: string]: any
   } = {
    'amount': {
      'required'  :   'Amount is Required.',
      'min': 'Amount must be at least 0 ',
      'max': 'Amount must be at most 100 '
    }
 
   };

   placement = ToasterPlacement.TopCenter;

  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  // icons = { cilList, cilShieldAlt };
  
  constructor(private titleService: Title, 
    public web3Service: Web3Service,
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private fb: FormBuilder) {
      
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userChain = params.get('chain');
      this.campaignId = params.get('campaignId')!;
      
      this.web3ServiceConnect$ = this.web3Service.onConnect.subscribe(async ()=>{
      
        if(this.userChain ){
          await this.web3Service.switchNetworkByChainShortName(this.userChain); 
        }

        const currentChainId = await this.web3Service.getCurrentChainId();
        this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency;
      
        this.campaign = await this.campaignService.getCampaignDetails(contractList[currentChainId].campaignList, this.campaignId!, this.nativeCoin.decimals);

        this.mainFormGroup = this.fb.group({
        
          amount: ['', [Validators.required,Validators.min(+this.campaign.minAllocationPerUser ),Validators.max(+this.campaign.maxAllocationPerUserTierTwo )]],
    
        })

        this.validationMessages['amount'].min = `Amount must be at least ${ this.campaign.minAllocationPerUser} `
        this.validationMessages['amount'].max = `Amount must be at most ${this.campaign.maxAllocationPerUserTierTwo} `

        let now = Date.now();
        this.isOpenForPayment = this.campaign.saleStartTime.getTime() < now  && this.campaign.saleEndTime.getTime() > now ;
        
        // this.isOwner = this.web3Service.accounts.findIndex(f=>f==this.campaign?.owner??'none')>=0;
        this.isOwner = this.web3Service.accounts[0] == (this.campaign?.owner??'none' );

        const amount = parseFloat( this.campaign.totalCoinReceived ) ;
        const hardCap = parseFloat( this.campaign.hardCap );
        const softCap = parseFloat( this.campaign.softCap );

        this.saleProgress = 100 * Math.min( amount/softCap ,  amount/ hardCap)
        if(this.saleProgress==100){
          this.saleProgress = 100 * amount/ hardCap;
        }
            
      })
      
    })

    


    this.titleService.setTitle('Participate in Campaign | ZSale');

  }

  formatEtherDateToJs(value: any){
    return formatEtherDateToJs(value);
  }

  formatDateToJsString(v: Date){
    return formatDateToJsString(v);
  }

  formatUnits(value: any, decimals: number){
    return utils.formatUnits(value, decimals);
  }

  formatPercent(value: any){
    return formatPercent(value);
  }

  getDateFromEther(value:  any){
    return getDateFromEther(value);
  }
  

  ngOnDestroy(){
    this.web3ServiceConnect$!.unsubscribe();
  }



  async submitBid(){
    
    this.submittingBid=true;    
    const amount = this.mainFormGroup.get('amount').value;
    const campaignContract = await this.campaignService.getCampaignContractWithSigner(this.campaign.campaignAddress)
    // not defining `data` field will use the default value - empty data

    const gasFeeData = (await this.web3Service.getFeeData())!;  

    const tx = {
        from: this.web3Service.accounts[0],
        to: this.campaign.campaignAddress,
        nonce: this.web3Service.ethersProvider.getTransactionCount(this.web3Service.accounts[0], "latest"),
        value: utils.parseEther(amount.toString()), 
        maxFeePerGas: gasFeeData.maxFeePerGas,// should use geasprice for bsc, since it doesnt support eip 1559 yet
        maxPriorityFeePerGas: gasFeeData.maxPriorityFeePerGas
        // gasLimit: utils.hexlify(500000), // 100000
        // gasPrice: gasPrice,
    };
    const txRes = await this.web3Service.signer.sendTransaction(tx);    
    // console.log("Send finished!" , txRes)
    this.showToast('Success!','Your bid has been sent succesfully!');
    // alert('Your bid has been sent succesfully');
    this.submittingBid=false;
    window.location.reload(); // navigate(`/campaigns/${campaignId}`);

    // this.router.navigate(['/campaigns', currentChain.shortName,'p',  this.campaignIndex]);
  }


  onCountdownfinish(){

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
