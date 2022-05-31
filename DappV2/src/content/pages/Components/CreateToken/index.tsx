import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import DangerousIcon from '@mui/icons-material/Dangerous';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Footer from "src/components/Footer";
import React, {useEffect, useState} from "react";
import SimpleERC20 from "./simpleerc20";

import {
    List,
    ListItem,
    IconButton,
    ListItemText,
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
    CardHeader,
    ListItemIcon,
    ListSubheader
} from '@mui/material';
import PageTitle from "src/components/PageTitle";
import { Check, Fullscreen, Grid3x3, SafetyDividerOutlined, SafetyDividerTwoTone } from "@mui/icons-material";
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
            justifyContent={"center"}
            alignItems="stretch"
            spacing={3}
            marginTop={5}
            marginBottom={5}>


                {/* Simple ERC20 Token */}
                <Grid item
                alignItems={"stretch"}
                xs={4}>
                    <List
                    sx={{width: "100%", 
                    bgcolor: "background.paper", 
                    paddingTop: 4, 
                    paddingBottom: 3, 
                    borderRadius: 2,}}
                    subheader={
                    <ListSubheader 
                    style={{fontSize: 25, 
                    color: "black", 
                    textAlign: "center", fontWeight: 500,}}>Simple ERC20</ListSubheader>}>
                        <Typography textAlign={"center"} fontSize={20}>ETH 0.035</Typography>
                        <ListItem>
                        <ListItemText id="erc20-compliance" primary="ERC20 Compliance"/>
                        <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="verified-code" primary="Verified Source Code"/>
                            <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="detailed" primary="Detailed"/>
                            <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="customize-decimal" primary="Customizable Decimal"/>
                            <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="remove-copyright" primary="Remove Copyright"/>
                            <DangerousIcon style={{color: "red"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="supply-type" primary="Supply Type"/>
                            <Typography style={{backgroundColor: "darkgoldenrod", padding: 4, borderRadius: 3, fontWeight: 600}}>Fixed</Typography>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="access-type" primary="Access Type"/>
                            <Typography style={{backgroundColor: "darkgoldenrod", padding: 4, borderRadius: 3, fontWeight: 600}}>None</Typography>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="transfer-type" primary="Transfer Type"/>
                            <Typography style={{backgroundColor: "darkgreen", padding: 4, borderRadius: 3, fontWeight: 600, color: "white"}}>Unstoppable</Typography>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="burnable" primary="Burnable"/>
                        <DangerousIcon style={{color: "red"}}/>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="mintable" primary="Mintable"/>
                        <DangerousIcon style={{color: "red"}}/>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="erc1363" primary="ERC1363"/>
                        <DangerousIcon style={{color: "red"}}/>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="token-recover" primary="Token Recover"/>
                        <DangerousIcon style={{color: "red"}}/>
                        </ListItem>
                        <ListItem>
                            <Button>Create</Button>
                        </ListItem>
                    </List>
                </Grid>

                {/* Standard ERC20 Token */}
                <Grid item
                alignItems={"stretch"}
                xs={4}>
                    <List
                    sx={{width: "100%", 
                    bgcolor: "background.paper", 
                    paddingTop: 4, 
                    paddingBottom: 3, 
                    borderRadius: 2,}}
                    subheader={
                    <ListSubheader 
                    style={{fontSize: 25, 
                    color: "black", 
                    textAlign: "center", fontWeight: 500,}}>Standard ERC20</ListSubheader>}>
                        <Typography textAlign={"center"} fontSize={20}>ETH 0.075</Typography>
                        <ListItem>
                        <ListItemText id="erc20-compliance" primary="ERC20 Compliance"/>
                        <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="verified-code" primary="Verified Source Code"/>
                            <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="detailed" primary="Detailed"/>
                            <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="customize-decimal" primary="Customizable Decimal"/>
                            <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="remove-copyright" primary="Remove Copyright"/>
                            <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="supply-type" primary="Supply Type"/>
                            <Typography style={{backgroundColor: "darkgoldenrod", padding: 4, borderRadius: 3, fontWeight: 600}}>Fixed</Typography>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="access-type" primary="Access Type"/>
                            <Typography style={{backgroundColor: "darkgoldenrod", padding: 4, borderRadius: 3, fontWeight: 600}}>None</Typography>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="transfer-type" primary="Transfer Type"/>
                            <Typography style={{backgroundColor: "darkgreen", padding: 4, borderRadius: 3, fontWeight: 600, color: "white"}}>Unstoppable</Typography>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="burnable" primary="Burnable"/>
                        <DangerousIcon style={{color: "red"}}/>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="mintable" primary="Mintable"/>
                        <DangerousIcon style={{color: "red"}}/>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="erc1363" primary="ERC1363"/>
                        <DangerousIcon style={{color: "red"}}/>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="token-recover" primary="Token Recover"/>
                        <DangerousIcon style={{color: "red"}}/>
                        </ListItem>
                        <ListItem>
                            <Button>Create</Button>
                        </ListItem>
                    </List>
                </Grid>

                {/* BurnMintable ERC20 Token */}
                <Grid item
                alignItems={"stretch"}
                xs={4}>
                    <List
                    sx={{width: "100%", 
                    bgcolor: "background.paper", 
                    paddingTop: 4, 
                    paddingBottom: 3, 
                    borderRadius: 2,}}
                    subheader={
                    <ListSubheader 
                    style={{fontSize: 25, 
                    color: "black", 
                    textAlign: "center", fontWeight: 500,}}>BurnMintable ERC20</ListSubheader>}>
                        <Typography textAlign={"center"} fontSize={20}>ETH 0.25</Typography>
                        <ListItem>
                        <ListItemText id="erc20-compliance" primary="ERC20 Compliance"/>
                        <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="verified-code" primary="Verified Source Code"/>
                            <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="detailed" primary="Detailed"/>
                            <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="customize-decimal" primary="Customizable Decimal"/>
                            <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="remove-copyright" primary="Remove Copyright"/>
                            <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText id="supply-type" primary="Supply Type"/>
                            <Typography style={{backgroundColor: "darkgoldenrod", padding: 4, borderRadius: 3, fontWeight: 600}}>Fixed</Typography>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="access-type" primary="Access Type"/>
                            <Typography style={{backgroundColor: "darkgoldenrod", padding: 4, borderRadius: 3, fontWeight: 600}}>Ownable</Typography>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="transfer-type" primary="Transfer Type"/>
                            <Typography style={{backgroundColor: "darkgreen", padding: 4, borderRadius: 3, fontWeight: 600, color: "white"}}>Unstoppable</Typography>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="burnable" primary="Burnable"/>
                        <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="mintable" primary="Mintable"/>
                        <CheckCircleIcon style={{color: "green"}}/>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="erc1363" primary="ERC1363"/>
                        <DangerousIcon style={{color: "red"}}/>
                        </ListItem>
                        <ListItem>
                        <ListItemText id="token-recover" primary="Token Recover"/>
                        <DangerousIcon style={{color: "red"}}/>
                        </ListItem>
                        <ListItem>
                            <Button>Create</Button>
                        </ListItem>
                    </List>
                </Grid>
                {/* End Of Plan */}
                <Footer/>
            </Grid>
        </Container>
        </>
    )
}

export default CreateToken;