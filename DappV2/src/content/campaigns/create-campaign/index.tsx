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
import DisplayTokenInfo from './display-token-info';
// import ERC20ABI from '../../../constants/erc20abi.json';
import CampaignListABI from '../../../constants/campaign-list-abi.json';
import CampaignABI from '../../../constants/campaign-abi.json';
import contractList from '../../../constants/contract-list';
import { BigNumber , constants, Contract, utils} from 'ethers';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import DesktopDateTimePicker from '@mui/lab/DesktopDateTimePicker';
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));


function getSteps() {
  return [
    {
      label: "Token information",
      desc: 'Input your Token Address'
    },
    {
      label: "Token Alllowance Approval",
      desc: 'Approve your Token Address'
    },
    {
      label: "Campaign Sale Info",
      desc: 'All your sales information'
    },
    {
      label: "Founders  Information",
      desc: 'Information about the backers of the project'
    },
    {
      label: "Finish",
      desc: 'Review and Submit'
    }
  ];
}
const TokenInfoForm = () => {
  const { control ,watch } = useFormContext();
  const tokenAddress = useWatch({ control, name: "tokenAddress" });
    
  // const watchTokenAddress = watch("tokenAddress", ''); // you can supply default value as second argument

  // // Callback version of watch.  It's your responsibility to unsubscribe when done.
  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) => console.log(value, name, type));
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  return (
    <>
      <Controller
        control={control}
        name="tokenAddress"
        rules={{ required: "this is required",minLength:42,maxLength: 43 }}

        render={({ field,  fieldState: { error }  }) => (
          <TextField
            id="token-address"
            label="Token Address"
            variant="outlined"
            placeholder="Enter Your Token Address"
            required
            error={!!error}
            fullWidth
            margin="normal"
            ref={field.ref}
            {...field}
          />
        )}
      />

      {tokenAddress && tokenAddress.length>=42 && <><DisplayTokenInfo tokenAddress= {tokenAddress}/></>}

      
    </>
  );
};


const SaleInfoForm = ({  handleFormData, values, nativeCoin, setFormData=null }) => {
  
  const handleTokenVestingAmountChange= (index, event) => {
    var list = values.tokenVestings.slice(); // Make a copy of the list first.
    list[index].amount = event.target.value; // Update it with the modified field.
    // this.setState({emails: emails}); // Update the state.
    

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

  return (
    <Box

      sx={{
        // m: 1, 
      }}
      
    >
      <TextField    
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}       
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
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}       
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
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
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
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
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
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
        label={`Maximum Order (${nativeCoin??'Coin'} )`}
        variant="outlined"
        placeholder="Maximum Buy size"
        required
        margin="normal"
        defaultValue={values.maxBuy}
        onChange={handleFormData("maxBuy")}
        helperText={`Maximum Amount of ${nativeCoin??'Coin'}  a buyer can make`}
        sx={{ ml: 1, width: '48%' }}
      />

      <TextField    
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
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
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
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

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          renderInput={(params) => <TextField label="Start Date" {...params} variant="outlined" margin="normal" sx={{ ml: 1, width: '48%' }} required helperText={"Start Date"} />}
          value={values.startDate}
          onChange={(newValue) => {
            setFormData(prevState => ({
                ...prevState,
                ["startDate"]: newValue
            }));
          }}
        />

        <DateTimePicker
          renderInput={(params) => <TextField label="End Date" {...params}  margin="normal" sx={{ ml: 1, width: '48%' }} required helperText={"End Date"}/>}
          value={values.endDate}
          onChange={(newValue) => {
            setFormData(prevState => ({
                ...prevState,
                ["endDate"]: newValue
            }));
          }}
        />

      </LocalizationProvider>


      <TextField    
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
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

                  <TextField    
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}        
                    label="Amount to vest"
                    variant="outlined"
                    placeholder=""
                    required
                    margin="normal"
                    defaultValue={vst.amount}
                    onChange={(ev) => handleTokenVestingAmountChange(index, ev)}
                    helperText={`How many tokens to lock`}
                    sx={{ ml: 1, width: '48%' }}
                  />

                  <TextField    
                    type="datetime"       
                    label="Lock Duration"
                    variant="outlined"
                    placeholder=""
                    required
                    margin="normal"
                    defaultValue={vst.releaseDate}
                    onChange={(ev) => handleTokenVestingDayChange(index, ev)}
                    helperText={`Days till locked tokens are released `}
                    sx={{ ml: 1, width: '48%' }}
                  />
                    
                </div>
            
        ) }      


      </Box>}
      
    </Box>
  );
};

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

