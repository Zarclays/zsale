/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const HDWalletProvider = require('@truffle/hdwallet-provider');
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();
const mnemonic = "doll found upset asthma hard future diamond plug fox fly city orient";
require('dotenv').config();
// require('dotenv').config({path: '.env'});

const ContractKit = require('@celo/contractkit')
const Web3 = require('web3');


const web3 = new Web3(process.env.CELO_RPC_URL);
const client = ContractKit.newKitFromWeb3(web3);  

const getCeloAccount = require('./getCeloAccount').getAccount
let account = getCeloAccount();
console.log('address: ',account.address)
console.log('PRVV: ',account.privateKey)
client.connection.addAccount(account.privateKey)


module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
     development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
     develop: {
      port: 9545,
      network_id: 20,
      accounts: 5,
      defaultEtherBalance: 500,
      blockTime: 3
    },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websocket: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
    alfajores: {
      provider: client.connection.web3.currentProvider, // CeloProvider
      network_id: 44787  // latest Alfajores network id
    },
    celoMainnet:{
      provider: client.connection.web3.currentProvider, // CeloProvider  () => new HDWalletProvider(mnemonic, "https://forno.celo.org"),
      network_id: 42220,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    BinanceTestnet: {
      networkCheckTimeout: 10000, 
      provider: ()=> new HDWalletProvider({
        //  privateKeys: [process.env.BSC_PRIVATE_KEY, process.env.BSC_PRIV_2, process.env.BSC_PRIV_3],
         privateKeys: [ '0x8d3158f330d95475cde8c03c592dc85a20fdc8aae3a9bf5cb71292bd2a86cf33'],
         providerOrUrl: 'https://data-seed-prebsc-2-s2.binance.org:8545'
       }),
      
      network_id: "97",       // Any network (default: none)
      gas: 10000000,
      gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    },
    Bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`),
      network_id: 3,       // Ropsten's id
     // gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 10,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
     // },
     // Useful for private networks
     // private: {
     // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
     // network_id: 2111,   // This network is yours, in the cloud.
     // production: true    // Treats this network as if it was a public net. (default: false)
    },
   
    gorli: {
      provider: () => new HDWalletProvider(mnemonic, "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"),
      network_id: 5,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true

    },
    rinkbery: {
      provider: () => new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/a078a649555c418ba0a3d39c2b0f5ec8"),
      network_id: 4,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    etheriumMainnet: {
      provider: () => new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"),
      network_id: 1,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    
    kovanTestnet: {
      provider: () => new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"),
      network_id: 42,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.10",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
       // evmVersion: "byzantium"
      }
    }
  }

  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
    // enabled: false,
    // host: "127.0.0.1",
    // adapter: {
    //   name: "sqlite",
    //   settings: {
    //     directory: ".db"
    //   }
    // }
  // }
};
