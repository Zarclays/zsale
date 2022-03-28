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
import { Label, SafetyDivider, SafetyDividerRounded, TextFieldsOutlined } from "@mui/icons-material";
import PageTitle from "src/components/PageTitle";
import { DatePicker, DateTimePicker } from "@mui/lab";


function Lock() {
    return (
        <Grid
        container
        direction={"row"}
        justifyContent={"center"}
        alignItems="stretch"
        sx={{m:1, width: "98%"}}>
            <Grid item xs={12}>
            </Grid>
        </Grid>
    )
}

export default Lock;