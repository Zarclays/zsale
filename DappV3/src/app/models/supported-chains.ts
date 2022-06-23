import { getAllChains, getChain, IChainData } from 'evm-chains';


interface ZChainData extends IChainData{
    
    isTestNet: boolean;
    creationFee: number;
}

const cList =  {
    "eth": {
        chainId: 1,
        creationFee: 0.001
    },
    "bsc": {
        chainId: 56,
        creationFee: 0.001
    },
    "bsct": {
        chainId: 97,
        creationFee: 0.001
    },
    "hrdt": {
        chainId: 31337,
        creationFee: 0.001
    }, 
    "mtr": {
        chainId: 82,
        creationFee: 0.001
    },

    "mtrt": {
        chainId: 83,
        creationFee: 0.001
    }, 

    "aurt": {
        chainId: 1313161555,
        creationFee: 0.001
    }
    
};

const supportedChains: ZChainData[] = [];

function getSupportedChains(){
    if(!supportedChains || supportedChains.length<1){
        for (const iterator in cList) {
            const chainId = +cList[iterator].chainId;
            try{
                const chain: ZChainData = getChain(chainId) as ZChainData;
                if(chain.name.toLowerCase().indexOf("testnet")>-1){
                    chain.isTestNet=true;
                    chain.chain+="T";
                }
                chain.creationFee= cList[iterator].creationFee;
                supportedChains.push(chain);
            }catch(err){
                // console.log('cant find chain ',cList[iterator], ' - ', chainId)
            }
            
        }
        supportedChains.push({
            name: 'Hardhat Testnet',
            chainId: 31337,
            shortName: "hrdt",
            chain: "HRDT",
            network: "Hardhat",
            networkId: 31337,
            nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
            },
            rpc: ["https://rpctest.meter.io"],
            faucets: [],
            infoURL: "",
            isTestNet: true,
            creationFee: 0.001
    
        });

        supportedChains.push({
            name: 'Meter Testnet',
            chainId: 83,
            shortName: "mtrt",
            chain: "MTRT",
            network: "Meter",
            networkId: 83,
            nativeCurrency: {
                name: "Meter",
                symbol: "MTR",
                decimals: 18,
            },
            rpc: ["https://rpctest.meter.io"],
            faucets: [],
            infoURL: "",
            isTestNet: true,
            creationFee: 0.001
    
        });

        supportedChains.push({
            name: 'Meter',
            chainId: 82,
            shortName: "mtr",
            chain: "MTR",
            network: "Meter",
            networkId: 82,
            nativeCurrency: {
                name: "Meter",
                symbol: "MTR",
                decimals: 18,
            },
            rpc: ["https://rpc.meter.io"],
            faucets: [],
            infoURL: "",
            isTestNet: false,
            creationFee: 5
    
        })


    }
    // console.log('supportedChains ',supportedChains)

    
    return supportedChains;
}

export function getSupportedChainById(chainId: number): ZChainData|undefined{
    if(supportedChains && supportedChains.length>0){
        return supportedChains.filter(f=>f.chainId==chainId)[0];
    }    
    return undefined;
}

export function getSupportedChainByChain(chain: string): ZChainData|undefined{
    
    if(supportedChains && supportedChains.length>0){
        return supportedChains.filter(f=>f.chain==chain)[0];
    }    
    return undefined;
}




export default getSupportedChains;