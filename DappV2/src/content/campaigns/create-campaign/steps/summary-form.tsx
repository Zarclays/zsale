import { Helmet } from 'react-helmet-async';
// import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Theme, CircularProgress } from '@mui/material';
import Footer from 'src/components/Footer';

import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardActions,
  Box
} from "@mui/material";
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { erc20ABI, useAccount, useContract, useContractRead, useNetwork,  useSigner } from 'wagmi'
import DisplayTokenInfo from '../display-token-info';
// import ERC20ABI from '../../../constants/erc20abi.json';
import CampaignListABI from '../../../../constants/campaign-list-abi.json';
import CampaignABI from '../../../../constants/campaign-abi.json';
import contractList from '../../../../constants/contract-list';
import { BigNumber , constants, Contract, utils} from 'ethers';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import DesktopDateTimePicker from '@mui/lab/DesktopDateTimePicker';
import { useNavigate } from "react-router-dom";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));



const SummaryForm = ({  handleFormData, values, nativeCoin,validatorListener, setFormData=null }) => {
  
  return (
    <>
      
      <Box

      sx={{
        // m: 1, 
      }}
      
    >
      <TextField    
        disabled     
        label="Presale Rate"
        variant="outlined"
        placeholder={`How many Tokens will 1 ${nativeCoin??'Coin'} get you?`}
        fullWidth
        required
        margin="normal"
        defaultValue={values.presaleRate}
        onChange={handleFormData("presaleRate")}
        helperText={`How many Tokens will 1 ${nativeCoin??'Coin'} get you?`}
      />

      <TextField    
        //type="number" 
        disabled     
        label={`Soft Cap (${nativeCoin??'Coin'} )`}
        variant="outlined"
        placeholder="Soft Cap"
        required
        margin="normal"
        defaultValue={values.softCap}
        onChange={handleFormData("softCap")}
        helperText=" "
        sx={{ ml: 1, width: '48%' }}
      />

      <TextField    
        disabled      
        label={`Hard Cap (${nativeCoin??'Coin'} )`}
        variant="outlined"
        placeholder="Hard Cap"
        required
        margin="normal"
        defaultValue={values.hardCap}
        onChange={handleFormData("hardCap")}
        helperText=" "
        sx={{ ml: 1, width: '48%' }}
      />


      <TextField    
        disabled      
        label={`Minimum Order (${nativeCoin??'Coin'} )`}
        variant="outlined"
        placeholder="Minimum Buy size"
        required
        margin="normal"
        defaultValue={values.minBuy}
        onChange={handleFormData("minBuy")}
        helperText={`Minimum Amount of ${nativeCoin??'Coin'} a buyer can make`}
        sx={{ ml: 1, width: '48%' }}
      />

      <TextField    
        disabled      
        label={`Maximum Order (${nativeCoin??'Coin'} )`}
        variant="outlined"
        placeholder="Maximum Buy size"
        required
        margin="normal"
        defaultValue={values.maxBuy}
        onChange={handleFormData("maxBuy")}
        helperText={`Maximum Amount of ${nativeCoin??'Coin'} a buyer can make`}
        sx={{ ml: 1, width: '48%' }}
      />

      <TextField    
        disabled      
        label="Liquidity %"
        variant="outlined"
        placeholder="Must be > 50%"
        required
        margin="normal"
        defaultValue={values.liquidity}
        onChange={handleFormData("liquidity")}
        helperText="Must be > 50% "
        sx={{ ml: 1, width: '48%' }}
      />

      <TextField    
        disabled      
        label="Dex Listing Rate"
        variant="outlined"
        placeholder="Amount 1 Coin gets on DEX"
        required
        margin="normal"
        defaultValue={values.dexRate}
        onChange={handleFormData("dexRate")}
        helperText={`Amount of tokens 1 ${nativeCoin??'Coin'} will get when listed on DEX`}
        sx={{ ml: 1, width: '48%' }}
      />

      <Typography>Sale Date</Typography>

    <TextField label="Start Date"  variant="outlined" margin="normal" sx={{ ml: 1, width: '48%' }} required helperText={"Start Date"} type="datetime"  defaultValue={values.startDate} disabled/>
    
    <TextField  label="End Date"   margin="normal" sx={{ ml: 1, width: '48%' }} required helperText={"End Date"} type="datetime" defaultValue={values.endDate} disabled/>
    
      


      <TextField    
        disabled      
        label="Liquidity Lockup (in Days)"
        variant="outlined"
        placeholder=""
        required
        margin="normal"
        defaultValue={values.liquidtyLockup}
        onChange={handleFormData("liquidtyLockup")}
        helperText={`How long to lock up Liquidity on DEX`}
        sx={{ ml: 1, width: '48%' }}
      />


      <FormGroup>
        <FormControlLabel control={
          <Checkbox checked={values.useTokenVesting} disabled />
        } label="Use Token Vesting" />
        
      </FormGroup>

      <Typography>Token Vesting Info</Typography>
      {values.useTokenVesting && <Box >

        {values.tokenVestings.map((vst, index) => 
            
                <div key={index} className="input-group">

                  <strong> {index + 1} </strong>

                  <TextField    
                    disabled      
                    label="Amount to vest"
                    variant="outlined"
                    placeholder=""
                    required
                    margin="normal"
                    defaultValue={vst.amount}
                    
                    helperText={`How many tokens to lock`}
                    sx={{ ml: 1, width: '48%' }}
                  />

                  <TextField    
                    type="datetime"  
          disabled  
                    label="Lock Duration"
                    variant="outlined"
                    placeholder=""
                    required
                    margin="normal"
                    defaultValue={vst.releaseDate}
                   
                    helperText={`Days till locked tokens are released `}
                    sx={{ ml: 1, width: '48%' }}
                  />
                    
                </div>
            
        ) }      


      </Box>}
      
    </Box>


    </>
  );
};


export default SummaryForm; 
