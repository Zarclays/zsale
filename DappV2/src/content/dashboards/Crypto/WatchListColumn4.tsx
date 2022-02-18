import { Card, Box, Typography, Avatar, Button} from '@mui/material';

import { styled } from '@mui/material/styles';
import Label from 'src/components/Label';
import Text from 'src/components/Text';
import WatchListColumn1Chart from './WatchListColumn1Chart';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
        background: transparent;
        margin-right: ${theme.spacing(0.5)};
`
);

const WatchListColumn1ChartWrapper = styled(WatchListColumn1Chart)(
  ({ theme }) => `
        height: 130px;
`
);

const campaigns = {
  coinName: 'Bitcoin',
  coinSymbol: 'BTC',
  totalSupply: '1,000,000',
  totalContributed: 500 && 'BNB',
  coinToBnb: '5,000',
  startDate: '2/03/2022'

}

function WatchListColumn4() {

  const price = {
    week: {
      labels: [
        'Monday',
        'Tueday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      data: [55.701, 57.598, 48.607, 46.439, 58.755, 46.978, 58.16]
    }
  };

  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center">
          <AvatarWrapper>
            <img alt="BTC" src="/static/images/placeholders/logo/bitcoin.png" />
          </AvatarWrapper>
          <Box>
            <Typography variant="h4" noWrap>
              {campaigns.coinName}
            </Typography>
            <Typography variant="subtitle1" noWrap>
              {campaigns.coinSymbol}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            pt: 3
          }}
        >
          <Typography variant="h5" sx={{ pr: 1, mb: 1 }}>
            Total Supply: {campaigns.totalSupply}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ pr: 1, mb: 1 }}>
            Coin To BNB: {campaigns.coinToBnb}
          </Typography>
          <Typography variant="h6" sx={{ pr: 1, mb: 1 }}>
            Starting Date: {campaigns.startDate}
          </Typography>
          <Typography variant="h6" sx={{ pr: 1, mb: 1 }}>
            Total Contributed: {campaigns.totalContributed}
          </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <Button >Full Details</Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default WatchListColumn4;
