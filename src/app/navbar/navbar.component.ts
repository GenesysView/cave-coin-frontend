import { Component, OnInit } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
declare let window: any;
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
const Web3 = require('web3');
import { BscConnector } from '@binance-chain/bsc-connector'
import { GeneralService } from '../services/general.service';
import { HomeComponent } from '../home/home.component';
import { DetailComponent } from '../detail/detail.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLogin = false;
  constructor(
    private generalService: GeneralService,
  ) { }

  ngOnInit(): void {
    // this.conectMetaMask();
  }

  ngAfterViewInit(){
    let address = localStorage.getItem('mwl');
    if(address != null){
      this.isLogin = true;
    }
  }


  async conectMetaMask() {
    const provider = await detectEthereumProvider();

    if (provider) {
      console.log('User accepted access');
      try {
        let balance = await window.ethereum
          .request({
            method: 'eth_getBalance',
            params: ['0x00c4B398500645eb5dA00a1a379a88B11683ba01', "latest"],
          })
        // covert to readable format (account for decimals)
        let read = parseInt(balance) / 10 ** 18; // will need change based on what token
        console.log("Smart Contract Token Balance:" + read.toFixed(5));

      } catch (error) {
        console.log(error);
      }
      this.startApp(provider); // Initialize your app
    } else {
      console.log('Please install MetaMask!');
    }
  }

  startApp(provider: any) {
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?');
    }
    // Access the decentralized web!
    console.log(' Access the decentralized web!');

    window.ethereum
      .request({ method: 'eth_accounts' })
      .then(this.handleAccountsChanged)
      .catch((err: any) => {
        // Some unexpected error.
        // For backwards compatibility reasons, if no accounts are available,
        // eth_accounts will return an empty array.
        console.error(err);
      });

    window.ethereum.on('accountsChanged', this.handleAccountsChanged);

  }

  handleAccountsChanged(accounts: any) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
    }
    // else if (accounts[0] !== this.currentAccount) {
    //   this.currentAccount = accounts[0];
    //   // Do any other work!
    //   console.log('this.currentAccount', this.currentAccount);

    // }
    else {
      // Do any other work!
      console.log('this.currentAccount', accounts[0]);
      localStorage.setItem('mwl',accounts[0]);
      window.ethereum.on('wallet_watchAsset', (res: any) => { console.log('res', res); });
      window.location.reload();
    }
  }

  connect() {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(this.handleAccountsChanged)
      .catch((err: any) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('--Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
  }

  connectTrushWallet() {
    console.log('connectTrushWallet');

    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required  
      qrcodeModal: QRCodeModal,
    });

    console.log('connector.connected', connector.connected);

    // Check if connection is already established
    // if (!connector.connected) {
    if (!connector.connected) {
      // create new session  
      console.log('createSession', connector.connected);

      connector.createSession();
    } else {
      connector.killSession();
    }

    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
      if (error) { throw error; }
      // Get provided accounts and chainId  
      const { accounts, chainId } = payload.params[0];
      console.log('trustwallwet accounts', accounts);
      console.log('trustwallwet chainId', chainId);
      // this.generalService.updateTokenWallet(accounts[0]);
      // GeneralService.tokenWallet  = accounts[0];
      localStorage.setItem('mwl',accounts[0]);
      HomeComponent.tokenWallet.setValue(accounts[0]);
      DetailComponent.tokenWallet.setValue(accounts[0]);
      window.location.reload();
    });

    connector.on("session_update", (error, payload) => {
      if (error) { throw error; }  // Get updated accounts and chainId  
      const { accounts, chainId } = payload.params[0];
      console.log('trustwallwet session_update accounts', accounts);
      console.log('trustwallwet session_update chainId', chainId);
    });

    connector.on("disconnect", (error, payload) => {
      if (error) { throw error; }  // Delete connector
    });

  }

  async connectBsc() {
    let eth: any = new Web3();
    let bloqueinicialhex = eth.utils.numberToHex(56);
    console.log('bloqueinicialhex', bloqueinicialhex);

    window.ethereum
      .request(
        { 
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: bloqueinicialhex }]
        }
      )
      .then(this.handleAccountsChanged)
      .catch((err: any) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('--Please connect to MetaMask.');
        } else {
          console.error(err);
        }
        this.connect();
      });
  }

  closeWallet(){
    localStorage.removeItem('mwl');
    window.location.reload();
  }

}

