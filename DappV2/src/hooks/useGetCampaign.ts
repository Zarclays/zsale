import { erc20ABI, useAccount, useContract, useContractRead, useNetwork,  useSigner } from 'wagmi';
import CampaignListABI from '../constants/campaign-list-abi.json';
import CampaignABI from '../constants/campaign-abi.json';
import { useAsyncRetry } from 'react-use';
import {Contract} from 'ethers';

// export function usePools() {
//     const chainId = useChainId()
//     return useAsyncRetry(() => PluginPooltogetherRPC.fetchPools(chainId), [chainId])
// }

export function useGetCampaign(campaignListaddress: string, campaignId: string) {
    const [{ data: signer, error, loading }, getSigner] = useSigner()

    
    const listContract = useContract({
        addressOrName: campaignListaddress,
        contractInterface: CampaignListABI,
        signerOrProvider: signer
    });
    
    
    
    return useAsyncRetry(async () => {
        
        const [success,cmpAddress] = await listContract.tryGetCampaignByKey(campaignId);
        
        const campaignContract = new Contract(cmpAddress, CampaignABI, signer);
        let cmp = await campaignContract.getCampaignInfo();
        
        return {saleAddress: cmpAddress, details: cmp};
    }, [signer])
}
