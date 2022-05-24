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

// ChainList.push({
//   id: 31337,
//   name: 'NEAR EVM Testnet',
//   nativeCurrency: {
//       decimals: 18,
//       name:'NEAR',
//       symbol: 'NEAR'
//   },
//   rpcUrls: [
//       'http://127.0.0.1:8545'
//   ],
//   testnet: true
// })

ChainList.push({
  id: 1313161555,
  name: 'Aurora Near Testnet',
  nativeCurrency: {
      decimals: 18,
      name:'aETH',
      symbol: 'aETH'
  },
  rpcUrls: [
      'https://testnet.aurora.dev/'
  ],
  testnet: true
})

ChainList.push({
  id: 83,
  name: 'Meter Testnet',
  nativeCurrency: {
      decimals: 18,
      name:'MTR',
      symbol: 'MTR'
  },
  rpcUrls: [
      'https://rpctest.meter.io'
  ],
  testnet: true
})

ChainList.push({
  id: 31337,
  name: 'Hardhat',
  nativeCurrency: {
      decimals: 18,
      name:'ETH',
      symbol: 'ETH'
  },
  rpcUrls: [
      'https://rpctest.meter.io'
  ],
  testnet: true
})



// Add CELO(test), HEdera, Findora,


export default ChainList;