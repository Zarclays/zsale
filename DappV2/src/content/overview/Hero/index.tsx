import {
  Box,
  Button,
  Container,
  Grid,
  Typography
} from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

import { styled } from '@mui/material/styles';

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(11)};
    padding: ${theme.spacing(.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

const MuiAvatar = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: #e5f7ff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

const TsAvatar = styled(Box)(
  ({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: #dfebf6;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

function Hero() {

  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
      <Grid spacing={{ xs: 6, md: 10 }} justifyContent="center" alignItems="center" container>
        <Grid item md={10} lg={8} mx="auto">
          <LabelWrapper color="success">Version 1.1.0</LabelWrapper>
          <TypographyH1 sx={{ mb: 2 }} variant="h1">
            ZSale Launchpad
          </TypographyH1>
          <TypographyH2
            sx={{ lineHeight: 1.5, pb: 4 }}
            variant="h4"
            color="text.secondary"
            fontWeight="normal"
          >
          Multi-chain Crypto Launchpad Protocol , perfect for Web3 Creators!

            Create your own token and start a token sale for it instantaneously
          </TypographyH2>
          <Button
            component={RouterLink}
            to="/campaigns"
            size="large"
            variant="contained"
          >
            Launch a Campaign
          </Button>
          <Button
            sx={{ ml: 2 }}
            component="a"
            target="_blank"
            rel="noopener"
            href="https://bloomui.com/product/tokyo-free-white-react-typescript-material-ui-admin-dashboard"
            size="large"
            variant="text"
          >
            Mint Your Own Crypto Token
          </Button>
          <Grid container spacing={3} mt={5}>
            <Grid item md={6}>
              <img src="/static/images/rocket.png" alt="Crypto Minter" style={{maxWidth:'80px'}} />
              
              <Typography variant="h4">
                <Box sx={{ pb: 2 }}>
                  <b><a href="/token-minter">Mint a Crypto Coin/Token</a></b>
                </Box>
              </Typography>

              <Typography variant="h5">
                <Box sx={{ pb: 2 }}><b>Powered by our Easy to Use Crypto Minter</b></Box>
                <Typography component="span" variant="subtitle2"> Use our simple and fast Token Minter to create your own crypto token.<br/> No programming knowledge needed.</Typography>
              </Typography>
            </Grid>
            <Grid item md={6}>
              <img src="/static/images/astronaut.png" alt="Typescript" style={{maxWidth:'80px'}}/>
              <Typography variant="h4">
                <Box sx={{ pb: 2 }}>
                  <b><a href="/token-minter">Start a sale for your coin</a></b>
                </Box>
              </Typography>
              <Typography variant="h5">
                <Box sx={{ pb: 2 }}>
                  <b>Raise funds for your Crypto Tokens</b>
                </Box>
                  
                <Typography component="span" variant="subtitle2"> Present your project to our large community of investors</Typography>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
