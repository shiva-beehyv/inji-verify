import React from 'react';
import StyledButton from "../commons/StyledButton.js";
import PropTypes from "prop-types";
import {StyledHeader, VerificationFailedContainer} from "./styles.js";
import {DISPLAY_TEXT, SUPPORTED_LANGUAGE} from "../../utils/config.js";

function VerificationFailed({onBackPress}) {
    return (
        <VerificationFailedContainer>
            <img
                src="https://verify.cowin.gov.in/static/media/certificate-invalid.a9ac96af.svg"/>
            <StyledHeader>
                {DISPLAY_TEXT[SUPPORTED_LANGUAGE].certificateInvalid}
            </StyledHeader>
            <StyledButton onClick={onBackPress}>
                {DISPLAY_TEXT[SUPPORTED_LANGUAGE].verifyAnotherCertificate}
            </StyledButton>
        </VerificationFailedContainer>
    );
}

VerificationFailed.propTypes = {
    onBackPress: PropTypes.func.isRequired
}

export default VerificationFailed;
