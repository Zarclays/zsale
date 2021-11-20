import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';

import { ModalComponent } from './modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import Web3 from "web3";
import Web3Modal from "web3modal";




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ZSales';
  version = 'NG version 12.2.12';
  items: any[] = [
    // {
    //   name: 'bootstrap', link: 'bootstrap',
    //   elements: [
    //     { name: 'alerts', link: 'bootstrap/alerts' },
    //     { name: 'badge', link: 'bootstrap/badge' },
    //     { name: 'blockquotes', link: 'bootstrap/blockquotes' },
    //     { name: 'breadcrumb', link: 'bootstrap/breadcrumb' },
    //     { name: 'buttons', link: 'bootstrap/buttons' },
    //     { name: 'collapse', link: 'bootstrap/collapse' },
    //     { name: 'dropdowns', link: 'bootstrap/dropdowns' },
    //     { name: 'forms', link: 'bootstrap/forms' },
    //     { name: 'list-group', link: 'bootstrap/list-group' },
    //     { name: 'modal', link: 'bootstrap/modal' },
    //     { name: 'pagination', link: 'bootstrap/pagination' },
    //     { name: 'popovers', link: 'bootstrap/popovers' },
    //     { name: 'progress', link: 'bootstrap/progress' },
    //     { name: 'spinners', link: 'bootstrap/spinners' },
    //   ]
    // },
    // {
    //   name: 'Features', link: 'Features',
    //   elements: [
    //     { name: 'httpclient', link: 'httpclient' },
    //     { name: 'template-driven-forms', link: 'template-driven-forms' },
    //     { name: 'components', link: 'components' },
    //     { name: 'services', link: 'services' }
    //   ]
    // },
    // {
    //   name: 'Reactive Form', link: 'reactive-form',
    //   elements: [
    //     { name: 'prototype', link: 'reactive-form/prototype' },
    //     { name: 'form-control', link: 'reactive-form/form-control' },
    //     { name: 'form-control-class', link: 'reactive-form/form-control-class' },
    //     { name: 'form-group', link: 'reactive-form/form-group' },
    //     { name: 'form-builder', link: 'reactive-form/form-builder' },
    //     { name: 'form-builder-nested', link: 'reactive-form/form-builder-nested' },
    //     { name: 'form-array', link: 'reactive-form/form-array' },
    //     { name: 'form-multi', link: 'reactive-form/form-multi' },
    //   ]
    // },
  ];

  modalRef: MdbModalRef<ModalComponent> | undefined;

  constructor(
    public router: Router,
    public renderer: Renderer2, 
    private modalService: MdbModalService) { }

  async openWeb3Modal() {
    // this.modalRef = this.modalService.open(ModalComponent)

    // @ts-ignore
    const WalletConnectProvider = window.WalletConnectProvider.default;
    const providerOptions = {
      /* See Provider Options Section */
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          // Mikko's test key - don't copy as your mileage may vary
          // infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
        }
      },
    };
    
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions // required
    });
    
    const provider = await web3Modal.connect();
    await provider.enable();
    const web3 = new Web3(provider);



    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.getChainId();

    console.log(` add: ${address} - chain: ${chainId}`)

    // // @ts-ignore
    // const Web3Modal = window.Web3Modal.default;

    // // @ts-ignore
    // const WalletConnectProvider = window.WalletConnectProvider.default;

    // // @ts-ignore
    // const Fortmatic = window.Fortmatic;
    // // Tell Web3modal what providers we have available.
    // // Built-in web browser provider (only one can exist as a time)
    // // like MetaMask, Brave or Opera is added automatically by Web3modal
    // const providerOptions = {
    //   walletconnect: {
    //     package: WalletConnectProvider,
    //     options: {
    //       // Mikko's test key - don't copy as your mileage may vary
    //       infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
    //     }
    //   },

    //   fortmatic: {
    //     package: Fortmatic,
    //     options: {
    //       // Mikko's TESTNET api key
    //       key: "pk_test_391E26A3B43A3350"
    //     }
    //   }
    // };

    // const web3Modal = new Web3Modal({
    //   //network: "mainnet", // optional
    //   cacheProvider: true, // optional
    //   providerOptions // required
    // });

    // const provider = await web3Modal.connect();
  }

  onSelectMenu(link: any): void {
    const element = document.getElementById('bd-docs-nav');
    this.renderer.removeClass(element, 'show');
    const route = '/' + link;
    this.router.navigate([route]);
  }

  async subscribeProvider (provider: any) {
    if (!provider.on) {
      return;
    }
    // provider.on("close", () => this.resetApp());
    // provider.on("accountsChanged", async (accounts: string[]) => {
    //   await this.setState({ address: accounts[0] });
    //   await this.getAccountAssets();
    // });
    // provider.on("chainChanged", async (chainId: number) => {
    //   const { web3 } = this.state;
    //   const networkId = await web3.eth.net.getId();
    //   await this.setState({ chainId, networkId });
    //   await this.getAccountAssets();
    // });

    // provider.on("networkChanged", async (networkId: number) => {
    //   const { web3 } = this.state;
    //   const chainId = await web3.eth.chainId();
    //   await this.setState({ chainId, networkId });
    //   await this.getAccountAssets();
    // });
  }


}

