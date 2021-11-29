import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap,Router } from '@angular/router';
import { CampaignService } from '../../../services/campaign.service';
import { CampaignDetails } from '../models';
import {FormBuilder, FormGroup,FormControl, FormGroupDirective, NgForm, Validators, AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-launchpad-detail',
  templateUrl: './launchpad-detail.component.html',
  styleUrls: ['./launchpad-detail.component.scss']
})
export class LaunchpadDetailComponent implements OnInit {
  // @ts-ignore
  id: number ;

  // @ts-ignore
  details: CampaignDetails;
  // @ts-ignore
  baseTokenSymbol;
  // @ts-ignore
  frmGrp: FormGroup;

  validationMessages : {[index: string]: any} = {
    
    'amount': {
      'required': 'Refund Type is required',
      'min': 'Amount must be at least 1 ',
    }

  };

  constructor(private route: ActivatedRoute, private campaignService: CampaignService, private _formBuilder: FormBuilder, private ngRouter: Router) {}

  ngOnInit(): void {
    this.baseTokenSymbol=this.campaignService.web3Service.baseTokenSymbol;

    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.id = +params.get('id');

      setTimeout(async ()=>{
        console.log('Starting');
        
        this.details= await this.campaignService.getCampaignByIndex(this.id - 1);
        console.log(this.details);

        let totalCoinsReceived= await this.campaignService.getCampaignTotalCoinReceived(this.details.saleAddress);
        console.log(totalCoinsReceived);

        this.details.totalCoinsReceived= totalCoinsReceived;

      }, 2500);

    });

    this.frmGrp = this._formBuilder.group({

      amount: ['1', [Validators.required, Validators.min(0)]]
    });

  }

  issubmitting =false;
  async submit(){

      console.log(this.frmGrp.value);

      this.issubmitting=true;
      const accs = await this.campaignService.web3Service.web3.eth.getAccounts();
      console.log('accs: ',accs[0] );
      let tx = this.campaignService.submitBid(accs[0], this.details.saleAddress,this.frmGrp.value.amount );
      
      tx.on('confirmation', (confirmationNumber: any, receipt: any)=>  {
        // if( +confirmationNumber > 10 ){
        //   this.issubmitting=false;
        //   alert('Submission Succesful');
        //   let index = receipt.events.CampaignCreated.returnValues.index;
          

        // }
        
      })
      .on('receipt', (receipt: any)=> {
          // receipt example
          console.log(receipt);
        
          this.issubmitting=false;
          alert('Submission Succesful');

          this.ngRouter.navigate(['/launchpads', this.id]);

      })
      .on('error', (error: any, receipt: any) => { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        this.issubmitting=false;
        alert('Submission failed');
      })
      



  }

  async postponeSale(){

  }

  async cancelSale(){
    
  }

  async finalizeSale(){
    
  }

  async withdrawFunds(){
    
  }


}
