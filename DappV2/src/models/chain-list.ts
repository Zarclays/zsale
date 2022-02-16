import { Chain } from 'wagmi';
import {
  defaultChains, // mainnet, rinkeby, etc.
  defaultL2Chains, // arbitrum, polygon, etc.
  developmentChains, // localhost
} from 'wagmi';

let ChainList = defaultChains;


ChainList.push({
  id: 97,
  name: 'BSCTestnet',
  nativeCurrency: {
      decimals: 18,
      name:'BNB',
      symbol: 'BNB'
  },
  rpcUrls: [
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s2.binance.org:8545'
  ],
  testnet: true
})

export default ChainList;