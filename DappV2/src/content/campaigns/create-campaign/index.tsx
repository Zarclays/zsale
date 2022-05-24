import { Helmet } from 'react-helmet-async';
// import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Theme, CircularProgress } from '@mui/material';
import Footer from 'src/components/Footer';

import React, { useEffect, useRef, useState } from "react";
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
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import SaleInfoForm from './steps/sale-info-form';
import FounderInfoForm from './steps/founder-info-form';
import SummaryForm from './steps/summary-form';

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
const TokenInfoForm = (values, handleFormData) => {
  const { control ,watch } = useFormContext();
  //const tokenAddress = useWatch({ control, name: "tokenAddress" });

  const [tokenAddress, setTokenAddress] = useState('');
  const [alignment, setAlignment] = React.useState('web');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };  
  // const watchTokenAddress = watch("tokenAddress", ''); // you can supply default value as second argument

  // // Callback version of watch.  It's your responsibility to unsubscribe when done.
  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) => console.log(value, name, type));
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  return (
    <>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value="web">Web</ToggleButton>
        <ToggleButton value="android">Android</ToggleButton>
        <ToggleButton value="ios">iOS</ToggleButton>
      </ToggleButtonGroup>
      <TextValidator
             
        label="Token Address"
        variant="outlined"
        placeholder={`Enter Your Token Address`}
        fullWidth
        required
        margin="normal"        
        value={values.tokenAddress}      
        onChange={handleFormData("tokenAddress")}        
        
        name="tokenAddress"
        validators={['required', 'minStringLength:42']}
        errorMessages={['this field is required', 'Minimum of 42 chars is required']}
      />

      {/* <Controller
      //   control={control}
      //   name="tokenAddress"
      //   rules={{ required: "this is required",minLength:42,maxLength: 43 }}

      //   render={({ field,  fieldState: { error }  }) => (
      //     <TextValidator
      //       id="token-address"
      //       label="Token Address"
      //       variant="outlined"
      //       placeholder="Enter Your Token Address"
      //       required
      //       error={!!error}
      //       validators={['required','minStringLength:6']}
      //       errorMessages={['Required','min length 6']}
      //       fullWidth
      //       margin="normal"
      //       ref={field.ref}
      //       {...field}
      //     />
      //   )}
      // />

      // {tokenAddress && tokenAddress.length>=42 && <><DisplayTokenInfo tokenAddress= {tokenAddress}/></>} */}

      
    </>
  );
};







const CreateCampaign = () => {
  const classes = useStyles();
  

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
      addressOrName:  formData.tokenAddress,
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

  const [disabled, setDisabled] = useState(true); // tracks form validation 

  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const formRef = useRef<ValidatorForm>(null);


  const steps = getSteps();

  const isStepOptional = (step) => {
    // return step === 1 || step === 2;
    return false;
  };

  const isStepSkipped = (step) => {
    return skippedSteps.includes(step);
  };

  const handleNext = async (data) => {
    
    const isFormValid = await formRef.current.isFormValid(false);
    
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
          value: utils.parseEther("0.0001")
        }
        );

        
        // Wait for the transaction to be mined...
        const txResult = await tx.wait();

        console.log('txResult: ', txResult)

        alert('Campaign Created succesfully');


        const campaignAddress = txResult.events.filter((f: any)=>f.event=='CampaignCreated')[0].args['createdCampaignAddress'];
        const campaignIndex = txResult.events.filter((f: any)=>f.event=='CampaignCreated')[0].args['index'];
        
        console.log('camp: ', campaignAddress)

        // const campaignContract = new Contract(campaignAddress, CampaignABI, signer);
        const transferTokenTx = await campaignListContract.transferTokens(campaignAddress);        
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

  const validatorListener = (result) => {
        setDisabled( !result);
  }

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
                      
                        {/* <form autoComplete="on" >  */}
                        <ValidatorForm
                            ref={formRef}
                            onSubmit={() => console.log('submitted')}
                            noValidate autoComplete="off"
                            onError={errors => console.log(errors)}
                        >
                        {/* onSubmit={methods.handleSubmit(handleNext)} */}

                          {activeStep===0 && <>
                            <TextValidator
                              id="token-address"
                              label="Token Address"
                              variant="outlined"
                              placeholder="Enter Your Token Address"
                              required                          
                              fullWidth
                              value={formData.tokenAddress} 
                              margin="normal"
                              onChange={(e)=> setFormData(prevState => ({
                                  ...prevState,
                                  ['tokenAddress']: e.target.value
                              }))  }

                              validators={['required', 'minStringLength:42']}
                              errorMessages={['this field is required', 'Minimum of 42 chars is required']}
                              validatorListener={validatorListener}
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
                            <SaleInfoForm handleFormData={handleInputData} values={formData} nativeCoin={chainData.chain?.nativeCurrency?.symbol} setFormData={setFormData} validatorListener={validatorListener}/>
                          </>} 

                          {( activeStep===3 )&& <>
                            <FounderInfoForm handleFormData={handleInputData} values={formData} nativeCoin={chainData.chain?.nativeCurrency?.symbol} setFormData={setFormData} validatorListener={validatorListener}/>
                          </>}

                          {( activeStep===4 )&& <>

                            <h3>Review and Submit</h3>
                            <SummaryForm handleFormData={handleInputData} values={formData} nativeCoin={chainData.chain?.nativeCurrency?.symbol} setFormData={setFormData} validatorListener={validatorListener}/>
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
                            disabled={ disabled || processing}
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            // type="submit"
                          >
                            {activeStep === steps.length - 1 ? "Finish" : "Next"} 
                            {processing && <CircularProgress color="secondary" />}
                          </Button>
                        {/* </form> */}
                        </ValidatorForm>
                      
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
