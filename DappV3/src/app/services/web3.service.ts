import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Web3ModalService} from '@mindsorg/web3modal-angular';
import { Web3Provider } from '@ethersproject/providers';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private _accountsObservable = new BehaviorSubject<string[]>([]);
  public readonly accounts$: Observable<string[]> = this._accountsObservable.asObservable();
  ethers:  any;
  provider: any | undefined;
  web3Provider: Web3Provider| undefined;
  // accounts: string[] | undefined;
  // balance: string | undefined;

  @Output() onConnect: EventEmitter<any> = new EventEmitter();
  @Output() onDisConnect: EventEmitter<void> = new EventEmitter();

  

  constructor(private web3modalService: Web3ModalService) {
    const cachedProvider =   window.localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER');
    if (cachedProvider) {
      this.web3modalService.setCachedProvider(cachedProvider);
      
      setTimeout(()=>{
        this.connect().then(()=>{
        
        })
      }, 3000)
    }
  }

  get accounts(){
    return this._accountsObservable.getValue();
  }

  async connect() {
    // this.provider = await this.web3Modal.connect(); // set provider
    // if (this.provider) {
    //   this.web3js = new Web3(this.provider);
    // } // create web3 instance
    // this.accounts = await this.web3js.eth.getAccounts();
    // return this.accounts;

    

    this.provider = await this.web3modalService.open();
    this.web3Provider = new Web3Provider(this.provider);
    this.onConnect.emit(this.provider);
    this.createProviderHooks(this.provider);
    this._accountsObservable.next(await this.web3Provider.listAccounts());
    
  }

  // async accountInfo(account: any[]){
  //   const initialvalue = await this.web3js.eth.getBalance(account);
  //   this.balance = this.web3js.utils.fromWei(initialvalue , 'ether');
  //   return this.balance;
  // }

  createProviderHooks(provider: any) {

    console.log(' I am doing hooks')
    console.log(provider)
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

      // // If the cached provider is not cleared,
      // // WalletConnect will default to the existing session
      // // and does not allow to re-scan the QR code with a new wallet.
      // // Depending on your use case you may want or want not his behavir.      
      // await web3Modal.clearCachedProvider();

      this.web3modalService.close();
      this.provider = null;
    }

    this._accountsObservable.next([]);
    this.onDisConnect.emit();
  }

  async connectToCachedProvider(cachedProvider: string){
    if(cachedProvider){
      if(cachedProvider=='injceted'){
        let provider = null;
        if (typeof window.ethereum !== 'undefined') {
          provider = window.ethereum;
          try {
            await provider.request({ method: 'eth_requestAccounts' })
          } catch (error) {
            throw new Error("User Rejected");
          }
        } else if (window.web3) {
          provider = window.web3.currentProvider;
        } else if (window.celo) {
          provider = window.celo;
        } else {
          throw new Error("No Web3 Provider found");
        }
        return provider;
      }else if (typeof window.ethereum !== 'undefined'){

      }
    }

    return null;
  }

}
