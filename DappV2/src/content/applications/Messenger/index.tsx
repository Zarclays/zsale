import { useEffect, useRef } from 'react';

import { Helmet } from 'react-helmet-async';

import TopBarContent from './TopBarContent';
import BottomBarContent from './BottomBarContent';
import SidebarContent from './SidebarContent';
import ChatContent from './ChatContent';

import { Scrollbars } from 'react-custom-scrollbars-2';

import { Box, Grid, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Label } from '@mui/icons-material';

const RootWrapper = styled(Box)(
  () => `
       height: 100%;
       display: flex;
`
);

const Sidebar = styled(Box)(
  ({ theme }) => `
        width: 300px;
        background: ${theme.colors.alpha.white[100]};
        border-right: ${theme.colors.alpha.black[10]} solid 1px;
`
);

const ChatWindow = styled(Box)(
  () => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
`
);

const ChatTopBar = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.white[100]};
        border-bottom: ${theme.colors.alpha.black[10]} solid 1px;
        padding: ${theme.spacing(3)};
`
);

const ChatMain = styled(Box)(
  () => `
        flex: 1;
`
);

const ChatBottomBar = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(3)};
`
);

function ApplicationsMessenger() {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollToBottom();
    }
  });

  return (
    <>
      <Helmet>
        <title>Create Campaign</title>
      </Helmet>
      <Box marginX={25} marginY={17}>
        <Grid container
        >
          <Grid item xs={3}>
          <Typography>Veryfy Token</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Grid>
          <Grid>
            <TextField required
            id='outlined-required'
            label='Token Address'
            defaultValue={"Ex: Zarcmoon"} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ApplicationsMessenger;
