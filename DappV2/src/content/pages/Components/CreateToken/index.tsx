import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { Grid, Container, Theme, CircularProgress, TextField, CardHeader, Divider } from "@mui/material";
import Footer from "src/components/Footer";

import React, { useEffect, useState} from "react";
import {
    Alert,
    AlertTitle,
    Typography,
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
import { Label } from "@mui/icons-material";
import PageTitle from "src/components/PageTitle";

const tokenDetails=([
])

function CreateToken() {
    return (
        <>
        <Helmet>
            <title>Create/Mint Token</title>
        </Helmet>
        <PageTitleWrapper>
            <PageTitle
                heading="Create/Mint Token"
                subHeading="Create Your Token and Also mint it f"/>
        </PageTitleWrapper>

        <Container maxWidth="lg">
        <Grid 
        container
        direction="row"
        justifyContent={"center"}
        alignItems="stretch"
        spacing={3}>
            <Grid item xs={12}>
            <CardHeader title="Fill the form"/>
            <Divider/>
            <CardContent>
                <Box component={"form"}
                sx={{'& .MuiTextField-root': {m: 5, width: '50ch'}}}
                autoComplete="off"
                autoSave='off'>
                <div>
                    <TextField required
                    id="outlined-required"
                    label="Token Name"/>

                    <TextField required
                    id="outlined-required"
                    label="Token Symbol"
                    autoCapitalize="true"/>

                    <TextField required
                    id="outlined-required"
                    label="Total Supply"/>

                    <TextField required
                    id="outlined-required"
                    label="Decimal"
                    autoCapitalize="true"/>

                    <TextField required
                    id="outlined-required"
                    label="Creator"/>

                    <TextField required
                    id="outlined-required"
                    label="Website"
                    placeholder="http://www.example.com"
                    autoCapitalize="true"/>

                    <TextField required
                    id="outlined-required"
                    label="Twitter Page"/>

                    <TextField required
                    id="outlined-required"
                    label="Telegram Page"
                    autoCapitalize="true"/>
                </div>
                <Button>Create Token</Button>
                </Box>
                    </CardContent>
                </Grid>
            </Grid>
        </Container>
        </>
    )
}

export default CreateToken;