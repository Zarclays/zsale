import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Footer from "src/components/Footer";
import React, {useEffect, useState} from "react";

import{
    Typography,
    Button,
    Card,
    Container,
    Box,
    Divider,
    Grid,
    Theme,
    CircularProgress,
    TextField,
} from "@mui/material";
import { styled } from "@mui/styles";
import makeStyles from '@mui/styles/makeStyles';
import PageTitle from "src/components/PageTitle";
import { Sync } from "@mui/icons-material";

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        marginRight: theme.spacing(1),
    },
}));

function BurnMintableERC20() {
    return (
        <>
        <Helmet>
            <title>BurnMintableERC20 Form</title>
        </Helmet>
        <PageTitleWrapper>
            <PageTitle
            heading="BurnMintable ERC20 Token Form"
            subHeading="Fill the below for to create BurnMintableERC20 token"/>
        </PageTitleWrapper>
        <Divider/>
        <Container maxWidth="lg">
            <Grid
            container
            justifyContent={"center"}
            alignItems="stretch"
            spacing={3}
            marginTop={5}
            marginBottom={10}>
                <Grid item
                alignItems={"stretch"}
                xs={6}>
                            <TextField id="outlined-required" 
                            placeholder="Zsale" 
                            label="Token Name"
                            fullWidth
                            required/>
                </Grid>
                <Grid item
                alignItems={"stretch"}
                xs={6}>
                            <TextField id="outlined-required" 
                            label="Symbol"
                            placeholder="ZLC"
                            fullWidth
                            required/>
                </Grid>
                <Grid item
                alignItems={"stretch"}
                xs={6}>
                            <TextField id="outlined-required" 
                            label="Decimals"
                            placeholder="Default 18"
                            fullWidth
                            />
                </Grid>
                <Grid item
                alignItems={"stretch"}
                xs={6}>
                    <TextField id="outlined-required" 
                    placeholder="100000.........." 
                    label="Total Supply"
                    fullWidth
                    required/>
                </Grid>
                <Grid item
                alignItems={"stretch"}
                xs={6}>
                    <TextField
                    label="Mintable"
                    value={"True"}
                    disabled/>
                </Grid>
                <Grid item
                alignItems={"stretch"}
                xs={6}>
                    <TextField
                    label="Burnable"
                    value={"True"}
                    disabled/>
                </Grid>
                <Grid item
                alignItems={"stretch"}
                xs={12}>
                    <Button>Create</Button>
                </Grid>
            </Grid>
        </Container>
        </>
    )
}

export default BurnMintableERC20;