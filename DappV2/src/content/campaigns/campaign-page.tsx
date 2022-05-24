import { Helmet } from 'react-helmet-async';
// import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {  Grid, Container,List,ListItem,  ListItemText,  ListItemIcon,  ListItemButton, TextField, Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Footer from 'src/components/Footer';
import { useParams } from "react-router-dom";
import { useContract, useNetwork, useSigner, useAccount, useProvider } from 'wagmi';
import contractList from '../../constants/contract-list';
import CampaignListABI from '../../constants/campaign-list-abi.json';
import CampaignABI from '../../constants/campaign-abi.json';
import { useAsync } from "react-async";
import {useState, useEffect} from "react";
import {utils} from 'ethers';
import {useGetCampaign} from '../../hooks/useGetCampaign';
import LinearProgressBar from '../../components/LinearProgressBar';
import Countdown from 'react-countdown';
import {Contract} from 'ethers';
import { getDateFromEther, formatEtherDateToJs } from '../../utils/date';
import { useNavigate } from "react-router-dom";
import PostponeSaleDialog from './postpone-sale-dialog';
import chainNames from '../../constants/chain-names';


function formatPercent(value){
  if(!value) {
    return 0;
  }
  const val = utils.formatUnits(  value.toString(),0);
  const s = +val / 100 ;
  return s;
}

const CountDown_Ongoing = () => <div style={{"marginBottom": "1rem"}}><strong>Status: </strong> <span style={{"color": "#10df01"}}>Ongoing!</span></div>;

