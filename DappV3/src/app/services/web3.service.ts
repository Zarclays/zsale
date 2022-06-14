import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Web3ModalService} from '@mindsorg/web3modal-angular';
import { Web3Provider , JsonRpcSigner} from '@ethersproject/providers';
import Web3Modal from "web3modal";

import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import { BigNumber , constants, ethers, utils } from 'ethers';
import { getSupportedChainById, getSupportedChainByChain } from '../models/supported-chains';
const ERC20AbiJSON = require('../../assets/ERC20.json');


@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private _accountsObservable = new BehaviorSubject<string[]>([]);
  public readonly accounts$: Observable<string[]> = this._accountsObservable.asObservable();
  // ethers:  any;
  provider: any | undefined;
  ethersProvider: Web3Provider| undefined;
  ethersSigner: JsonRpcSigner| undefined;
  // accounts: string[] | undefined;
  // balance: string | undefined;

  web3Modal: any| undefined;

  @Output() onConnect: EventEmitter<any> = new EventEmitter();
  @Output() onDisConnect: EventEmitter<void> = new EventEmitter();

  

  constructor() {

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: '8043bb2cf99347b1bfadfb233c5325c0', // required change this with your own infura id
          description: 'Scan the qr code and sign in',
          qrcodeModalOptions: {
            mobileLinks: [
              'rainbow',
              'metamask',
              'argent',
              'trust',
              'imtoken',
              'pillar'
            ]
          }
        }
      },
      fortmatic: {
        package: Fortmatic,
        options: {
          // Mikko's TESTNET api key
          key: "pk_test_391E26A3B43A3350",
          network: {
            rpcUrl: 'https://rpc-mainnet.maticvigil.com',
            chainId: 137
          }
        }
      },
      injected: {
        display: {
          logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
          name: 'metamask',
          description: "Connect with the provider in your Browser"
        },
        package: null
      },
    };

    this.web3Modal = new Web3Modal({
      // network: "mainnet", // optional change this with the net you want to use like rinkeby etc
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });


    // const cachedProvider =   window.localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER');
    // if (cachedProvider) {
    //   this.web3modalService.setCachedProvider(cachedProvider);
      
    //   setTimeout(()=>{
    //     this.connect().then(()=>{
        
    //     })
    //   }, 3000)
    // }
  }

  get accounts(){
    return this._accountsObservable.getValue();
  }

  async connect() {
    this.provider = await this.web3Modal.connect(); // set provider
    
    if (this.provider) {
      this.ethersProvider = new Web3Provider(this.provider);
      this.ethersSigner = this.ethersProvider.getSigner();  
      this.onConnect.emit(this.provider);
      this.createProviderHooks(this.provider);
      this._accountsObservable.next(await this.ethersProvider.listAccounts());
    } // create web3 instance
    
  }

  async getCurrentChainId(){
    const n = await this.ethersProvider?.getNetwork();
    return n?.chainId??83;
  }

  async getCurrentChain(){
    const chainId = await this.getCurrentChainId();
    return getSupportedChainById(chainId);
  }

  // async accountInfo(account: any[]){
  //   const initialvalue = await this.web3js.eth.getBalance(account);
  //   this.balance = this.web3js.utils.fromWei(initialvalue , 'ether');
  //   return this.balance;
  // }

  createProviderHooks(provider: any) {
    // Subscribe to accounts change
    provider.on('accountsChanged', (accounts: string[]) => {
      this.onConnect.emit(provider);    
    });

    // Subscribe to chainId change
    provider.on('chainChanged', (chainId: number) => {
        location.reload();
      //this.onConnect.emit(provider);
    });

    // Subscribe to provider connection
    provider.on('connect', (info: { chainId: number }) => {
      console.log(info);
      this.onConnect.emit(provider);
      // location.reload();
    });

    // Subscribe to provider disconnection
    provider.on('disconnect', (error: { code: number; message: string }) => {
      console.log(error);
      console.log('disconnect')
      this.onDisConnect.emit(provider);
    });
  }


  /**
   * Disconnect wallet button pressed.
   */
  async disconnect() {

    console.log("Killing the wallet connection", this.provider);

    // TODO: Which providers have close method?
    if(this.provider.close) {
      await this.provider.close();

      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavir.      
      await this.web3Modal.clearCachedProvider();

      // this.web3modalService.close();
      this.provider = null;
    }

    this._accountsObservable.next([]);
    this.onDisConnect.emit();
  }

  async switchNetwork(networkInfo: {
    chainId: number;
    chainName: string;
    rpcUrls: string[];
    blockExplorerUrls?: string[];
  }  ) {

    await this._switchNetwork(networkInfo);
  };

  async switchNetworkByChainId(newChain:  number ) {
    const c = getSupportedChainById(newChain);
    let networkInfo = {
      chainId: c?.chainId??97,
      chainName: c?.name??'',
      rpcUrls: c?.rpc??[],
      blockExplorerUrls: undefined
    };   
    await this._switchNetwork(networkInfo);
  };

  async switchNetworkByChainShortName(newChain:  string) {
    const c = getSupportedChainByChain(newChain.toUpperCase());
    let networkInfo = {
      chainId: c?.chainId??97,
      chainName: c?.name??'',
      rpcUrls: c?.rpc??[],
      blockExplorerUrls: undefined
    };   
    
    await this._switchNetwork(networkInfo);
  };

  private async  _switchNetwork(networkInfo:  {
    chainId: number;
    chainName: string;
    rpcUrls: string[];
    blockExplorerUrls?: string[];
  } ) {
    
    if(this.ethersProvider){
      try {
        //@ts-ignore
        await this.ethersProvider?.provider?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: utils.hexlify(networkInfo.chainId) }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            //@ts-ignore
            await this.ethersProvider.provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: utils.hexlify(networkInfo.chainId),
                  chainName: networkInfo.chainId, //"Polygon",
                  rpcUrls: networkInfo.rpcUrls, // ["https://polygon-rpc.com/"],
                  blockExplorerUrls: [] // ["https://polygonscan.com/"],
                },
              ],
            });
          } catch (addError) {
            console.error('Error adding network: ', addError)
            throw addError;
          }
        }
      }
    }else{
      console.warn('web3provider not instantiated::');
    }

  };


  public getERC20Contract (address: string) {
    
    const cContract = new ethers.Contract(address, ERC20AbiJSON.abi, this.ethersProvider);
    return cContract;
  }

  public async getERC20Details(address: string){
    
    let tokenInfo = await this.getERC20Contract(address);
    // @ts-ignore
    let result = { 
      name: await tokenInfo.name(),
      symbol: await tokenInfo.symbol(), 
      decimals: await tokenInfo.decimals(), 
      totalSupply: await tokenInfo.totalSupply() 
    }
    

    return result;
  }


  public async getERC20ApprovalAllowance(tokenAddressOrContract: string|ethers.Contract, approvedAddress: string){
    if(typeof tokenAddressOrContract === 'string'){
      tokenAddressOrContract = await this.getERC20Contract(tokenAddressOrContract)
    }
    const allowance = await tokenAddressOrContract.allowance(this.accounts[0], approvedAddress);
    return allowance;
  }


  public async approveERC20Contract(addressOrContract: string|ethers.Contract, addressToApprove: string, amount: any){
    if(typeof addressOrContract === 'string'){
      addressOrContract = await this.getERC20Contract(addressOrContract)
    }

    const currAllowance = await this.getERC20ApprovalAllowance(addressOrContract,addressToApprove);
    if(currAllowance.gte(BigNumber.from(amount))){
      return 'succeeded';
    }else{
      let allowanceTx = await addressOrContract.approve(addressToApprove, amount ); // Approve 1000 times the fee
      let txResult = await allowanceTx.wait();
      return txResult.status == 1 ? 'succeeded' : 'failed';
    }
    
  }

}


