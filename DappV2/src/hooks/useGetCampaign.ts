import { erc20ABI, useAccount, useContract, useContractRead, useNetwork,  useSigner } from 'wagmi';
import CampaignListABI from '../constants/campaign-list-abi.json';
import CampaignABI from '../constants/campaign-abi.json';
import { useAsyncRetry } from 'react-use';
import {Contract} from 'ethers';

// export function usePools() {
//     const chainId = useChainId()
//     return useAsyncRetry(() => PluginPooltogetherRPC.fetchPools(chainId), [chainId])
// }

export function useGetCampaign(campaignListaddress: string, campaignId: string, signer: any) {
    // const [{ data: signer, error, loading }, getSigner] = useSigner()

    
    const listContract = useContract({
        addressOrName: campaignListaddress,
        contractInterface: CampaignListABI,
        signerOrProvider: signer
    });   
    
    
    return useAsyncRetry(async () => {
        
        const [success,cmpAddress] = await listContract.tryGetCampaignByKey(campaignId);
        
        const campaignContract = new Contract(cmpAddress, CampaignABI, signer);
        let cmp = await campaignContract.getCampaignInfo();
        
        let liquidityReleaseTime = cmp._liquidityReleaseTime;
        let tokenAddress = (await campaignContract.saleInfo()).tokenAddress;

        const tokenContract = new Contract(tokenAddress, erc20ABI, signer);
        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();
        const totalSupply = await tokenContract.totalSupply();

        let maxAllocationPerUserTierOne= await campaignContract.maxAllocationPerUserTierOne();
        let maxAllocationPerUserTierTwo= await campaignContract.maxAllocationPerUserTierTwo();

        const otherInfo = await campaignContract.otherInfo();
        const logoUrl = otherInfo.logoUrl;
        const hasKYC = otherInfo.hasKYC;
        const isAudited = otherInfo.isAudited;
        const totalCoinReceived = await campaignContract.totalCoinReceived();
        const owner = await campaignContract.owner();
        
        return {
            ...cmp,
            saleAddress: cmpAddress, 
            name,
            symbol,
            totalSupply,            
            tokenAddress,  
            liquidityReleaseTime, 
            maxAllocationPerUserTierOne ,
            maxAllocationPerUserTierTwo,
            campaignAddress: cmpAddress,
            logoUrl,
            hasKYC,
            isAudited,
            totalCoinReceived : totalCoinReceived??0,
            owner: owner
        };
    }, [ signer, listContract]) //loading
}
