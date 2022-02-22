import { erc20ABI, useAccount, useContract, useContractRead, useNetwork,  useSigner } from 'wagmi';

import { useAsyncRetry } from 'react-use'

// export function usePools() {
//     const chainId = useChainId()
//     return useAsyncRetry(() => PluginPooltogetherRPC.fetchPools(chainId), [chainId])
// }

export function useToken(address: string) {
    const [{ data: signer, error, loading }, getSigner] = useSigner()

    
    const contract = useContract({
        addressOrName: address,
        contractInterface: erc20ABI,
        signerOrProvider: signer
      });
    
    
    return useAsyncRetry(async () => {
        
        const decimals = await contract.decimals();
        const name =  await contract.name();
        const symbol = await contract.symbol();
        const totalSupply =  await contract.totalSupply();

        return {decimals,name,symbol,totalSupply}
    }, [signer])
}
