
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useToken } from '../../../hooks/useToken';
import {utils} from 'ethers';

const DisplayTokenInfo = ({tokenAddress}) => {
  const { value, error, loading } = useToken(tokenAddress)
  
  if (loading) return <div>Fetching token…</div>
  if (error) return <div>Error fetching token </div>
  return (
    
	<Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Token Info
        </Typography>
        <Typography variant="h5" component="div">
        {value?.name} ({value?.symbol})
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          
        </Typography>
        <Typography variant="body2">
          Total Supply: {utils.formatUnits(utils.parseUnits (value?.totalSupply.toString(),value?.decimals??18), value?.decimals??18)} {value?.symbol}
          <br />
          Decimals: {value?.decimals} 
        </Typography>
      </CardContent>
     
    </Card>
  )
}

export default DisplayTokenInfo;