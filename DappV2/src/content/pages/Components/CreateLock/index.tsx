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

// function getSteps() {
//     return [
//         {
//             label: "Verify Token",
//             desc: "Input your Token Address"
//         },
//         {
//             label: "Creator Name",
//             desc: "Input Authors Name"
//         },
//         {
//             label: "Lock Date",
//             desc: "Date to Lock Token"
//         },
//         {
//             label: "Release Date",
//             desc: "Date to release Locked Token"
//         }
//     ]
// }
function CreateLock() {

    const [selectOption, setSelectedOption] = useState<String>();

    const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedOption(value);
    };

    return (
        <>
        
        <Helmet>
            <title>Create Token Lock</title>
        </Helmet>
        <PageTitleWrapper>
            <PageTitle
            heading="Create Token Lock"
            subHeading="Create a lock for your your token by completing the information below Note: the fields with * are Required."/>
        </PageTitleWrapper>
        
        <Container maxWidth="lg">
            <Grid
            container
            justifyContent={"center"}
            alignItems="stretch"
            spacing={3}
            marginTop={10}>
                <select onChange={selectChange} style={styles.select} >
                    <option selected disabled>
                        Choose Type Of Lock
                        </option>
                        <option value={"bsctestnet"}>Bsc Testnet</option>
                        <option value={"ethtestnet"}>Ethererium</option>
                        <option value={"solatctestnet"}>Solana</option>
                        <option value={"pancaketestnet"}>Pancake Swap</option>
                        </select>
            </Grid>
            <Grid item
            container
            justifyContent={"center"}
            alignItems="stretch"
            spacing={3}
            marginTop={8}>
            <Button style={{fontSize: "30", width: "25"}}>Next</Button>
            </Grid>
            
        </Container>

    
    </>
    )
}

const styles: { [name: string]: React.CSSProperties } = {
    container: {
        marginTop: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    select: {
        padding: 10,
        width: 300,
        fontSize: 25,
    }
};

export default CreateLock;