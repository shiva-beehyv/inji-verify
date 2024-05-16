import React, {useEffect, useState} from 'react';
import {convertToTitleCase, fetchWellknownProperties, getDisplayValue} from "../../../../utils/misc";
import StyledButton from "../commons/StyledButton";
import {ReactComponent as DocumentIcon} from '../../../../assets/document.svg';
import {useAppDispatch} from "../../../../redux/hooks";
import {goHomeScreen} from "../../../../redux/features/verification/verification.slice";
import Loader from "../../../commons/Loader";
import {constructWellKnownUrlFromDid} from "../../../../utils/did-utils";

const DisplayVc = ({loadingWellKnown, credentialDisplayProperties, vc}: {credentialDisplayProperties: any, loadingWellKnown: boolean, vc: any}) => {
    return loadingWellKnown ?
        (<div className="w-[100%] m-1">
            <Loader className="my-3 mx-auto"/>
            <div className="my-3 w-[100%] text-center">
                <p>Displaying the credential...</p>
            </div>
        </div>)
        : (<>
            {
                Object.keys(credentialDisplayProperties ?? vc.credentialSubject)
                    .filter(key => key !== "id" && key !== "type")
                    .map((key, index) => (
                        <div
                            className={`py-2.5 px-1 xs:col-end-13 ${(index % 2 === 0) ? "md:col-start-1 md:col-end-6" : "md:col-start-8 md:col-end-13"}`}
                            key={key}>
                            <p className="font-normal  text-[11px]">
                                {credentialDisplayProperties ? credentialDisplayProperties[key].display[0].name : convertToTitleCase(key)}
                            </p>
                            <p className="font-bold text-[12px] ">
                                {getDisplayValue(vc.credentialSubject[key])}
                            </p>
                        </div>
                    ))
            }
        </>)
}

function VcDisplayCard({vc}: {vc: any}) {
    const dispatch = useAppDispatch();
    const [wellKnownProperties, setWellKnownProperties] = useState<any>();
    const [loadingWellKnown, setLoadingWellKnown] = useState(true);

    useEffect(() => {
        fetchWellknownProperties(constructWellKnownUrlFromDid(vc?.issuer))
            .then(response => {
                setWellKnownProperties(response);
            })
            .catch(error => {
                setWellKnownProperties(null);
            })
            .finally(() => {setLoadingWellKnown(false)})
    }, []);

    const credentialDetails = wellKnownProperties?.credentials_supported ? wellKnownProperties?.credentials_supported[0] : null;
    const credentialDisplayProperties: any = credentialDetails?.credential_definition?.credentialSubject;

    return (
        <div>
            <div
                className={`grid xs:w-[90vw] md:w-[400px] m-auto bg-white rounded-[12px] py-[5px] px-[15px] shadow-lg`}>
                {
                    credentialDisplayProperties && (
                        <div className="grid">
                            <div>
                                Credential Issuer: {wellKnownProperties.credential_issuer}
                            </div>
                            <div>
                                Credential Name: {credentialDetails?.display[0].name}
                            </div>
                            <div>
                                Credential Logo: {<img width={100}
                                                       src={credentialDetails?.display[0].logo.url}
                                                       alt={credentialDetails?.display[0].logo.alt_text}/>}
                            </div>
                        </div>
                    )
                }
                {
                    vc ? (<DisplayVc loadingWellKnown={loadingWellKnown}
                                     credentialDisplayProperties={credentialDisplayProperties} vc={vc}/>)
                        : (
                            <div className="grid content-center justify-center w-[100%] text-[#000000] opacity-10">
                                <DocumentIcon/>
                            </div>
                        )
                }
            </div>
            <div className="grid content-center justify-center">
                <StyledButton className="mx-auto my-6" onClick={() => {
                    dispatch(goHomeScreen({}))
                }}>
                    Verify QR Code
                </StyledButton>
            </div>
        </div>
    );
}

export default VcDisplayCard;
