import { MouseEvent, useState } from 'react';
import {
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Card,
  Typography
} from '@mui/material';

import { styled } from '@mui/material/styles';
import ViewWeekTwoToneIcon from '@mui/icons-material/ViewWeekTwoTone';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import WatchListColumn1 from './WatchListColumn1';
import WatchListColumn2 from './WatchListColumn2';
import WatchListColumn3 from './WatchListColumn3';
import WatchListRow from './WatchListRow';
import WatchListColumn4 from './WatchListColumn4';

const EmptyResultsWrapper = styled('img')(
  ({ theme }) => `
      max-width: 100%;
      width: ${theme.spacing(66)};
      height: ${theme.spacing(34)};
`
);

function WatchList() {

  const [tabs, setTab] = useState<string | null>('watch_list_columns');

  const handleViewOrientation = (
    event: MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    setTab(newValue);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pb: 4 }}
      >
        <Typography variant="h3">Campaigns</Typography>
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={2}
      >
        {tabs === 'watch_list_columns' && (
          <>
            <Grid item lg={3} xs={12}>
              <WatchListColumn1 />
            </Grid>
            <Grid item lg={3} xs={12}>
              <WatchListColumn2 />
            </Grid>
            <Grid item lg={3} xs={12}>
              <WatchListColumn3 />
            </Grid>
            <Grid item lg={3} xs={12}>
              <WatchListColumn4 />
            </Grid>
          </>
        )}

        {tabs === 'watch_list_rows' && (
          <Grid item xs={12}>
            <WatchListRow />
          </Grid>
        )}

        {!tabs && (
          <Grid item xs={12}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />

            </Card>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default WatchList;