const SummaryForm = ({  handleFormData, values, nativeCoin, setFormData=null }) => {
  
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

function getStepContent( step) {
  
  switch (step) {
    case 0:
      return <TokenInfoForm />;

    case 1:
      return <SaleInfoForm handleFormData={null} values={undefined} nativeCoin={null}/>;
    case 2:
      return <FounderInfoForm handleFormData={null} values={undefined} nativeCoin={null}/>;
    case 3:
      return <SummaryForm handleFormData={null} values={undefined} nativeCoin={null}/>;
    default:
      return "unknown step";
  }
}

const CreateCampaign = () => {
  const classes = useStyles();
  const methods = useForm({
    defaultValues: {
      tokenAddress: "",
      softCap: "",
      hardCap: "",
      presaleRate: "",
      minBuy: 0,
      maxBuy: 10,
      liquidity: "",
      dexRate: "",
      startDate: "",
      endDate: "",
      liquidtyLockup: 365,
      cardYear: "",
      useTokenVesting: false
    },
  });

  const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount()
  const [{ data: chainData, error: chainError, loading: chainLoading }] = useNetwork()
  
  

  //state for form data
  const [formData, setFormData] = useState({
    tokenAddress: "",
    softCap: "",
    hardCap: "",
    presaleRate: "",
    minBuy: 0,
    maxBuy: 10,
    liquidity: "60",
    dexRate: "",
    startDate: "",
    endDate: "",
    liquidtyLockup: 365,
    cardYear: "",
    useTokenVesting: false,
    tokenVestings:[
      {amount: 1000,releaseDate: '30'},
      {amount: 0,releaseDate: '60'},
      {amount: 0,releaseDate: '120'},
      {amount: 0,releaseDate: ''},
      {amount: 0,releaseDate: ''},
      {amount: 0,releaseDate: ''},
      {amount: 0,releaseDate: ''},
      {amount: 0,releaseDate: ''}
    ], // [{ amount: number,   releaseDate: date}]
    logo: '',
    twitter:'',
    discord:'',
    telegram: '',
    website: '',
    desc: ''

  })

  const [{ data: signer, error, loading }, getSigner] = useSigner()

  const [{ data: allowanceData, error:allowanceError, loading: allowanceLoading }, read] = useContractRead(
    {
      addressOrName: (!formData.tokenAddress || formData.tokenAddress=='' ) ?'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': formData.tokenAddress,
      contractInterface: erc20ABI,
    },
    'allowance',
    {
      args: [
        accountData?.address,
        contractList[chainData.chain?.id]?.campaignList
      ],
      skip: true
    }
  )

  const [activeStep, setActiveStep] = useState(0);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [errorProcessingAllowance, setErrorProcessingAllowance] = useState();

  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();


  const steps = getSteps();

  const isStepOptional = (step) => {
    // return step === 1 || step === 2;
    return false;
  };

  const isStepSkipped = (step) => {
    return skippedSteps.includes(step);
  };

  const handleNext = async (data) => {
    
    if (activeStep == steps.length - 1) {
      
      setProcessing(true);
      const campaignListContract = new Contract(contractList[chainData.chain?.id]?.campaignList, CampaignListABI, signer);
      const now = new Date();

      const nowTimeStamp = Math.floor(now.getTime() / 1000)

      try{
        const tx = await campaignListContract.createNewCampaign(formData.tokenAddress, 
        [
          utils.formatUnits( utils.parseEther(formData.softCap), 'wei'),
          utils.formatUnits( utils.parseEther(formData.hardCap), 'wei'), 
          Math.floor(Date.parse(formData.startDate) / 1000) , 
          Math.floor(Date.parse(formData.endDate) / 1000), 
          utils.formatUnits( utils.parseEther((+formData.hardCap/ 2).toString()), 'wei'),
          utils.formatUnits( utils.parseEther((+formData.hardCap/ 2).toString()), 'wei'),
          utils.formatUnits( utils.parseEther(formData.maxBuy.toString()), 'wei'),
          utils.formatUnits( utils.parseEther(formData.maxBuy.toString()), 'wei'),
          0
        ], 0, contractList[chainData.chain?.id]?.routers[0], 
        [(100 * +formData.liquidity).toFixed(0) , formData.liquidtyLockup,formData.presaleRate, formData.dexRate ],
        
        [formData.logo,'',formData.website, formData.twitter, formData.telegram, formData.discord ],
        formData.tokenVestings.map(v=>{ 
          let n = new Date(now.getTime()) ;
          return {
            releaseDate:  Math.floor( n.setDate(n.getDate() + +v.releaseDate) / 1000), 
            releaseAmount: utils.parseEther(v.amount.toString()), 
            hasBeenClaimed: false
          }
          }),
        [
          {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
          {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
          {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
          {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
          {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
          {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
          {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false},
          {releaseDate: nowTimeStamp,releaseAmount: 0,hasBeenClaimed: false}
        ],

        {
          value: utils.parseEther("0.00001")
        }
        );

        
        // Wait for the transaction to be mined...
        const txResult = await tx.wait();

        console.log('txResult: ', txResult)

        alert('Campaign Created succesfully');


        const campaignAddress = txResult.events.filter((f: any)=>f.event=='CampaignCreated')[0].args['createdCampaignAddress'];
        const campaignIndex = txResult.events.filter((f: any)=>f.event=='CampaignCreated')[0].args['index'];
        


        const campaignContract = new Contract(campaignAddress, CampaignABI, signer);
        const transferTokenTx = await campaignContract.transferTokens();        
        let transfrTxResult =   await transferTokenTx.wait();



        setProcessing(false);

        navigate(`/campaigns/${campaignIndex}`);

      }catch(err){
        console.error('error creating campaign: ', err)
        alert('Campaign Created Failed');
        setProcessing(false);
      }
      
      
    } 
    else if(activeStep==1){
      setProcessing(true);
      

      const token = new Contract(formData.tokenAddress, erc20ABI, signer);
      try{
        const allowance = await token.allowance(accountData?.address, contractList[chainData.chain?.id]?.campaignList);
        
        if(constants.MaxUint256.gt(BigNumber.from(allowance))){
          //request approval
          const erc20_rw = new Contract(formData.tokenAddress, erc20ABI, signer);
          try{
            const tx = await erc20_rw.approve( contractList[chainData.chain?.id]?.campaignList, constants.MaxUint256 );
            
            // Wait for the transaction to be mined...
            await tx.wait();

            setActiveStep(activeStep + 1);
            setProcessing(false);
          }catch(errAllow){
            setErrorProcessingAllowance(errAllow);
            setProcessing(false);
          }
        }else{
          setActiveStep(activeStep + 1);
          setProcessing(false);
        }
      }catch(err){

        setProcessing(false);
      }
      
      
    }
    else {
      setActiveStep(activeStep + 1);
      setSkippedSteps(
        skippedSteps.filter((skipItem) => skipItem !== activeStep)
      );
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSkip = () => {
    if (!isStepSkipped(activeStep)) {
      setSkippedSteps([...skippedSteps, activeStep]);
    }
    setActiveStep(activeStep + 1);
  };

  // handling form input data by taking onchange value and updating our previous form data state
  const handleInputData = input => e => {

    // input value from the form
    const {value } = e.target;

    //updating for data state taking previous state and then adding new value to create new object
    setFormData(prevState => ({
        ...prevState,
        [input]: value
    }));
  }

  if(accountLoading || chainLoading){
    return (
      <Typography>Loading BlockChain Data</Typography>
    )
  }

  if(accountError || chainError || allowanceError){
    return (
      <Typography>Error Loading BlockChain Data</Typography>
    )
  }

  // errorProcessingAllowance

  if(activeStep ==1 &&  errorProcessingAllowance){
    return (
      <Typography>Error Approving Token</Typography>
    )
  }

  // const onSubmit = (data) => {
  //   console.log(data);
  // };
  return <>
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
            
            <h3>
                Start A Campaign
            </h3>

            {(!accountData || !chainData) && <h5 style={{minHeight: '60vh'}} >Connect your Wallet to start </h5> 
              
            }

            
            {accountData && chainData &&
            <div>
              <Stepper alternativeLabel activeStep={activeStep}>
                {steps.map((step, index) => {
                  const labelProps: any = {};
                  const stepProps: any = {};
                  if (isStepOptional(index)) {
                    labelProps.optional = (
                      <Typography
                        variant="caption"
                        align="center"
                        style={{ display: "block" }}
                      >
                        optional
                      </Typography>
                    );
                  }
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step {...stepProps} key={index}>
                      <StepLabel {...labelProps} >
                        
                        <Typography  style={{ fontWeight: "700"}}
                        >
                          {step.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          align="center"
                          style={{ display: "block",  fontWeight: "500"}}
                        >
                          {step.desc}
                        </Typography>
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>

              <Card sx={{ minWidth: 360 }}>
                <CardContent>
                  {activeStep === steps.length ? (
                    <Typography variant="h3" align="center">
                      Thank You
                    </Typography>
                  ) : (
                    <>
                      
                        <form autoComplete="on"> 
                        {/* onSubmit={methods.handleSubmit(handleNext)} */}

                          {activeStep===0 && <>
                            <TextField
                              id="token-address"
                              label="Token Address"
                              variant="outlined"
                              placeholder="Enter Your Token Address"
                              required                          
                              fullWidth
                              margin="normal"
                              onChange={(e)=> setFormData(prevState => ({
                                  ...prevState,
                                  ['tokenAddress']: e.target.value
                              }))  }
                            />

                            { formData.tokenAddress && formData.tokenAddress.length>=42 && <><DisplayTokenInfo tokenAddress= {formData.tokenAddress}/></>}
                          </>}


                          {activeStep===1 && <>
                            {/*<h4>Approve ZSales Contract to spend your Token</h4>
                            <h5>This approval is needed to allow ZSales transfer your tokens as required for the sale </h5>

                            <h5>You will be requested to approve ZSale Contract when you click next if you have not given the contract approval for your Token</h5>*/}

                            <Alert severity="info">
                              <AlertTitle>Approve ZSales Contract to spend your Token</AlertTitle>
                              <h5>This approval is needed to allow ZSales transfer your tokens as required for the sale </h5>

                              <h5>You will be requested to approve ZSale Contract when you click next if you have not given the contract approval for your Token</h5>
                            </Alert>
                          </>}
                          {/* {getStepContent(activeStep)} */}

                          {( activeStep===2 )&& <>
                            <SaleInfoForm handleFormData={handleInputData} values={formData} nativeCoin={chainData.chain?.nativeCurrency?.symbol} setFormData={setFormData}/>
                          </>}

                          {( activeStep===3 )&& <>
                            <FounderInfoForm handleFormData={handleInputData} values={formData} nativeCoin={chainData.chain?.nativeCurrency?.symbol} setFormData={setFormData}/>
                          </>}

                          {( activeStep===4 )&& <>

                            <h3>Review and Submit</h3>
                            <SummaryForm handleFormData={handleInputData} values={formData} nativeCoin={chainData.chain?.nativeCurrency?.symbol} setFormData={setFormData}/>
                          </>}

                          

                           <br/>

                          <Button
                            className={classes.button}
                            disabled={activeStep === 0 || processing}
                            onClick={handleBack}
                          >
                            Back {processing && <CircularProgress color="secondary" />}
                          </Button>
                          {isStepOptional(activeStep) && (
                            <Button
                              disabled={ processing}
                              className={classes.button}
                              variant="contained"
                              color="primary"
                              onClick={handleSkip}
                            >
                              Skip {processing && <CircularProgress color="secondary" />}
                            </Button>
                          )}
                          <Button
                            disabled={ processing}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            // type="submit"
                          >
                            {activeStep === steps.length - 1 ? "Finish" : "Next"} 
                            {processing && <CircularProgress color="secondary" />}
                          </Button>
                        </form>
                      
                    </>
                  )}
                </CardContent>
                
              </Card>

              
            </div>
            }
          </Grid>
        </Grid>
      </Container>
      <Footer />
    
    
    </>
  ;
};



export default CreateCampaign; 
