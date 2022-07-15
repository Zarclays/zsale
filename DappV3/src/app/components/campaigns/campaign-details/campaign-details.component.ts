import { Component, OnInit , ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router,Params } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { Web3Service } from '../../../services/web3.service';
import { CampaignService } from '../../../components/campaigns/campaign.service';
import { Campaign } from '../../../models/campaign';
import contractList from '../../../models/contract-list';
import {getDateFromEther, formatEtherDateToJs, formatDateToJsString} from '../../../utils/date';
import {formatPercent} from '../../../utils/numbers'
import {Contract, ethers, utils} from 'ethers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { cilList, cilShieldAlt } from '@coreui/icons';
import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { AppToastComponent } from '../../../views/notifications/toasters/toast-simple/toast.component';
import { NgxSpinnerService } from "ngx-spinner";
import { ValidateEndDateLaterThanStartDate , ValidateDateIsNotInPast} from '../../../validators/create-launchpad-validators';
import { MerkleTree } from 'merkletreejs';
// import keccak256 = require("keccak256");
// import * as keccak256 from 'keccak256';
const keccak256 = require('keccak256');
const CampaignListAbi = require('../../../../assets/CampaignList.json');
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent implements OnInit {
  mainFormGroup!: FormGroup;
  postponeSaleFormGroup!: FormGroup;
  whitelistFormGroup!: FormGroup;

  formSubscriptions: Subscription[]=[];

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
     'whitelistAddresses': {
       'required': 'Required',
       'minLength': 'Minimum Length not reached',
        'maxLength': 'Maximum Length exceeded'
     }
   };

   placement = ToasterPlacement.TopCenter;

   datePickerConfig: any={
    format: 'YYYY/MM/DD HH:mm'
  };

  postponeSaleModalVisible=false;
  whitelistModalVisible=false;

  whitelist? : string[] = undefined;
  viewWhitelistModalVisible = false;

  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  campaignContract: ethers.Contract;

  // icons = { cilList, cilShieldAlt };
  
  constructor(private titleService: Title, 
    public web3Service: Web3Service,
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private http: HttpClient) {
    }

  ngOnInit(): void {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.route.params.subscribe((params: Params) => {
      
      this.userChain = params['chain'];
      this.campaignId = params['campaignId']!;
      
      this.web3ServiceConnect$ = this.web3Service.onConnectChange.subscribe(async (connected: boolean)=>{
        if(connected){
          if(this.userChain ){
            await this.web3Service.switchNetworkByChainShortName(this.userChain); 
          }

          const currentChainId = await this.web3Service.getCurrentChainId();
          this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency;
        
          this.campaign = await this.campaignService.getCampaignDetails(contractList[currentChainId].campaignList, this.campaignId!, this.nativeCoin!.decimals);

          this.mainFormGroup = this.fb.group({
          
            amount: ['', [Validators.required,Validators.min(+this.campaign.minAllocationPerUser ),Validators.max(+this.campaign.maxAllocationPerUserTierTwo )]],
      
          })

          this.postponeSaleFormGroup = this.fb.group({
          
            startDate: [this.campaign.saleStartTime, [Validators.required,ValidateDateIsNotInPast]],
            endDate: [this.campaign.saleEndTime, [Validators.required,ValidateDateIsNotInPast, ValidateEndDateLaterThanStartDate]],
      
          })

          this.whitelistFormGroup = this.fb.group({
          
            enable: [this.campaign.useWhiteList, []],
            addresses: ['', [Validators.required, Validators.minLength(32), Validators.maxLength(42000) /*42 * 1000*/]],
      
          })

          

          this.validationMessages['amount'].min = `Amount must be at least ${ this.campaign.minAllocationPerUser} `
          this.validationMessages['amount'].max = `Amount must be at most ${this.campaign.maxAllocationPerUserTierTwo} `

          let now = Date.now();
          this.isOpenForPayment = this.campaign.saleStartTime.getTime() < now  && this.campaign.saleEndTime.getTime() > now && this.campaign.totalCoinReceived < this.campaign.hardCap ;
          
          // this.isOwner = this.web3Service.accounts.findIndex(f=>f==this.campaign?.owner??'none')>=0;
          this.isOwner = this.web3Service.accounts[0] == (this.campaign?.owner??'none' );

          const amount = parseFloat( this.campaign.totalCoinReceived ) ;
          const hardCap = parseFloat( this.campaign.hardCap );
          const softCap = parseFloat( this.campaign.softCap );

          this.saleProgress = 100 * Math.min( amount/softCap ,  amount/ hardCap)
          if(this.saleProgress==100){
            this.saleProgress = 100 * amount/ hardCap;
          }

          this.campaignContract = await this.campaignService.getCampaignContractWithSigner(this.campaign!.campaignAddress)


          const blockNumber = 15076474 ; // number of the block you want to get timestamp of
          const provider = this.web3Service.ethersProvider;

          const timestamp = (await provider!.getBlock(blockNumber)).timestamp;

          console.log('timestamp: ', timestamp, ', date stamp: ', new Date().getTime()/1000 )
              
        }
        
      })
      
    })

    


    this.titleService.setTitle('Participate in Campaign | ZSale');

    
  }

  
  onFormChanges(): void {
    
    this.formSubscriptions.push(  
      this.whitelistFormGroup.get('enable')!.valueChanges.subscribe(val => {
        if(val===true){
          this.whitelistFormGroup.get('addresses')!.enable()
          
        }else{
          this.whitelistFormGroup.get('addresses')!.disable()
        }
        
      }) 
    );



    //defaults
    this.whitelistFormGroup.get('enable')!.disable();

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
    this.formSubscriptions.forEach( sub=>{
      sub.unsubscribe();
    });
  }



  async submitBid(){
    
    this.submittingBid=true;    
    const amount = this.mainFormGroup.get('amount')?.value;
    const campaignContract = this.campaignContract ;// await this.campaignService.getCampaignContractWithSigner(this.campaign!.campaignAddress)
    // not defining `data` field will use the default value - empty data
    this.spinner.show();

    const gasFeeData = (await this.web3Service.getFeeData())!;
    let proof =[];
    try{
      if(this.campaign!.useWhiteList === true){
        try{  
          const c = {
            id: this.campaignId,
            chain: this.userChain,
            address: this.web3Service.accounts[0]
          };
          //const data =  await this.http.post<any>(`${environment.BaseApiUrl}/campaigns/proof`, c).toPromise();
          const data =  await firstValueFrom(this.http.post<any>(`${environment.BaseApiUrl}/campaigns/proof`, c));
                
          proof = data.proof;
  
        }catch(eerr) {
            console.error(eerr);
            this.submittingBid=false;
            this.spinner.hide();
            this.showToast('Oops!','Something went wrong or you are not in whitelist', 'danger');
            return;
        }
      }

      let tx = await campaignContract.submitBid(proof, {
        value: utils.parseEther(amount.toString()),
        maxFeePerGas: gasFeeData.maxFeePerGas,// should use geasprice for bsc, since it doesnt support eip 1559 yet
        maxPriorityFeePerGas: gasFeeData.maxPriorityFeePerGas
      } );
      let txRes = await tx.wait();           
      
      this.showToast('Success!','Your bid has been sent succesfully!');
      // alert('Your bid has been sent succesfully');
      this.submittingBid=false;

      window.location.reload(); 
    }catch(err){
      console.error(err);
      this.spinner.hide();
      this.submittingBid=false;
      
      this.showToast('Oops!','Your Bid Failed', 'danger');

    }
  }


  
  postponeSale(){
    //this.spinner.show();
    this.postponeSaleModalVisible=true;


  }

 

  closePostponeModal(){
    this.postponeSaleModalVisible=false;
  }

  async submitPostpone(){
      this.spinner.show();
      const campaignContract = this.campaignContract ;// await this.campaignService.getCampaignContractWithSigner(this.campaign!.campaignAddress)
      
      const gasFeeData = (await this.web3Service.getFeeData())!;  
      try{
        let tx = await campaignContract.postponeSale( Math.floor(Date.parse(this.postponeSaleFormGroup.get('startDate')?.value) / 1000), Math.floor(Date.parse(this.postponeSaleFormGroup.get('endDate')?.value) / 1000), {
          maxFeePerGas: gasFeeData.maxFeePerGas,// should use geasprice for bsc, since it doesnt support eip 1559 yet
          maxPriorityFeePerGas: gasFeeData.maxPriorityFeePerGas
        } );
        let txRes = await tx.wait();           
        
        this.showToast('Success!','Your Campaign  has been postponed succesfully!');
        this.spinner.hide();
        this.postponeSaleModalVisible=false;
        window.location.reload(); 
      }catch(err){
        console.error(err);
        this.spinner.hide();
        this.postponeSaleModalVisible=false;
        this.showToast('Oops!','Campaign Postponement Failed', 'danger');

      }

  }

  showWhitelist(){
    //this.spinner.show();
    this.whitelistModalVisible=true;


  }

  closeWhitelistModal(){
    this.whitelistModalVisible=false;
  }


  async submitWhitelist(){
    this.spinner.show();
    const campaignContract = this.campaignContract ;// await this.campaignService.getCampaignContractWithSigner(this.campaign!.campaignAddress)
    const gasFeeData = (await this.web3Service.getFeeData())!; 

    let tx ;

    if(this.whitelistFormGroup.get('enable')!.value === true){
      const signer = this.web3Service.ethersSigner;      
      const ethAddress = await signer!.getAddress();
      const messageSignature = await signer!.signMessage(ethAddress);

      const addresses = this.whitelistFormGroup.get('addresses')!.value.split(/[, \n]+/).map((m: string) => m.trim());
      
      
      var uniqueAddresses = addresses.filter((value: any, index: number, self: any) => {
        return self.indexOf(value) === index;
      });
      
      const campaign = {
          id: this.campaignId,
          chain: this.userChain,
          address: this.web3Service.accounts[0],
          addresses: uniqueAddresses,
          signatureHash: messageSignature,
          campaignContractAddress: this.campaign!.saleAddress
      };
      
      try{
        // await this.http.post<any>(`${environment.BaseApiUrl}/campaigns/whitelist`, campaign).toPromise();
        await firstValueFrom(this.http.post<any>(`${environment.BaseApiUrl}/campaigns/whitelist`, campaign));
        const leafNodes = campaign.addresses.map((i: string) => {        
            const packed = ethers.utils.solidityPack(["address"], [ i]);
            return keccak256(packed);          
          });
          
          // Generate merkleTree from leafNodes
          const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
          // Get root hash from merkle tree
          const merkleRoot = merkleTree.getRoot();

          tx = await campaignContract.submitTier2Whitelist( merkleRoot, {
            maxFeePerGas: gasFeeData.maxFeePerGas,// should use geasprice for bsc, since it doesnt support eip 1559 yet
            maxPriorityFeePerGas: gasFeeData.maxPriorityFeePerGas
          });
      }catch(eerr) {
        console.error(eerr);
        this.spinner.hide();
        this.whitelistModalVisible=false;
        this.showToast('Oops!','Campaign Whitelisting Failed', 'danger');
        return;
      }

      
    }else{
      tx = await campaignContract.disableTier2Whitelist( {
        maxFeePerGas: gasFeeData.maxFeePerGas,// should use geasprice for bsc, since it doesnt support eip 1559 yet
        maxPriorityFeePerGas: gasFeeData.maxPriorityFeePerGas
      });
    }

     
    try{
      

      
      let txRes = await tx.wait();           
      
      this.showToast('Success!','Campaign  whitelisting succesful!');
      this.spinner.hide();
      this.whitelistModalVisible=false;
      window.location.reload(); 
    }catch(err){
      console.error(err);
      this.spinner.hide();
      this.whitelistModalVisible=false;
      this.showToast('Oops!','Campaign whitelisting Failed', 'danger');

    }

  }

  

  async viewCurrentWhitelist(){
    this.spinner.show();
    this.viewWhitelistModalVisible= true;

    if(this.whitelist ){
      this.spinner.hide();
      
    }else{
      let result = await firstValueFrom(this.http.get<any>(`${environment.BaseApiUrl}/campaigns/list/${this.userChain}/${this.campaignId}`));
      this.whitelist = result.addresses;

      this.spinner.hide();
    }
    

  }

  closeViewWhitelistModal(){
    this.viewWhitelistModalVisible=false;
  }



  async transferTokens(){
    const currentChain = (await this.web3Service.getCurrentChain())!;
    const currentChainId = currentChain.chainId;
  
    this.spinner.show();
    const campaignListContract = new Contract(contractList[currentChainId].campaignList, CampaignListAbi, this.web3Service.signer);
    
    if(this.campaign?.campaignAddress ){
      try{
        this.showToast('Working!','Transferring Tokens to Campaign');
        const transferTokenTx = await campaignListContract.transferTokens(this.campaign?.campaignAddress);        
        let transfrTxResult =   await transferTokenTx.wait();

        this.spinner.hide();

        this.showToast('Success!','Tokens Transferred Successfully.Page will be reloaded.');
        
        window.location.reload(); 
      }catch(err){
        console.error('error transferring Tokens to campaign: ', err)
        this.showToast('Oops!','Transferring Tokens to Campaign Created Failed', 'danger');
      }
      
    }
    

    this.spinner.hide();

    
  }


  async cancelSale() {
    if(window.confirm('Are you sure you want to Cancel this Campaign?')){
      this.spinner.show();
      const campaignContract = this.campaignContract ;// await this.campaignService.getCampaignContractWithSigner(this.campaign!.campaignAddress)
      
      const gasFeeData = (await this.web3Service.getFeeData())!;  
      try{
        let tx = await campaignContract.cancelCampaign( {
          // maxFeePerGas: gasFeeData.maxFeePerGas,// should use geasprice for bsc, since it doesnt support eip 1559 yet
          // maxPriorityFeePerGas: gasFeeData.maxPriorityFeePerGas
        } );
        let txRes = await tx.wait();           
        
        this.showToast('Success!','Your Campaign  has been cancelled succesfully!');
        this.spinner.hide();        
        window.location.reload(); 
      }catch(err){
        console.error(err);
        this.spinner.hide();        
        this.showToast('Oops!','Campaign cancellation Failed', 'danger');

      }
    }
  };

  async finalizeSale() {
    if(window.confirm('Are you sure you want to Finalize this Campaign?')){
      this.spinner.show();
      const campaignContract = this.campaignContract ;// await this.campaignService.getCampaignContractWithSigner(this.campaign!.campaignAddress)
      
      const gasFeeData = (await this.web3Service.getFeeData())!;  
      try{
        let tx = await campaignContract.finalizeAndSetupLiquidity( {
          // maxFeePerGas: gasFeeData.maxFeePerGas,// should use geasprice for bsc, since it doesnt support eip 1559 yet
          // maxPriorityFeePerGas: gasFeeData.maxPriorityFeePerGas
        } );
        let txRes = await tx.wait();           
        
        this.showToast('Success!','Your Campaign  has been finalized succesfully!');
        this.spinner.hide();        
        window.location.reload(); 
      }catch(err){
        console.error(err);
        this.spinner.hide();        
        this.showToast('Oops!','Campaign finalization Failed', 'danger');

      }
    }
    
  };

  async withdrawInvestorTokens() {
    if(window.confirm('Are you sure you want to Withdraw from this Campaign?')){
      this.spinner.show();
      
      
      const gasFeeData = (await this.web3Service.getFeeData())!;  
      try{
        const campaignContract = this.campaignContract ;// await this.campaignService.getCampaignContractWithSigner(this.campaign!.campaignAddress)
        let tx = await campaignContract.withdrawFunds( {
          // maxFeePerGas: gasFeeData.maxFeePerGas,// should use geasprice for bsc, since it doesnt support eip 1559 yet
          // maxPriorityFeePerGas: gasFeeData.maxPriorityFeePerGas
        } );
        let txRes = await tx.wait();           
        
        this.showToast('Success!','Campaign  funds has been sent to you succesfully!');
        this.spinner.hide();        
        window.location.reload(); 
      }catch(err){
        console.error(err);
        this.spinner.hide();        
        this.showToast('Oops!','Withdrawal Failed', 'danger');

      }
    }
  };

  async withdrawOwnerTokens() {
    if(window.confirm('Are you sure you want to Withdraw Tokens from this Campaign?')){
      this.spinner.show();
      
      
      const gasFeeData = (await this.web3Service.getFeeData())!;  
      try{
        const campaignContract = this.campaignContract ;// await this.campaignService.getCampaignContractWithSigner(this.campaign!.campaignAddress)
        let tx = await campaignContract.withdrawOwnerTokens( {
          // maxFeePerGas: gasFeeData.maxFeePerGas,// should use geasprice for bsc, since it doesnt support eip 1559 yet
          // maxPriorityFeePerGas: gasFeeData.maxPriorityFeePerGas
        } );
        
        let txRes = await tx.wait();           
        this.showToast('Success!','Campaign  funds has been sent to you succesfully!');
        this.spinner.hide();        
        window.location.reload(); 
      }catch(err){
        console.error(err);
        this.spinner.hide();        
        this.showToast('Oops!','Withdrawal Failed', 'danger');

      }
    }

  };
  


  onCountdownfinish(){
    window.location.reload(); 
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
