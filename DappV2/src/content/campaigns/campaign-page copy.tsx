import { Helmet } from 'react-helmet-async';
// import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import { useParams } from "react-router-dom";
import { useContract, useNetwork, useSigner } from 'wagmi';
import contractList from '../../constants/contract-list';
import CampaignListABI from '../../constants/campaign-list-abi.json';
import CampaignABI from '../../constants/campaign-abi.json';
import { useAsync } from "react-async";
import {useState, useEffect} from "react";

function CampaignPage2() {
  // get the username from route params
  const { campaignId } = useParams();
  const [{ data: chainData, error: chainError, loading: chainLoading }] = useNetwork()

  const [{ data: signer, error: signerError, loading: signerLoading }, getSigner] = useSigner();

  const [chainId,setChainId] = useState(31337);

  useEffect(()=>{
    setChainId(chainData.chain?.id??31337 );
  }, [chainData])

  console.log('Chain:',contractList[chainId]?.campaignList??'')

  const campaignListContract = useContract({
    addressOrName: contractList[chainId]?.campaignList??'',
    contractInterface: CampaignListABI,
    signerOrProvider: signer
  })

  
  // You can use async/await or any function that returns a Promise
  const getCampaignAddress = async ({arg}) => {

    return await arg.campaignListContract.tryGetCampaignByKey(arg.campaignId)
  }

  const getCampaignInfo = async ({campaignContract}) => {

    return await campaignContract.getCampaignInfo();
  }

  const { data: cAddressData, error: cAddError, isPending: cAddPending }  = useAsync({ promiseFn: getCampaignAddress,arg:{campaignListContract,campaignId} })

  console.log('cAddressData', cAddressData)
  const campaignContract = useContract({
    addressOrName: cAddressData.campaignAddress,
    contractInterface: CampaignABI,
  })

  const { data: campaignDetails, error: campaignGetError, isPending: cGetPending }  = useAsync({ promiseFn: getCampaignInfo,campaignContract:campaignContract});
  
  console.log('campaignDetails: ',campaignDetails)


  if(chainLoading){
    return <>
      <h3>Loading Blockchain Data</h3>
    </>
  }

  if( chainError){
    return <>
      <h3>Error Loading Blockchain Data</h3>
    </>
  }

  return (
    <>
      <Helmet>
        <title>Participate in Campaign</title>
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
            <div>
                {campaignId}
            </div>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default CampaignPage2;
