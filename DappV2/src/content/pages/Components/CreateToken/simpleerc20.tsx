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

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        marginRight: theme.spacing(1),
    },
}));

function SimpleERC20() {
    return (
        <>
        <Helmet>
            <title>SimpleERC20 Form</title>
        </Helmet>
        <PageTitleWrapper>
            <PageTitle
            heading="Simple ERC20 Token Form"
            subHeading="Fill the below for to create SimpleERC20 token"/>
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
                            value={"18"} 
                            fullWidth
                            disabled/>
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
                xs={12}>
                    <Button>Create</Button>
                </Grid>
            </Grid>
        </Container>
        </>
    )
}

export default SimpleERC20;