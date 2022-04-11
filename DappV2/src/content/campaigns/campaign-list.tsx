import { Helmet } from 'react-helmet-async';
// import PageHeader from './PageHeader';
import PageTitleWrapper from '../../components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from '../../components/Footer';
import { getDateFromEther } from '../../utils/date';
import { useParams } from 'react-router-dom';
import { useContractRead, useNetwork, useSigner, useContract, useAccount, useProvider } from 'wagmi';
import { useState, useEffect, useMemo } from 'react';
import contractList from '../../constants/contract-list';
import CampaignABI from '../../constants/campaign-abi.json';
import CampaignListABI from '../../constants/campaign-list-abi.json';
import { useAsync } from 'react-use';
import {Contract} from 'ethers';
import CampaignListItem from './campaign-list-item';



function CampaignList() {

  // const { chain } = useParams();
  const [{ data: chainData, error: chainError, loading: chainLoading }] = useNetwork()

  const [{ data: signer, error: signerError, loading: signerLoading }, getSigner] = useSigner({
    skip: false,
  });
  
  const nativeCoin = chainData.chain?.nativeCurrency;

  const [chainId,setChainId] = useState(31337);

  const [campaigns,setCampaigns] = useState([]);

  const campaignListContract = useContract({
        addressOrName: contractList[chainId]?.campaignList??'0x0',
        contractInterface: CampaignListABI,
        signerOrProvider: signer
    });  
  
  useAsync(async ()=>{
    const count = await campaignListContract.campaignSize();
    
    await Promise.all(
      Array(parseInt(count.toString() ))
        .fill(undefined)
        .map(async (element, index) => {
          const result = await campaignListContract.campaignAt(index);
          if(result){
            setCampaigns([...campaigns, {
              key: result.key.toString(),
              address: result.value
            }])
          }
          
        })
    );
  }, [chainId, campaignListContract])

    
  useEffect(()=>{
    if(chainData && chainData.chain){
      setChainId(chainData.chain?.id??31337 );
    }
  }, [chainData])

  



  return (
    <>
      <Helmet>
        <title>All Campaigns</title>
      </Helmet>
      
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={6}
        >
          <Grid item xs={12}>
            <h2>
                All Campaigns
            </h2>

            <div>
              {campaigns.map((campaignAddress, i) => (
                <div key={i}>
                  
                  <CampaignListItem 
                    signer={signer} 
                    campaignAddress={campaignAddress.address} 
                    campaignId={campaignAddress.key} 
                    nativeCoin={nativeCoin} 
                    chainId={chainId} 
                  />
                </div>
                
              ))}
            </div>


          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default CampaignList;
