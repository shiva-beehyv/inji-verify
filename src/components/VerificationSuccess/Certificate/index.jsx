import React from 'react';
import StyledButton from "../../commons/StyledButton.js";
import {Grid} from "@mui/material";

const convertToTitleCase = (text) => {
    let titleCaseText;
    if (text?.length > 0)
    titleCaseText = text.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
    titleCaseText = titleCaseText.charAt(0).toUpperCase() + titleCaseText.slice(1);
    return titleCaseText;
};

const getDisplayValue = (data) => {
    if (data instanceof Array && data?.length > 0) {
        let displayValue = "";
        data.forEach(value => {
            displayValue += `${value}, `;
        });
        return displayValue.slice(0, displayValue.length - 2);
    }
    return data;
}

function Certificate({vc, back}) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            margin: "24px auto"
        }}>
            <img style={{margin: "12px auto"}}
                 width="50px" height="50px"
                src="https://cdn-icons-png.freepik.com/512/5610/5610944.png" alt="verified icon"/>
            <p style={{margin: "8px auto", fontWeight: 500, fontSize: "32px"}}>
                Certificate Successfully verified
            </p>
            <p style={{margin: "24px auto", fontWeight: 500, fontSize: "24px"}}>
                Certificate for {convertToTitleCase(vc.credentialSubject.type)}
            </p>
            <Grid container style={{margin: "auto", padding: "36px 56px", border: '1px solid #bbb', borderRadius: '24px', width: "65%"}}>
                {
                    Object.keys(vc.credentialSubject)
                        .filter(key => key?.toLowerCase() !== "id" && key.toLowerCase() !== "type")
                        .map(key => {
                        return (
                            <>
                                <Grid item container xs={12} md={6}
                                      style={{display: "flex", flexDirection: "row", justifyContent: "center", margin: "12px auto", padding: "0px 8px"}}>
                                    <Grid item xs={12}>{convertToTitleCase(key)}</Grid>
                                    <Grid item xs={12} style={{fontWeight: 500, marginTop: "8px"}}>{getDisplayValue(vc.credentialSubject[key])}</Grid>
                                </Grid>
                            </>
                        )
                    })
                }
            </Grid>
            <div style={{margin: "24px auto"}}>
                <StyledButton onClick={back}>
                    Verify another certificate
                </StyledButton>
            </div>
        </div>
    );
}

export default Certificate;
