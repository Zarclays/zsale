import { Helmet } from 'react-helmet-async';
// import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';


function CreateCampaign() {
  return (
    <>
      <Helmet>
        <title>Start a Campaign</title>
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
                Create A Campaign
            </div>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default CreateCampaign;
