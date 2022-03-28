import { Helmet } from "react-helmet-async";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { Grid, Container, Theme, CircularProgress, TextField, CardHeader, Divider } from "@mui/material";
import Footer from "src/components/Footer";
import Lock from "src/content/pages/Components/CreateLock/Lock";

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
import { Label, SafetyDivider, SafetyDividerRounded, TextFieldsOutlined } from "@mui/icons-material";
import PageTitle from "src/components/PageTitle";

function getSteps() {
    return [
        {
            label: "Verify Token",
            desc: "Input your Token Address"
        },
        {
            label: "Creator Name",
            desc: "Input Authors Name"
        },
        {
            label: "Lock Date",
            desc: "Date to Lock Token"
        },
        {
            label: "Release Date",
            desc: "Date to release Locked Token"
        }
    ]
}
function CreateLock() {
    return (
    <Box>
        <Helmet>
            <title>Create Token Lock</title>
        </Helmet>
        <PageTitleWrapper>
            <PageTitle
            heading="Create Token Lock"
            subHeading="Create a lock for your your token by completing the information below Note: the fields with * are Required."/>
        </PageTitleWrapper>
        <Grid
        container
        justifyContent={"center"}
        alignItems="stretch"
        sx={{m:1, width: "98%"}}
        >
        <TextField
        inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
        label="Token Address"
        margin="normal"
        placeholder="0x7"
        fullWidth
        required
        // sx={{ml: 30}}
        />
        <Grid
        // sx={{mt: 5, ml: 25}}
        >
            <Button>Verify Token</Button>
        </Grid>
        </Grid>

        <Grid
        sx={{mt: 50}}>
        <Footer/>
        <Lock/>
        </Grid>
        
    </Box>
    )
}

export default CreateLock;