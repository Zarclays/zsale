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


const FounderInfoForm = ({  handleFormData, values, nativeCoin, setFormData=null }) => {
  
  return (
    <>
      <TextField    
        type="url"       
        label={`Token Logo`}
        variant="outlined"
        placeholder="https://"
        required
        margin="normal"
        defaultValue={values.logo}
        onChange={handleFormData("logo")}
        helperText={`Public Url of your token logo`}
        fullWidth
      />

      <TextField    
        type="url"        
        label={`Website Url`}
        variant="outlined"
        placeholder="https://"
        required
        margin="normal"
        defaultValue={values.website}
        onChange={handleFormData("website")}
        helperText={` `}
        fullWidth
      />

      <TextField    
        type="text"       
        label={`Twitter Page`}
        variant="outlined"
        placeholder="https://twitter.com/@handle"
        required
        margin="normal"
        defaultValue={values.twitter}
        onChange={handleFormData("twitter")}
        helperText={`Your twitter handle`}
        sx={{ ml: 1, width: '48%' }}
      />

      <TextField    
        type="text"        
        label={`Telegram`}
        variant="outlined"
        placeholder="https://t.me/handle"
        required
        margin="normal"
        defaultValue={values.telegram}
        onChange={handleFormData("telegram")}
        helperText={`Your telegram handle`}
        sx={{ ml: 1, width: '48%' }}
      />

      <TextField    
        type="text"        
        label={`Discord`}
        variant="outlined"
        placeholder="https://"
        required
        margin="normal"
        defaultValue={values.discord}
        onChange={handleFormData("discord")}
        helperText={`Your discord handle`}
        sx={{ ml: 1, width: '48%' }}
      />


    </>
  );
};


export default FounderInfoForm; 
