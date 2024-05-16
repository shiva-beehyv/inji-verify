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
        <div className="xs:w-[90vw] md:w-[400px]">
            <div className="m-auto bg-white rounded-[12px] pt-1 pb-5 px-[15px] shadow-lg">
                {
                    credentialDisplayProperties && (
                        <>
                            <div
                                className={`justify-start py-2.5 px-1 xs:col-end-13 w-[100%] text-center`}
                            >
                                <img className="mx-auto my-1"
                                     width={100}
                                     src={credentialDetails?.display[0].logo.url}
                                     alt={credentialDetails?.display[0].logo.alt_text}
                                />
                                <p className="font-medium text-[14px] mx-auto my-1">
                                    {credentialDetails?.display[0].name}
                                </p>
                            </div>
                            <div className="h-1 border-b-[1px] border-gray-200 mb-2"/>
                        </>
                    )
                }
                <div
                    className={`grid`}>
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

                {
                    credentialDisplayProperties && (
                        <>
                            <div className="h-1 border-b-[1px] border-gray-200 mb-2"/>
                            <p className="text-[12px] text-right w-[100%] pr-3">
                                Issued by <b>{wellKnownProperties.credential_issuer}</b>
                            </p>
                        </>
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
