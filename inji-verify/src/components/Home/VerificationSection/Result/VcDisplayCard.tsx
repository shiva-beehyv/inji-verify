import React, {ReactElement} from 'react';
import {Box, Grid, List, ListItem, ListItemText, Typography} from '@mui/material';
import {convertToTitleCase, getDisplayValue} from "../../../../utils/misc";
import StyledButton from "../commons/StyledButton";
import {SAMPLE_VERIFIABLE_CREDENTIAL} from "../../../../utils/samples";
import {SetActiveStepFunction} from "../../../../types/function-types";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {VerificationSteps} from "../../../../utils/config";
import {
    SubHeading,
    VcDisplay,
    VcProperty,
    VcPropertyKey,
    VcPropertyValue,
    VcVerificationFailedContainer
} from "./styles";

const renderNestedObject = (propertyName: string, subObject: any): ReactElement => {
    console.log({propertyName, subObject})
    return (<>

            {propertyName && <SubHeading>
                {convertToTitleCase(propertyName)}
            </SubHeading>}
            <List style={{width: "95%", paddingLeft: 15}}>
                {
                    Object.keys(subObject)
                        .filter(key => key?.toLowerCase() !== "id" && key?.toLowerCase() !== "type")
                        .map(key => {
                            return (typeof subObject[key]) === "object" && !Array.isArray(subObject[key])
                                ? renderNestedObject(key, subObject[key])
                                : (<ListItem style={{width: '100%', margin: "0px auto", padding: "2px 0px"}} key={key}>
                                    <ListItemText style={{margin: "4px auto", padding: "2px 0px"}} primary={`${convertToTitleCase(key)}: `}/>
                                    <ListItemText style={{margin: "4px auto", padding: "2px 0px", textAlign: "right", justifyContent: "left"}} secondary={getDisplayValue(subObject[key])} />
                                </ListItem>)
                        })
                }
            </List>
        </>
    )
}

function VcDisplayCard({vc, setActiveStep}: {vc: any, setActiveStep: SetActiveStepFunction}) {
    return (
        <Box>
            <VcDisplay container>
                {
                    vc ? renderNestedObject("", vc.credentialSubject)
                        : (
                            <VcVerificationFailedContainer>
                                <DescriptionOutlinedIcon fontSize={"inherit"} color={"inherit"}/>
                            </VcVerificationFailedContainer>
                        )
                }
            </VcDisplay>
            <Box style={{
                display: 'grid',
                placeContent: 'center'
            }}>
                <StyledButton style={{margin: "24px auto"}} onClick={() => {
                    setActiveStep(VerificationSteps.ScanQrCodePrompt)
                }}>
                    Verify QR Code
                </StyledButton>
            </Box>
        </Box>
    );
}

export default VcDisplayCard;
