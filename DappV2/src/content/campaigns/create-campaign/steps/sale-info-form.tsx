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





const SaleInfoForm = ({  handleFormData, values, nativeCoin,validatorListener, setFormData=null }) => {
  
  const handleTokenVestingAmountChange= (index, event) => {
    var list = values.tokenVestings.slice(); // Make a copy of the list first.
    list[index].amount = event.target.value; // Update it with the modified field.
    
    setFormData(prevState => ({
        ...prevState,
        ["tokenVestings"]: list
    }));
  }

  const handleTokenVestingDayChange= (index, event) => {
    var list = values.tokenVestings.slice(); // Make a copy of the list first.
    list[index].releaseDate = event.target.value; // Update it with the modified field.
    // this.setState({emails: emails}); // Update the state.
    setFormData(prevState => ({
        ...prevState,
        ["tokenVestings"]: list
    }));
  }

  const half = {
    style:{
     ml: 0, 
     mr: 0,
     marginLeft: 0,
     marginRight: 0,
     width: '48%' ,
     display: 'inline-flex'
    }
  }

  return (
    <Box

      sx={{
        // m: 1, 
      }}
      
    >
      <TextValidator
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}       
        label="Presale Rate"
        variant="outlined"
        placeholder={`How many Tokens will 1 ${nativeCoin??'Coin'} get you?`}
        fullWidth
        required
        margin="normal"        
		    value={values.presaleRate}  		
        onChange={handleFormData("presaleRate")}        
        helperText={`How many Tokens will 1 ${nativeCoin??'Coin'} get you?`}
        name="presaleRate"
        validators={['required','isNumber', 'minNumber:0']}
        errorMessages={['this field is required','Only Numbers are allowed', 'Minimum of 0 is required']}
        validatorListener={validatorListener}
      />

      <TextValidator
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}       
        label={`Soft Cap (${nativeCoin??'Coin'} )`}
        variant="outlined"
        placeholder="Soft Cap"
        required
        margin="normal"
        containerProps={half}
        value={values.softCap}
        onChange={handleFormData("softCap")}
        helperText=" "
        sx={{ ml: 1, width: '100%' }} 
        validators={['required','isNumber', 'minNumber:0']}
        errorMessages={['this field is required','Only Numbers are allowed', 'Minimum of 0 is required']}
        validatorListener={validatorListener}
      />
      

      <TextValidator
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}       
        label={`Hard Cap (${nativeCoin??'Coin'} )`}
        variant="outlined"
        placeholder="Hard Cap"
        required
        margin="normal"
        containerProps={half}
        value={values.hardCap}
        onChange={handleFormData("hardCap")}
        helperText=" "
        sx={{ ml: 1, width: '100%' }} 
        validators={['required','isNumber', 'minNumber:0']}
        errorMessages={['this field is required','Only Numbers are allowed', 'Minimum of 0 is required']}
        validatorListener={validatorListener}
      />

      <TextValidator
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}       
        label={`Minimum Order (${nativeCoin??'Coin'} )`}
        variant="outlined"
        placeholder="Minimum Buy size"
        required
        margin="normal"
        containerProps={half}
        value={values.minBuy}
        onChange={handleFormData("minBuy")}
        helperText={`Minimum Amount of ${nativeCoin??'Coin'} a buyer can make`}
        sx={{ ml: 1, width: '100%' }} 
        validators={['required','isNumber', 'minNumber:0']}
        errorMessages={['this field is required','Only Numbers are allowed', 'Minimum of 0 is required']}
        validatorListener={validatorListener}
      />

      

      <TextValidator    
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
        label={`Maximum Order (${nativeCoin??'Coin'} )`}
        variant="outlined"
        placeholder="Maximum Buy size"
        required
        margin="normal"
        containerProps={half}
        value={values.maxBuy}
        onChange={handleFormData("maxBuy")}
        helperText={`Maximum Amount of ${nativeCoin??'Coin'}  a buyer can make`}
        sx={{ ml: 1, width: '100%' }}
        validators={['required','isNumber', 'minNumber:0']}
        errorMessages={['this field is required','Only Numbers are allowed', 'Minimum of 0 is required']}
        validatorListener={validatorListener}
      />

      <TextValidator    
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
        label="Liquidity %"
        variant="outlined"
        placeholder="Must be > 50%"
        required
        margin="normal"
        containerProps={half}
        onChange={handleFormData("liquidity")}
        helperText="Must be > 50% "
        sx={{ ml: 1, width: '100%' }}
        validators={['required','isNumber', 'minNumber:0']}
        errorMessages={['this field is required','Only Numbers are allowed', 'Minimum of 0 is required']}
        validatorListener={validatorListener}
      />

      <TextValidator    
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
        label="Dex Listing Rate"
        variant="outlined"
        placeholder="Amount 1 Coin gets on DEX"
        required
        margin="normal"
        containerProps={half}
        value={values.dexRate}
        onChange={handleFormData("dexRate")}
        helperText={`Amount of tokens 1 ${nativeCoin??'Coin'} will get when listed on DEX`}
        sx={{ ml: 1, width: '100%' }}
        validators={['required','isNumber', 'minNumber:0']}
        errorMessages={['this field is required','Only Numbers are allowed', 'Minimum of 0 is required']}
        validatorListener={validatorListener}
      />

      <Typography>Sale Date</Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          renderInput={(params) => <TextValidator label="Start Date" {...params} variant="outlined" margin="normal" containerProps={half} sx={{ ml: 1, width: '100%' }} required helperText={"Start Date"} />}
          value={values.startDate}
          onChange={(newValue) => {
            setFormData(prevState => ({
                ...prevState,
                ["startDate"]: newValue
            }));
          }}
        />

        <DateTimePicker
          renderInput={(params) => <TextValidator label="End Date" {...params}  margin="normal" containerProps={half} sx={{ ml: 1, width: '100%' }} required helperText={"End Date"}/>}
          value={values.endDate}
          onChange={(newValue) => {
            setFormData(prevState => ({
                ...prevState,
                ["endDate"]: newValue
            }));
          }}
        />

      </LocalizationProvider>


      <TextValidator    
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
        label="Liquidity Lockup (in Days)"
        variant="outlined"
        placeholder=""
        required
        margin="normal"
        containerProps={half}
        value={values.liquidtyLockup}
        onChange={handleFormData("liquidtyLockup")}
        helperText={`How long to lock up Liquidity on DEX`}
        sx={{ ml: 1, width: '100%' }}
        validators={['required','isNumber', 'minNumber:60']}
        errorMessages={['this field is required','Only Numbers are allowed', 'Minimum of 60 days is required']}
        validatorListener={validatorListener}
      />


      <FormGroup>
        <FormControlLabel control={
          <Checkbox checked={values.useTokenVesting} onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
          setFormData(prevState => ({
              ...prevState,
              ['useTokenVesting']: evt.target.checked
          }))

          }} />
        } label="Use Token Vesting" />
        
      </FormGroup>


      {values.useTokenVesting && <Box >

        {values.tokenVestings.map((vst, index) => 
            
                <div key={index} className="input-group">

                  <strong> {index + 1} </strong>

                  <TextValidator    
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
                    label="Amount to vest"
                    variant="outlined"
                    placeholder=""
                    required
                    margin="normal"
                    containerProps={half}
                    value={vst.amount}
                    onChange={(ev) => handleTokenVestingAmountChange(index, ev)}
                    helperText={`How many tokens to lock`}
                    sx={{ ml: 1, width: '100%' }}
                    validators={['isNumber', 'minNumber:0']}
                    errorMessages={['Only Numbers are allowed', 'Minimum of 0 is required']}
                    validatorListener={validatorListener}
                  />

                  <TextValidator    
                    type="datetime"       
                    label="Lock Duration"
                    variant="outlined"
                    placeholder=""
                    required
                    margin="normal"
                    containerProps={half}
                    value={vst.releaseDate}
                    onChange={(ev) => handleTokenVestingDayChange(index, ev)}
                    helperText={`Days till locked tokens are released `}
                    sx={{ ml: 1, width: '100%' }}
                    
                  />
                    
                </div>
            
        ) }      


      </Box>}
      
    </Box>
  );
};




export default SaleInfoForm; 
