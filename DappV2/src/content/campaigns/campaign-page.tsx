import { Helmet } from 'react-helmet-async';
// import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container,List,ListItem,  ListItemText,  ListItemIcon,  ListItemButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Footer from 'src/components/Footer';
import { useParams } from "react-router-dom";
import { useContract, useNetwork, useSigner } from 'wagmi';
import contractList from '../../constants/contract-list';
import CampaignListABI from '../../constants/campaign-list-abi.json';
import CampaignABI from '../../constants/campaign-abi.json';
import { useAsync } from "react-async";
import {useState, useEffect} from "react";
import {utils} from 'ethers';
import {useGetCampaign} from '../../hooks/useGetCampaign';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatEtherDateToJs(bn){
  const val = utils.formatUnits(  bn.toString(),0);
  const s = +val ;

  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(s * 1000);

  let unix_timestamp = 1549312452

  // Hours part from the timestamp
  const hours = date.getHours();
  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  const seconds = "0" + date.getSeconds();

  const formattedTime = `${monthNames[date.getMonth()].substr(0,3)} ${date.getDate()}, ${date.getFullYear()} ` + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedTime;
}

function formatPercent(value){
  if(!value) {
    return 0;
  }
  const val = utils.formatUnits(  value.toString(),0);
  const s = +val / 100 ;
  return s;
}

function CampaignPage() {
  // get the username from route params
  const { campaignId } = useParams();
  const [{ data: chainData, error: chainError, loading: chainLoading }] = useNetwork()

  const [{ data: signer, error: signerError, loading: signerLoading }, getSigner] = useSigner();

  const [chainId,setChainId] = useState(31337);

  useEffect(()=>{
    setChainId(chainData.chain?.id??31337 );
  }, [chainData])

  
  

  const { value: campaignDetails, error: campaignGetError, loading: cLoading }  = useGetCampaign(contractList[chainId]?.campaignList??'0x0', campaignId );
  
  console.log('campaignDetails: ',campaignDetails);
  const nativeCoin = chainData.chain?.nativeCurrency;

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

  if(cLoading){
    return <>
      <h3>Loading Campaign Data</h3>
    </>
  }

  if( campaignGetError){
    console.log('campaignGetError:', campaignGetError)
    return <>
      <h3>Error Loading Campaign Data</h3>
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
            <div style={{backgroundColor: '#fff'}}>
                {campaignDetails && <>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      
                        <List>
                          <ListItem >
                            <ListItemButton>
                              <ListItemIcon>
                                <InboxIcon />
                              </ListItemIcon>
                              <ListItemText primary="Presale Address" secondary={ campaignDetails.saleAddress }/>
                                
                            </ListItemButton>
                          </ListItem>

                          <ListItem >
                            <ListItemText primary="Token Address" secondary={ campaignDetails.details['_tokenAddress'] }/>
                          </ListItem>

                          <ListItem >
                            <ListItemText primary="Dates" secondary={ `${ formatEtherDateToJs( campaignDetails.details['saleStartTime'])} to ${formatEtherDateToJs( campaignDetails.details['saleEndTime'])}` }/>
                          </ListItem>

                          <ListItem >
                            <ListItemText primary="Soft Cap/Hard Cap" secondary={ `${ utils.formatUnits(  campaignDetails.details['softcap'].toString(),nativeCoin.decimals)} ${nativeCoin.symbol} to ${utils.formatUnits(  campaignDetails.details['hardcap'].toString(),nativeCoin.decimals)} ${nativeCoin.symbol}` }/>
                          </ListItem>

                          <ListItem >
                            <ListItemText primary="Sale Rate" secondary={ `1 ${nativeCoin.symbol} gets ${campaignDetails.details['listRate']}` }/>
                          </ListItem>

                          <ListItem >
                            <ListItemText primary="Dex Listing Rate" secondary={ `1 ${nativeCoin.symbol} gets ${campaignDetails.details['dexListRate']}` }/>
                          </ListItem>

                          {/* <ListItem >
                            <ListItemText primary="% of Raised funds allocated for Liquidity" secondary={ `${ formatPercent(  campaignDetails.details['liquidity']) } % of  ${utils.formatUnits(  campaignDetails.details['hardcap'].toString(),nativeCoin.decimals)} ${nativeCoin.symbol} locked till ${formatEtherDateToJs( campaignDetails.details['_liquidityReleaseTime'])}` }/>
                          </ListItem> */}
                          <ListItem >
                            <ListItemText primary="% of Raised funds allocated for Liquidity" secondary={ `60 % of  ${utils.formatUnits(  campaignDetails.details['hardcap'].toString(),nativeCoin.decimals)} ${nativeCoin.symbol} locked till Feb 20,2023` }/>
                          </ListItem>
                        </List>
                      
                    </Grid>
                    <Grid item xs={4}>
                      

                      <br/>
                      {utils.formatUnits(  campaignDetails.details['saleStartTime'].toString(),0)}
<br/>
                      {formatEtherDateToJs( campaignDetails.details['saleStartTime'])}
                    </Grid>
                    
                  </Grid>
                  
                </>
                
                }
            </div>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default CampaignPage;
