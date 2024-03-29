import React, {useEffect, useState} from 'react';
import {verify} from "../utils/verification-utils.js";
import VerificationSuccess from "./VerificationSuccess";
import VerificationFailed from "./VerificationFailed";
import PropTypes from "prop-types";
import {Loader} from "./commons/Loader.js";
import {DISPLAY_TEXT, SUPPORTED_LANGUAGE} from "../utils/config.js";

const decompressData = (compressedData) => {
    //TODO: implement this
    let decompressedData = compressedData ?? "{}";
    return decompressedData;
}

const getVcFromQrData = async (qrData) => {
    return JSON.parse(decompressData(qrData?.text));
}

const getVcStatus = (qrData, setVc, setVcStatus, setLoading) => {
    if (!qrData?.text) return null;
    getVcFromQrData(qrData).then(vc => {
        verify(vc)
            .then(response => {
                setVcStatus(response);
            })
            .catch(error => {
                console.error("Error occurred while verifying the VC. Error: ", error);
                setVcStatus({status: "NOK", checks: []});
            })
    }).catch(error => {
        console.error("Error occurred while reading the qr data. Error: ", error);
        setVcStatus({status: "NOK", checks: []});
    }).finally(() => {
        setLoading(false);
    });
}

function VerificationResult({qrData, onBackPress}) {
    const [vcStatus, setVcStatus] = useState({status: DISPLAY_TEXT[SUPPORTED_LANGUAGE].verifying, checks: []});
    const [vc, setVc] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getVcStatus(qrData, setVc, setVcStatus, setLoading);
    }, [qrData]);

    return (
        loading ? (<Loader/>)
            :
            (vcStatus?.status === "OK"
                ? (<VerificationSuccess vc={vc} onBackPress={onBackPress}/>)
                : (<VerificationFailed onBackPress={onBackPress}/>)
            )
    );
}

VerificationResult.propTypes = {
    qrData: PropTypes.object.isRequired,
    onBackPress: PropTypes.func.isRequired
}

export default VerificationResult;
