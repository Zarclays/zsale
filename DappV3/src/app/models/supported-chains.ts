import { getAllChains, getChain, IChainData } from 'evm-chains';


interface ZChainData extends IChainData{
    
    isTestNet: boolean;
}

const cList =  {
    "eth": 1,
    "bsc":56,
    "bsct":97,
    "hrdt":31337, 
    "mtr":82,

    "mtrt":83, 

    "aurt": 1313161555
    
};

const supportedChains: ZChainData[] = [];

function getSupportedChains(){
    if(!supportedChains || supportedChains.length<1){
        for (const iterator in cList) {
            const chainId = +cList[iterator];
            try{
                const chain: ZChainData = getChain(chainId) as ZChainData;
                if(chain.name.toLowerCase().indexOf("testnet")>-1){
                    chain.isTestNet=true;
                    chain.chain+="T";
                }
                supportedChains.push(chain);
            }catch(err){
                // console.log('cant find chain ',cList[iterator], ' - ', chainId)
            }
            
        }
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
            isTestNet: true
    
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
            isTestNet: false
    
        })


    }
    // console.log('supportedChains ',supportedChains)

    
    return supportedChains;
}

export function getSupportedChainById(chainId: number){
    if(supportedChains && supportedChains.length>0){
        return supportedChains.filter(f=>f.chainId==chainId)[0];
    }    
    return null;
}

export function getSupportedChainByChain(chain: string){
    console.log('suported::', supportedChains);
    if(supportedChains && supportedChains.length>0){
        return supportedChains.filter(f=>f.chain==chain)[0];
    }    
    return null;
}




export default getSupportedChains;