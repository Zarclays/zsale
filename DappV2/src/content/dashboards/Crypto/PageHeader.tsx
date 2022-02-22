import { Typography, Avatar, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function PageHeader() {

  const user =
  {
    name: 'Zsale LaunchPad',
    // avatar: '/static/images/avatars/1.jpg'
  };
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{ mr: 2, width: theme.spacing(8), height: theme.spacing(8) }}
          variant="rounded"
          alt={user.name}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Welcome to ZSale Launchpad{/*user.name*/}
        </Typography>
        <Typography variant="subtitle2">
        These are the Currently created Campaigns
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
