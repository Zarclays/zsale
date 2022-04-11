import { Helmet } from 'react-helmet-async';
// import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Box, Grid,Avatar, Container,List,ListItem,  ListItemText,  ListItemIcon,  ListItemButton, TextField, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Footer from 'src/components/Footer';
import { useParams } from "react-router-dom";
import { useContract, useNetwork, useSigner, useAccount } from 'wagmi';
import contractList from '../../constants/contract-list';
import CampaignListABI from '../../constants/campaign-list-abi.json';
import CampaignABI from '../../constants/campaign-abi.json';
import { useAsync } from "react-async";
import {useState, useEffect} from "react";
import {utils} from 'ethers';
import {useGetCampaign} from '../../hooks/useGetCampaign';

import Countdown from 'react-countdown';
import {Contract} from 'ethers';
import { getDateFromEther, formatEtherDateToJs } from '../../utils/date';
import LinearProgressBar from '../../components/LinearProgressBar';
import { useNavigate  } from "react-router-dom";

function formatPercent(value){
  if(!value) {
    return 0;
  }
  const val = utils.formatUnits(  value.toString(),0);
  const s = +val / 100 ;
  return s;
}

const CountDown_Ongoing = () => <span style={{"color": "#10df01"}}>Ongoing!</span>;

function CampaignListItem({campaignAddress, campaignId, signer, nativeCoin, chainId}) {
  
  const navigate = useNavigate ();
  // const classes = useStyles();

  const { value: campaignDetails, error: campaignGetError, loading: cLoading }  = useGetCampaign(contractList[chainId]?.campaignList??'0x0', campaignId, signer );
  
  const [isOpenForPayment, setIsOpenForPayment] = useState(false);

  const onCountdownCompleted = (e) => {
    setIsOpenForPayment(true);
  }

  
  useEffect(()=>{
    if(campaignDetails && getDateFromEther( campaignDetails.saleStartTime).getTime() < Date.now() && getDateFromEther( campaignDetails.saleEndTime).getTime() > Date.now() ){
      setIsOpenForPayment(true);
    }


  }, [campaignDetails])

  
  const navigateToHandler= () => {
      
      navigate(`/campaigns/${campaignId}`); 
  };

  return (
    <>

      {campaignDetails && <Card sx={[
          {
            '&:hover': {
              color: 'blue',
              backgroundColor: 'white',
              cursor: 'pointer'
            },
          },
          { maxWidth: 345 }
        ]}   onClick={navigateToHandler}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {campaignDetails.symbol}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={`${campaignDetails.name} (${campaignDetails.symbol})`}
            subheader={
              <>
                {(getDateFromEther( campaignDetails.saleEndTime).getTime() > Date.now()) && <div>
                  <Countdown onComplete={onCountdownCompleted} date={getDateFromEther( campaignDetails.saleStartTime).getTime()} >
                    <CountDown_Ongoing/>
                  </Countdown>
                </div>
                }

                {(getDateFromEther( campaignDetails.saleEndTime).getTime() < Date.now()) && <>
                  <div style={{"color": "#df1001"}}>Ended</div>
                </>
                }
              </>
              
                            
            }
          />
          <CardMedia
            component="img"
            height="194"
            image={campaignDetails.logoUrl}
            alt={`${campaignDetails.name} Logo`}
          />
          <CardContent>
            <List>
              
              <ListItem >
                <ListItemText primary="Soft Cap/Hard Cap" secondary={ `${ utils.formatUnits(  campaignDetails['softcap'].toString(),nativeCoin.decimals)} ${nativeCoin.symbol} to ${utils.formatUnits(  campaignDetails['hardcap'].toString(),nativeCoin.decimals)} ${nativeCoin.symbol}` }/>
              </ListItem>

              <ListItem >
                <ListItemText primary="Sale Rate" secondary={ `1 ${nativeCoin.symbol} gets ${campaignDetails['listRate']}` }/>
              </ListItem>

              <ListItem >
                <ListItemText primary="Dex Listing Rate" secondary={ `1 ${nativeCoin.symbol} gets ${campaignDetails['dexListRate']}` }/>
              </ListItem>
              
            </List>
            <Typography variant="body2" color="text.secondary">
              {campaignDetails.desc??''}
            </Typography>
            <Box sx={{ width: '100%' }}>
              <LinearProgressBar nativeCoinSymbol={nativeCoin.symbol} amount={ utils.formatUnits( campaignDetails.totalCoinReceived.toString(),nativeCoin.decimals) } softCap={utils.formatUnits(  campaignDetails['softcap'].toString(),nativeCoin.decimals)} hardCap={utils.formatUnits(  campaignDetails['hardcap'].toString(),nativeCoin.decimals)}/> 
            </Box>
            
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            
          </CardActions>
          
        </Card>
      }
       
      
    </>
  );
}

export default CampaignListItem;
