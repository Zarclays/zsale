import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3.service';
import { ethers } from 'ethers';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { connected } from 'process';
import { ListTokenComponent } from '../list-token/list-token.component';

@Component({
  selector: 'app-token-minter',
  templateUrl: './token-minter.component.html',
  styleUrls: ['./token-minter.component.scss']
})
export class TokenMinterComponent implements OnInit {

  userChain: string|null = 'mtrt';
  web3ServiceConnect$: Subscription|undefined;

  constructor(public web3Service: Web3Service,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.userChain = params['chain'];
      
      const messagealert = {
        connectedWallet: 'Welcome ',
        noConnectedWallet: 'Please connect your wallet to be able to gain access to our token minter',
        checkSupport: 'Wait while we check if your current chinId is Supported by our site',
        supportedChain: 'You can now proceed',
        noSupportedChin: 'Sorry We dont support your current chain.',
        supportedChains: 'Ethereum, Binace Smart Chiain (Testnet And Mainet), HardHat (Testnet), Meter (Testnet And Mainet), Aurt',
        changeChinId: 'Do you want to change to supported chian Id?',
        redirect: 'You will be redirected to home page if you need to come back make sure you are have the supported chains and be connected Thank You!!!',
      }
      const cIds = {
        "eth": {
          chainId: 1,
        },
      "bsc": {
          chainId: 56,
        },
      "bsct": {
          chainId: 97,
        },
      "hrdt": {
          chainId: 31337,
        }, 
      "mtr": {
          chainId: 82,
        },
  
      "mtrt": {
          chainId: 83,
        }, 
  
      "aurt": {
          chainId: 1313161555,
        }
      }

      this.web3ServiceConnect$ = this.web3Service.onConnectChange.subscribe(async (connected: boolean)=>{
        if(connected){
          alert(messagealert.connectedWallet + messagealert.checkSupport)
          if(this.userChain){
            await this.web3Service.switchNetworkByChainShortName(this.userChain);
          }

          const currentChainId = await this.web3Service.getCurrentChainId();
          if(currentChainId == cIds.eth.chainId){
            alert(messagealert.supportedChain)
          }else if(currentChainId == cIds.bsc.chainId){
            alert(messagealert.supportedChain)
          }else if(currentChainId == cIds.bsct.chainId){
            alert(messagealert.supportedChain)
          }else if(currentChainId == cIds.hrdt.chainId){
            alert(messagealert.supportedChain)
          }else if(currentChainId == cIds.mtr.chainId){
            alert(messagealert.supportedChain)
          }else if(currentChainId == cIds.mtrt.chainId){
            alert(messagealert.supportedChain)
          }else if(currentChainId == cIds.aurt.chainId){
            alert(messagealert.supportedChain)
          }else {
            alert(messagealert.noSupportedChin + messagealert.supportedChains)
            var response = prompt(messagealert.changeChinId);
            if(response == 'yes'){
              // This is to popup metamask and make user select the supported chain in their wallet and swithch to it 
            }else {
              alert(messagealert.noSupportedChin + messagealert.redirect);
              this.router.navigate([ListTokenComponent]);
            }
          }
        }else {
          alert("You need to connect to your wallet to continue")
          this.router.navigate([ListTokenComponent]);
        }
      })
    })
  }

}
