import { Helmet } from 'react-helmet-async';
// import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container, Theme } from '@mui/material';
import Footer from 'src/components/Footer';

import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
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
import { erc20ABI, useAccount, useContractRead, useNetwork, useToken } from 'wagmi'
import DisplayTokenInfo from './display-token-info';
// import ERC20ABI from '../../../constants/erc20abi.json';
import contractList from '../../../constants/contract-list';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));


function getSteps() {
  return [
    {
      label: "Token information",
      desc: 'Input and approve your Token Address'
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
  console.log('address: ',tokenAddress);

  
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
// const TokenApprovalForm = () => {
//   const { control,getValues   } = useFormContext();
//   //const tokenAddress = useWatch({ control, name: "tokenAddress" });
//   const tokenAddress = getValues("tokenAddress" );

//   const [account,setAccount] = useState('');
//   const [chainId,setChainId] = useState<number>();

//   const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount()
//   const [{ data: chainData, error: chainError, loading: chainLoading }] = useNetwork()

  

//   useEffect(()=>{
//     // chainData.chain?.id,accountData?.address
//     setAccount(accountData?.address);
//     setChainId(chainData.chain?.id);

//   },[accountData, chainData])

//   const [{ data: allowanceData, error, loading }] = useContractRead(
//     {
//       addressOrName: tokenAddress,
//       contractInterface: erc20ABI,
//     },
//     'allowance',
//     {
//       args: [
//         account,
//         contractList[chainId]?.campaignList
//       ],
//     }
//   )

//   if(loading){
//     return (<Typography>Checking your Token Allowance</Typography>)
//   }
  
//   if(error){
// 		return (<Typography>Error Checking your Token Allowance</Typography>);
//   }
//   // const watchTokenAddress = watch("tokenAddress", ''); // you can supply default value as second argument

//   // // Callback version of watch.  It's your responsibility to unsubscribe when done.
//   // useEffect(() => {
//   //   const subscription = watch((value, { name, type }) => console.log(value, name, type));
//   //   return () => subscription.unsubscribe();
//   // }, [watch]);
  
//   if(!!allowanceData){
// 	  return (<Typography>You already approved ZSale for this token</Typography>);
//   }

//   return (
//     <>
// 	  <h4>Approve ZSales Contract to spend your Token</h4>
// 	  <h5>This approval is needed to allow ZSales transfer your tokens as required for the sale </h5>
//     <Controller
//         control={control}
//         name="ap"
//         rules={{ required: "this is required",minLength:42,maxLength: 43 }}

//         render={({ field,  fieldState: { error }  }) => (
//           <TextField
//             id="ap-address"
//             label="Token Address"
//             variant="outlined"
//             placeholder="Enter Your Token Address"
//             required
//             error={!!error}
//             fullWidth
//             margin="normal"
//             ref={field.ref}
//             {...field}
//           />
//         )}
//       />
	      
//     </>
//   );
// };

const SaleInfoForm = () => {
  const { control } = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name="presaleRate"
        render={({ field }) => (
          <TextField
            
            label="Presale Rate"
            variant="outlined"
            placeholder="How many Tokens will 1 Near get you?"
            fullWidth
            margin="normal"
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="softCap"
        render={({ field }) => (
          <TextField
            // id="phone-number"
            label="Soft Cap ( NEAR)"
            variant="outlined"
            placeholder="Enter Your Soft Cap in NEAR"
            fullWidth
            margin="normal"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="hardCap"
        render={({ field }) => (
          <TextField
            // id="alternate-phone"
            label="Hard Cap (NEAR)"
            variant="outlined"
            placeholder="Enter Your Hard Cap"
            fullWidth
            margin="normal"
            {...field}
          />
        )}
      />
    </>
  );
};
const PersonalForm = () => {
  const { control } = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name="address1"
        render={({ field }) => (
          <TextField
            id="address1"
            label="Address 1"
            variant="outlined"
            placeholder="Enter Your Address 1"
            fullWidth
            margin="normal"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="address2"
        render={({ field }) => (
          <TextField
            id="address2"
            label="Address 2"
            variant="outlined"
            placeholder="Enter Your Address 2"
            fullWidth
            margin="normal"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="country"
        render={({ field }) => (
          <TextField
            id="country"
            label="Country"
            variant="outlined"
            placeholder="Enter Your Country Name"
            fullWidth
            margin="normal"
            {...field}
          />
        )}
      />
    </>
  );
};
const PaymentForm = () => {
  const { control } = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name="cardNumber"
        render={({ field }) => (
          <TextField
            id="cardNumber"
            label="Card Number"
            variant="outlined"
            placeholder="Enter Your Card Number"
            fullWidth
            margin="normal"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="cardMonth"
        render={({ field }) => (
          <TextField
            id="cardMonth"
            label="Card Month"
            variant="outlined"
            placeholder="Enter Your Card Month"
            fullWidth
            margin="normal"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="cardYear"
        render={({ field }) => (
          <TextField
            id="cardYear"
            label="Card Year"
            variant="outlined"
            placeholder="Enter Your Card Year"
            fullWidth
            margin="normal"
            {...field}
          />
        )}
      />
    </>
  );
};

function getStepContent( step) {
  
  switch (step) {
    case 0:
      return <TokenInfoForm />;

    case 1:
      return <SaleInfoForm />;
    case 2:
      return <PersonalForm />;
    case 3:
      return <PaymentForm />;
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
      phoneNumber: "",
      alternatePhone: "",
      address1: "",
      address2: "",
      country: "",
      cardNumber: "",
      cardMonth: "",
      cardYear: "",
    },
  });

  const [{ data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount()
  const [{ data: chainData, error: chainError, loading: chainLoading }] = useNetwork()
  
  const [activeStep, setActiveStep] = useState(0);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const steps = getSteps();

  const isStepOptional = (step) => {
    // return step === 1 || step === 2;
    return false;
  };

  const isStepSkipped = (step) => {
    return skippedSteps.includes(step);
  };

  const handleNext = (data) => {
    console.log(data);
    if (activeStep == steps.length - 1) {
      fetch("https://jsonplaceholder.typicode.com/comments")
        .then((data) => data.json())
        .then((res) => {
          console.log(res);
          setActiveStep(activeStep + 1);
        });
    } else {
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

  if(accountLoading || chainLoading){
    return (
      <Typography>Loading BlockChain Data</Typography>
    )
  }

  if(accountError || chainError){
    return (
      <Typography>Error Loading BlockChain Data</Typography>
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

              {activeStep === steps.length ? (
                <Typography variant="h3" align="center">
                  Thank You
                </Typography>
              ) : (
                <>
                  <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(handleNext)}>
                      {getStepContent(activeStep)}

                      <Button
                        className={classes.button}
                        disabled={activeStep === 0}
                        onClick={handleBack}
                      >
                        Back
                      </Button>
                      {isStepOptional(activeStep) && (
                        <Button
                          className={classes.button}
                          variant="contained"
                          color="primary"
                          onClick={handleSkip}
                        >
                          Skip
                        </Button>
                      )}
                      <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        // onClick={handleNext}
                        type="submit"
                      >
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </form>
                  </FormProvider>
                </>
              )}
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