function CampaignPage() {
  // get the username from route params
  const { campaignId, chain } = useParams();
  // console.log('chain:', chain, ', id:', chainNames[chain])
  
  const [chainId,setChainId] = useState(chainNames[chain]);

  
  
  
  const navigate = useNavigate();
  const [{ data: chainData, error: chainError, loading: chainLoading }, switchNetwork] = useNetwork()


  //init load
  useEffect(()=>{

    if(switchNetwork){
      try{
        switchNetwork(chainId);
      }catch{

      }
      
    }
    
    
  }, [switchNetwork])

  const [{ data: signer, error: signerError, loading: signerLoading }, getSigner] = useSigner();  

  const provider = useProvider();

  // useEffect(()=>{
  //   // setChainId(chainData.chain?.id??31337 );
  //   console.log('chainId from url :', chainId, ', chain id on wallet:', chainData.chain?.id)
  //   if(chainId != chainData.chain?.id??31337){ //if user changes network, navigate to  campaigns list page
  //     let selectedChain ;
  //     for (const c in chainNames) {
  //       if(chainNames[c]=== chainData.chain?.id){
  //         selectedChain=c;
  //         break;
  //       }
  //     }
  //     console.log('selectedChain:', selectedChain)
  //     if(selectedChain){
  //       navigate(`/campaigns/${selectedChain}/${campaignId}`)
  //     }
  //   }
    
    
  // }, [chainLoading, chainData])

  

  const [{ data: account, error: accountError, loading: acctLoading }] = useAccount()
  

  const [amount, setAmount] = useState(1);
  const [openPostponeDialog, setOpenPostponeDialog] = useState(false);

  const [isOwner, setIsOwner] = useState(false);

  const handleSubmitParticipate = async (event) => {

    event.preventDefault();  
        
    const campaignContract = new Contract(campaignDetails.campaignAddress, CampaignABI, signer);
    // not defining `data` field will use the default value - empty data

    const gasPrice = await provider.getGasPrice();    

    const tx = {
        from: account.address,
        to: campaignDetails.campaignAddress,
        nonce: provider.getTransactionCount(account.address, "latest"),
        value: utils.parseEther(amount.toString()), // utils.formatUnits( utils.parseEther(amount.toString()), 'wei'),
        gasLimit: utils.hexlify(500000), // 100000
        gasPrice: gasPrice,
    };
    const txRes = await signer.sendTransaction(tx);    
    console.log("Send finished!" , txRes)
    alert('Your bid has been sent succesfully');
    window.location.reload(); // navigate(`/campaigns/${campaignId}`);


  }

  const postponeSale = () => {
    setOpenPostponeDialog(true);
  };

  const handlePostponeModalClose = async (newStart: Date, newEnd: Date) => {
    setOpenPostponeDialog(false); 

    if(newStart && newEnd){
      
      const campaignContract = new Contract(campaignDetails.campaignAddress, CampaignABI, signer);
      
      let tx = await campaignContract.postponeSale( newStart.getTime()/1000, newEnd.getTime()/1000 );
      let txRes = await tx.wait();    
      // console.log("Send finished!" , txRes)
      alert('Your Campaign  has been postponed succesfully');
      window.location.reload(); // navigate(`/campaigns/${campaignId}`);
    }
        

  };

  const cancelSale = async () => {
    if(window.confirm('Are you sure you want to Cancel this Campaign?')){
      const campaignContract = new Contract(campaignDetails.campaignAddress, CampaignABI, signer);
      
      let tx = await campaignContract.cancelCampaign( );
      let txRes = await tx.wait();
      
      alert('Your Campaign  has been cancelled succesfully');
      window.location.reload(); // navigate(`/campaigns/${campaignId}`);
    }
  };

  const finalizeSale = async () => {
    const campaignContract = new Contract(campaignDetails.campaignAddress, CampaignABI, signer);
      
      let tx = await campaignContract.finalizeAndSetupLiquidity( );
      let txRes = await tx.wait();
      
      alert('Campaign  has been finalized succesfully');
      window.location.reload(); // navigate(`/campaigns/${campaignId}`);
  };

  const withdrawInvestorTokens = async () => {
	  const campaignContract = new Contract(campaignDetails.campaignAddress, CampaignABI, signer);
      
      let tx = await campaignContract.withdrawFunds( );
      let txRes = await tx.wait();
      
      alert('Campaign  funds has been sent to you succesfully');
      window.location.reload(); // navigate(`/campaigns/${campaignId}`);
  };

  const withdrawOwnerTokens = async () => {
    const campaignContract = new Contract(campaignDetails.campaignAddress, CampaignABI, signer);
      
      let tx = await campaignContract.withdrawOwnerTokens( );
      let txRes = await tx.wait();
      
      alert('Campaign  funds has been sent to you succesfully');
      window.location.reload(); // navigate(`/campaigns/${campaignId}`);
  };
  

  const { value: campaignDetails, error: campaignGetError, loading: cLoading }  = useGetCampaign(contractList[chainId]?.campaignList??'0x0', campaignId, signer );
  
  const [isOpenForPayment, setIsOpenForPayment] = useState(false);

  const onCountdownCompleted = (e) => {
    console.log('Completed:',e);
    setIsOpenForPayment(true);
  }

  useEffect(()=>{
    if(campaignDetails && account){
      if(getDateFromEther( campaignDetails.saleStartTime).getTime() < Date.now() && getDateFromEther( campaignDetails.saleEndTime).getTime() > Date.now()  ){
        setIsOpenForPayment(true);
      }else{
        setIsOpenForPayment(false);
      }
  
      setIsOwner (campaignDetails.owner === account.address);
    }
    
  }, [provider, account, campaignDetails])
  
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

  if(cLoading || !nativeCoin){
    return <>
      <h3>Loading Campaign Data</h3>
    </>
  }else if( campaignGetError ){
    // console.log('campaignGetError:', campaignGetError, 'cLoading', cLoading )
    return <>
      <h3>Error Loading Campaign Data or Cannot find Campaign</h3>
    </>
  }


  return (
    <>
      <Helmet>
        <title>Participate in Campaign</title>
      </Helmet>

      <PostponeSaleDialog
        oldDate={campaignDetails.saleStartTime}
        oldEndDate={campaignDetails.saleEndTime}
        open={openPostponeDialog}
        onClose={handlePostponeModalClose}
      />
      
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
                            <ListItemText primary="Token Address" secondary={ campaignDetails.tokenAddress}/>
                          </ListItem>

                          <ListItem >
                            <ListItemText primary="Dates" secondary={ `${ formatEtherDateToJs( campaignDetails['saleStartTime'])} to ${formatEtherDateToJs( campaignDetails['saleEndTime'])}` }/>
                          </ListItem>

                          <ListItem >
                            <ListItemText primary="Soft Cap/Hard Cap" secondary={ `${ utils.formatUnits(  campaignDetails['softcap'].toString(),nativeCoin.decimals)} ${nativeCoin.symbol} to ${utils.formatUnits(  campaignDetails['hardcap'].toString(),nativeCoin.decimals)} ${nativeCoin.symbol}` }/>
                          </ListItem>

                          <ListItem >
                            <ListItemText primary="Sale Rate" secondary={ `1 ${nativeCoin.symbol} gets ${campaignDetails['listRate']}` }/>
                          </ListItem>

                          <ListItem >
                            <ListItemText primary="Dex Listing Rate" secondary={ `1 ${nativeCoin.symbol} gets ${campaignDetails['dexListRate']}` }/>
                          </ListItem>

                          <ListItem >
                            <ListItemText primary="% of Raised funds allocated for Liquidity" secondary={ `${ formatPercent(  campaignDetails['liquidity']) } % of  ${utils.formatUnits(  campaignDetails['hardcap'].toString(),nativeCoin.decimals)} ${nativeCoin.symbol} locked till ${formatEtherDateToJs( campaignDetails['liquidityReleaseTime'])}` }/>
                          </ListItem>
                          {/* <ListItem >
                            <ListItemText primary="% of Raised funds allocated for Liquidity" secondary={ `60 % of  ${utils.formatUnits(  campaignDetails['hardcap'].toString(),nativeCoin.decimals)} ${nativeCoin.symbol} locked till Feb 20,2023` }/>
                          </ListItem> */}
                        </List>
                      
                    </Grid>
                    <Grid item xs={4}>
                          
                      
                      
                      <form onSubmit={handleSubmitParticipate}>
                        <Card sx={{ minWidth: 275 }}>
                          <CardContent>
                            <List>
                              <ListItem >
                                <ListItemText primary="Sale Dates" secondary={ `${ formatEtherDateToJs( campaignDetails.saleStartTime)} to ${formatEtherDateToJs( campaignDetails.saleEndTime)}` }/>
                              </ListItem>
                              <ListItem >
                                <ListItemText primary="Buy Limits (Tier 1)" secondary={ `0 ${nativeCoin.symbol} to ${utils.formatUnits(  campaignDetails.maxAllocationPerUserTierOne,nativeCoin.decimals)} ${nativeCoin.symbol}    ` }/>
                              </ListItem>
                              <ListItem >
                                <ListItemText primary="Buy Limits (Public Tier)" secondary={ `0 ${nativeCoin.symbol} to ${utils.formatUnits(  campaignDetails.maxAllocationPerUserTierTwo,nativeCoin.decimals)} ${nativeCoin.symbol}    ` }/>
                              </ListItem>
                            </List>

                            <Grid container alignItems="center" direction="column">
                              <Grid item>
                                {(getDateFromEther( campaignDetails.saleEndTime).getTime() > Date.now()) && <>
                                  <div>
                                    <Countdown  onComplete={onCountdownCompleted} date={getDateFromEther( campaignDetails.saleStartTime).getTime() } >
                                      <CountDown_Ongoing/>
                                    </Countdown>
                                  </div>                                    
                                </>
                                }                                  

                                {(getDateFromEther( campaignDetails.saleEndTime).getTime() < Date.now()) && <>
                                  <div>Ended</div>
                                </>
                                }

                                <Box sx={{ width: '100%', marginTop: '1rem', marginBottom: '1rem' }}>
                                  <LinearProgressBar nativeCoinSymbol={nativeCoin.symbol} amount={ utils.formatUnits( campaignDetails.totalCoinReceived.toString(),nativeCoin.decimals) } softCap={utils.formatUnits(  campaignDetails['softcap'].toString(),nativeCoin.decimals)} hardCap={utils.formatUnits(  campaignDetails['hardcap'].toString(),nativeCoin.decimals)}/> 
                                </Box>

                                {isOpenForPayment && <TextField
                                  id="name-input"
                                  type="number"
                                  
                                  variant="outlined"
                                  inputProps={{
                                    maxLength: 13,
                                    step: "1"
                                  }}
                                  onChange={(e) => setAmount(+parseFloat(e.target.value).toFixed(4))}
                                  name="name"
                                  label={ `Amount to buy (${ nativeCoin.symbol})` }
                                  required
                                  margin="normal"
                                  defaultValue={1}                              
                                  value={amount}
                                  // onChange={(e) => setAmount(+e.target.value)}
                                  helperText={`How many tokens`}
                                />
                                }

                                {isOpenForPayment && <Button variant="contained" sx={{ marginLeft: '1rem',  marginTop: '1rem'}} color="primary" type="submit">
                                  Submit
                                </Button>
                                }
                              </Grid>
                              
                            </Grid>


                          </CardContent>
                          <CardActions>
                            {campaignDetails && campaignDetails.owner == account.address && <Box  sx={{ p: 1, m:1,  border: '1px dashed grey' }}>
                              
                              
                              {(true || (getDateFromEther( campaignDetails.saleStartTime).getTime() > Date.now()) ) && <>
                              
                                <Button variant="contained" onClick={postponeSale} sx={{ marginLeft: '1rem',  marginTop: '1rem'}} color="primary" >
                                  Postpone Sale
                                </Button>
                                <Button variant="contained" onClick={cancelSale}  sx={{ marginLeft: '1rem',  marginTop: '1rem'}} color="warning" >
                                  Cancel Sale
                                </Button>
                              </>}

                              

                              {(true || (getDateFromEther( campaignDetails.saleEndTime).getTime() > Date.now() && isOwner) ) && <>
                              
                                <Button variant="contained" onClick={finalizeSale}  sx={{ marginLeft: '1rem',  marginTop: '1rem'}} color="success" >
                                  Finalize Sale
                                </Button> 
                                <Button variant="contained" sx={{ marginLeft: '1rem',  marginTop: '1rem'}} color="info" >
                                  Withdraw Owner tokens
                                </Button>
                              </>
                              }

                              {(true || (getDateFromEther( campaignDetails.saleEndTime).getTime() > Date.now() && !isOwner) ) && <>
                              
                                
                                <Button variant="contained" onClick={withdrawInvestorTokens} sx={{ marginLeft: '1rem',  marginTop: '1rem'}} color="info" >
                                  Withdraw your tokens
                                </Button>
                              </>
                              }

                              

                            </Box>
                            }

                            {campaignDetails && campaignDetails.owner != account.address && <Box  sx={{ p: 1, m:1,  border: '1px dashed grey' }}>
                              {(getDateFromEther( campaignDetails.saleEndTime).getTime() > Date.now()) && <>
                              
                                <Button variant="contained" sx={{ marginLeft: '1rem',  marginTop: '1rem'}} color="info" >
                                  Withdraw your funds
                                </Button>
                              </>
                              }
                              

                            </Box>
                            }
                          </CardActions>
                        </Card>
                        
                      </form>

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
