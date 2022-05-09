import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function LinearProgressBar(props: LinearProgressProps & { amount: string, softCap: string, hardCap: string, nativeCoinSymbol: string }) {

  let progress = 100 * Math.min( parseFloat(props.amount)/ parseFloat(props.softCap) ,  parseFloat(props.amount)/ parseFloat(props.hardCap))
  if(progress==100){
    progress = 100 * parseFloat(props.amount)/ parseFloat(props.hardCap);
  }

  const {classes, color, sx, valueBuffer} = props;

    

  
  return (
    <div >
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress sx={sx}
          color={color}
          classes={classes} 
          variant="determinate" 
          valueBuffer={valueBuffer} 
          value={progress} />
      </Box>
      <br/>
      <Box  sx={{ display: 'flex', alignItems: 'center', minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', margin: 'auto' }}>
          {`${props.amount} ${props.nativeCoinSymbol}`} /
          {`${ parseFloat(props.amount) >= parseFloat(props.softCap) ?   `${parseFloat(props.hardCap)} ${props.nativeCoinSymbol} (Soft Cap hit)` : `${parseFloat(props.softCap)} ${props.nativeCoinSymbol}` } `}

          
        </Typography>
      </Box>
    </div>
  );
}