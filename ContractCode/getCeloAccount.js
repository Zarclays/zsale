const ContractKit =  require('@celo/contractkit');

const fs = require('fs')
const fsp = require('fs').promises;

const path = require('path')
const Web3 =  require('web3');

require('dotenv').config();

const filePath = path.join(__dirname, './.secret')

const getAccount =  ()  =>  {
    let account;
    let usingExistingWallet = true;
    const web3 =  new  Web3(process.env.CELO_RPC_URL);

    if(fs.existsSync(filePath)){
        
        let data = fs.readFileSync(filePath, {encoding: 'utf-8'})
        // let data = await fsp.readFile(filePath, {encoding: 'utf-8'})
        account=  web3.eth.accounts.privateKeyToAccount(data);

    }else{
        usingExistingWallet=false;
        
        const client = ContractKit.newKitFromWeb3(web3);
        account = web3.eth.accounts.create();
        
        fs.writeFileSync(filePath, account.privateKey);
        // await fsp.writeFile(filePath, account.privateKey);
        
    }
    console.log(`${(usingExistingWallet?'Existing':'')}  Celo address: ${ account.address}`);
    console.log('privateKey: ', account.privateKey);
    return account;
};

module.exports = {
    getAccount
}