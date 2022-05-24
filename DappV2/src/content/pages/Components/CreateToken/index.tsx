import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import DangerousIcon from '@mui/icons-material/Dangerous';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Footer from "src/components/Footer";
import React, {useEffect, useState} from "react";
import SimpleERC20 from "./simpleerc20";

import {
    Typography,
    Button,
    Card,
    Container,
    Box,
    FormControlLabel,
    FormGroup,
    Divider,
    Grid,
    CardContent,
    CardHeader
} from '@mui/material';
import PageTitle from "src/components/PageTitle";
import { SafetyDividerOutlined, SafetyDividerTwoTone } from "@mui/icons-material";
import { display } from "@mui/system";
import BurnMintableERC20 from "./burnmintableerc20";
import StandardERC20 from "./standarderc20";

function CreateToken() {

    return (
        <>

        {/* Heading and Subheading */}
        <Helmet>
            <title>Create/Mint Token</title>
        </Helmet>
        <PageTitleWrapper>
            <PageTitle
            heading="Create/Mint Token"
            subHeading="Choose You Token Creation Plan"/>
        </PageTitleWrapper>
        <Divider/>
        <Container maxWidth="lg">
            <Grid
            container
            justifyContent={"left"}
            alignItems="stretch"
            spacing={3}
            marginTop={5}
            marginBottom={5}>

                {/* Simple ERC20 Token */}
                <Grid item
                alignItems={"stretch"}
                xs={4}
                >
                    <Card>
                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <CardContent sx={{flex: '1 0 auto', width: 'fullWidth'}}>
                                <Typography component={"h1"}
                                 variant="h1" 
                                 align={"center"}>SimpleERC20</Typography>
                                 <Typography variant="h3" align="center">0.035 ETH</Typography>
                                 <Divider/>
                                 <Typography >ERC20 Compliant </Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Verified Source Code </Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Detailed</Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Customizable Decimals </Typography>
                                 <DangerousIcon 
                                 style={{color: "red"}}/>
                                 <Divider/>
                                 <Typography >Remove Copyright </Typography>
                                 <DangerousIcon 
                                 style={{color: "red"}}/>
                                 <Divider/>
                                 <Typography >Supply Type</Typography>
                                 <Typography 
                                 component="p" 
                                 style={{backgroundColor: "yellow", 
                                 width: 40, fontWeight: 600}}>Fixed</Typography>
                                 <Divider/>
                                 <Typography >Access Type</Typography>
                                 <Typography component="p" style={{backgroundColor: "yellow", 
                                 width: 40, fontWeight: 600}}>None</Typography>
                                 <Divider/>
                                 <Typography >Transfer Limit</Typography>
                                 <Typography component="p" 
                                 style={{backgroundColor: "yellow", 
                                 width: 40, fontWeight: 600}}>1K Daily</Typography>
                                 <Divider/>
                                 <Typography>Burnable</Typography>
                                 <DangerousIcon style={{color: "red"}}/>
                                 <Divider/>
                                 <Typography>Mintable</Typography>
                                 <DangerousIcon style={{color: "red"}}/>
                                 <Divider/>
                                 <Typography>ERC1363</Typography>
                                 <DangerousIcon style={{color: "red"}}/>
                                 <Divider/>
                                 <Typography>Token Recover</Typography>
                                 <DangerousIcon style={{color: "red"}}/>
                                 <Divider/>
                                 <Button>Create</Button>
                            </CardContent>
                        </Box>
                    </Card>
                </Grid>

                 {/* Standard ERC20 Token */}
                 <Grid item
                xs={4}>
                    <Card>
                        <Box>
                            <CardContent sx={{flex: '1 0 auto'}}>
                                <Typography component={"h1"}
                                 variant="h1" 
                                 align={"center"}>StandardERC20</Typography>
                                 <Typography variant="h3" align="center">0.075 ETH</Typography>
                                 <Divider/>
                                 <Typography >ERC20 Compliant </Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Verified Source Code </Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Detailed</Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Customizable Decimals </Typography>
                                 <DangerousIcon 
                                 style={{color: "red"}}/>
                                 <Divider/>
                                 <Typography >Remove Copyright </Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Supply Type</Typography>
                                 <Typography 
                                 component="p" 
                                 style={{backgroundColor: "yellow", 
                                 width: 40, fontWeight: 600}}>Fixed</Typography>
                                 <Divider/>
                                 <Typography >Access Type</Typography>
                                 <Typography component="p" style={{backgroundColor: "yellow", 
                                 width: 40, fontWeight: 600}}>None</Typography>
                                 <Divider/>
                                 <Typography >Transfer Limit</Typography>
                                 <Typography component="p" 
                                 style={{backgroundColor: "yellow", 
                                 width: 40, fontWeight: 600}}>10K Daily</Typography>
                                 <Divider/>
                                 <Typography>Burnable</Typography>
                                 <DangerousIcon style={{color: "red"}}/>
                                 <Divider/>
                                 <Typography>Mintable</Typography>
                                 <DangerousIcon style={{color: "red"}}/>
                                 <Divider/>
                                 <Typography>ERC1363</Typography>
                                 <DangerousIcon style={{color: "red"}}/>
                                 <Divider/>
                                 <Typography>Token Recover</Typography>
                                 <DangerousIcon style={{color: "red"}}/>
                                 <Divider/>
                                 <Button>Create</Button>
                            </CardContent>
                        </Box>
                    </Card>
                </Grid>

                 {/* Mintable and Burnable ERC20 Token */}
                 <Grid item
                xs={4}>
                    <Card>
                        <Box>
                            <CardContent sx={{flex: '1 0 auto'}}>
                                <Typography component={"h1"}
                                 variant="h1" 
                                 align={"center"}>BurnMintableERC20</Typography>
                                 <Typography variant="h3" align="center">0.5 ETH</Typography>
                                 <Divider/>
                                 <Typography >ERC20 Compliant </Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Verified Source Code </Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Detailed</Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Customizable Decimals </Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Remove Copyright </Typography>
                                 <CheckCircleIcon 
                                 style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography >Supply Type</Typography>
                                 <Typography 
                                 component="p" 
                                 style={{backgroundColor: "green", 
                                 width: 40, fontWeight: 600}}>Capped</Typography>
                                 <Divider/>
                                 <Typography >Access Type</Typography>
                                 <Typography component="p" style={{backgroundColor: "yellow", 
                                 width: 40, fontWeight: 600}}>Ownable</Typography>
                                 <Divider/>
                                 <Typography >Transfer Limit</Typography>
                                 <Typography component="p" 
                                 style={{backgroundColor: "yellow", 
                                 width: 40, fontWeight: 600}}>100K Daily</Typography>
                                 <Divider/>
                                 <Typography>Burnable</Typography>
                                 <CheckCircleIcon style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography>Mintable</Typography>
                                 <CheckCircleIcon style={{color: "green"}}/>
                                 <Divider/>
                                 <Typography>ERC1363</Typography>
                                 <DangerousIcon style={{color: "red"}}/>
                                 <Divider/>
                                 <Typography>Token Recover</Typography>
                                 <DangerousIcon style={{color: "red"}}/>
                                 <Divider/>
                                 <Button>Create</Button>
                            </CardContent>
                        </Box>
                    </Card>
                </Grid>

                {/* End Of Plans */}
            </Grid>
            <StandardERC20/>
        </Container>
        </>
    )
}

export default CreateToken;