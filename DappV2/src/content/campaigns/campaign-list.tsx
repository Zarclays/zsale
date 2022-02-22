import { Helmet } from 'react-helmet-async';
// import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';



function CampaignList() {
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
            <div>
                All Campaigns
            </div>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default CampaignList;
