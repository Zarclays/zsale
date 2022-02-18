import { Helmet } from 'react-helmet-async';
import PageTitle from 'src/components/PageTitle';
import { useState } from 'react';

import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid, Card, CardHeader, CardContent, Divider, Button, Link, Typography, Icon } from '@mui/material';
import Footer from 'src/components/Footer';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

import Switch from '@mui/material/Switch';
import { Email } from '@mui/icons-material';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const socialicons = [
  {
    facebookName: 'Facebook',
    facebookIcons: 'icon-192x192.png',
  },
  {
    name: 'Website',
    icons: '',
  },
  {
    name: 'Instagram',
    icons: '',
  },
  {
    name: 'Twitter',
    icons: '',
  },
  {
    name: 'Discord',
    icons: '',
  },
  {
    name: 'Github',
    icons: '',
  },
  {
    name: 'Reddit',
    icons: '',
  },
  {
    name: 'Gmail',
    icons: '',
  },
];

function Contact() {

  const [currency, setCurrency] = useState('EUR');

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  const [value, setValue] = useState(30);

  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <>
      <Helmet>
        <title>Contact Us</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Contact Us"
          subHeading="Drop your message by filling the form below once we recieve your message we will get in toch with you Thanks."/>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid 
        container
        direction="row"
        justifyContent={"center"}
        alignItems="stretch"
        spacing={3}>
          <Grid item xs={12}>
            <CardHeader title="Fill the form"/>
            <Divider/>
            <CardContent>
              <Box component={"form"}
              sx={{'& .MuiTextField-root': {m: 1, width: '50ch'}}}
              autoComplete="off"
              autoSave='off'>
                <div>
                  <TextField required
                  id="outlined-required"
                  label="Full-Name"
                  defaultValue={"Full name"}/>

                  <TextField type={'email'}
                  required
                  id="outlined-required"
                  label="Email Addresss"
                  defaultValue={"example@gmail.com"}/>

                  <TextField required
                  id='outlined-required'
                  label="Messagen Heading"
                  defaultValue={"Message Heading"}/>
                  
                  <TextField type={'text'}
                  required
                  multiline
                  id='outlined-required'
                  label='Message'
                  defaultValue={"Enter your Meassage here"}
                  />
                  <Button style={{backgroundColor: 'blue', color:'white', textAlign: 'center'}} >Send Message</Button>
                </div>
              </Box>
              <Box sx={{
                mt: 9
              }}>
                <Typography variant='h2'>Or you could follow us on:</Typography>
                <Grid container
                direction={"row"}
                mt={7}
                justifyContent={"left"}
                alignItems="stretch"
                spacing={3}
                >
                  <Grid item xs={2} textAlign='center'>
                  <img style={{width: 25}} src='/icon-192x192.png'/>
                  <Link style={{textDecoration: 'none'}} href="https://zarclays.com" target="_blank" rel="noopener noreferrer">Zarclays</Link>
                  </Grid>
                  <Grid item xs={2} textAlign='center'>
                  <img style={{width: 25}} src='/icon-192x192.png'/>
                  <Link style={{textDecoration: 'none'}} href="https://twitter.com/zarclays" target="_blank" rel="noopener noreferrer">Twitter</Link>
                  </Grid>
                  <Grid item xs={2} textAlign='center'>
                  <img style={{width: 25}} src='/icon-192x192.png'/>
                  <Link style={{textDecoration: 'none'}} href="https://discord.com/zarclays" target="_blank" rel="noopener noreferrer">Discord</Link>
                  </Grid>
                  <Grid item xs={2}>
                  <img style={{width: 25}} src='/icon-192x192.png'/>
                  <Link style={{textDecoration: 'none'}} href="https://instagram.com/zarclays" target="_blank" rel="noopener noreferrer">Instagram</Link>
                  </Grid>
                  <Grid item xs={2} textAlign='center'>
                    <img style={{width: 25}} src='/icon-192x192.png'/>
                  <Link style={{textDecoration: 'none'}} href="https://facebook.com/zarclays" target="_blank" rel="noopener noreferrer">Facebook</Link>
                  </Grid>
                  <Grid item xs={2} textAlign='center'>
                  <img style={{width: 25}} src='/icon-192x192.png'/>
                  <Link style={{textDecoration: 'none'}} href="https://gmail.com/zarclays" target="_blank" rel="noopener noreferrer">Gmail</Link>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Grid>

        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Contact;
