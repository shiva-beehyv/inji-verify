import React, {useEffect, useState} from 'react';
import {convertToTitleCase, getDisplayValue} from "../../../../utils/misc";
import StyledButton from "../commons/StyledButton";
import {ReactComponent as DocumentIcon} from '../../../../assets/document.svg';
import {useAppDispatch} from "../../../../redux/hooks";
import {goHomeScreen} from "../../../../redux/features/verification/verification.slice";
import Loader from "../../../commons/Loader";

const InsuranceVC = {
    "id": "did:rcw:d3db7d41-3f58-4ade-8483-1fb792ffa183",
    "type": ["VerifiableCredential", "InsuranceCredential"],
    "proof": {
        "type": "Ed25519Signature2020",
        "created": "2024-04-26T07:14:20Z",
        "proofValue": "z2nR3qEy5wMqsTj3jypfRhQFjVZjpFSRgoxL6hwNm3Hj7Dr12YQ3mdatHWm8dSkLuNEEVNASqntgMRCeUTa6hRiad",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:web:holashchand.github.io:test_project:32b08ca7-9979-4f42-aacc-1d73f3ac5322#key-0"
    },
    "issuer": "did:web:holashchand.github.io:test_project:32b08ca7-9979-4f42-aacc-1d73f3ac5322",
    "@context": ["https://www.w3.org/2018/credentials/v1", "https://holashchand.github.io/test_project/insurance-context.json", "https://w3id.org/security/suites/ed25519-2020/v1"],
    "issuanceDate": "2024-04-26T07:14:20.232Z",
    "expirationDate": "2024-05-26T07:14:20.214Z",
    "credentialSubject": {
        "id": "did:jwk:eyJrdHkiOiJSU0EiLCJlIjoiQVFBQiIsInVzZSI6InNpZyIsImFsZyI6IlJTMjU2IiwibiI6InNvdGl0N1RDOTIxazVhUE54YVIycHoxM3JtSVFUX2NUb0tMSVFiTnl0X2psbEszUjdDa2UtYUF5MjRwbjJwRWpLMW1ISElENWNyN1JZS3FzZWNZM1lNb29yYW5vdHdSRm5rTk8zelVwWWo0emlnV1MyVnlSUjdScVo2b3dLbzFlYS0tbl95ZDhnS3BCTkVTdVFkZmY4UkVXeEZfcElPdmNjb1dlMVhjRGNCbFgyTXJYLXdxclp5ZERLN1ZlOXVIM0RTREFQWVByTGFOX2hJQmpyczlNU0x5UGxFRExqQW5IdnptaHlNQ3RRNlV2MWpFV09PUk54OUxRRHNpTDRuektfb3FPMEo3RnRwaEhQbWRfM0lURW1jd2pFWTVXWnZsLUhZOHBjTFFzZW1uN1Bfak1mZDZwQ1FNYmRfa1ViN2ZncXliaU5LYlk4MFA3NVNrbzRSOV9lMWx6eThVOFpDb0pEZGJlMkhJU01jemVUckYwN3liMFBZT19Ia0xXRWlUV3RVVzdyS1JqcDVyZTYzU3hEbTMwNGxseU8yNUMzemttS0N1Zm1MUHZhOHd4Vi1TQlowdjE3U1E0YmFmUnNhNVc0N3BsdnRDVEpuNEI1MmRTZnpLSzVER1ZYeW1NeXllRlpPTWk2UVNFV1lxWk9Pakl3Ul9hYmFWOFhnNnJGU1NfOXBxUDlLNnoyTjV1MkRNWHlJOHBMdGZjUXFWMlFiQkhqUE1aRjI2WXA4MXpDZXpOcVVSMHQyY0ZHaWUxZDZYa2wtRC03bjc1Nzc4elI1U29TOENIbnZtdzRmbGViS1VzcG5tek81dFYtSEtYeDVLMVIzUDdmOUJhanRMWEoyTERpZTRIeHpCS2NwMGs0ME92ZHJMdnVPci1hNXA2OEdSVkxZOUdwdllELXAwIn0=",
        "dob": "1999-08-31",
        "email": "Vinoth4@gmail.com",
        "gender": "Male",
        "mobile": "7708189347",
        "benefits": ["No Toll Fee", "Free Movie Tickets"],
        "fullName": "Vinoth",
        "policyName": "Vinoth",
        "policyNumber": "020202",
        "policyIssuedOn": "2023-04-20",
        "policyExpiresOn": "2027-04-20"
    }
}

const WellKnownProperties = {
    "credential_issuer": "Sunbird",
    "credential_endpoint": "https://${mosip.esignet.insurance.host}/v1/esignet/vci/credential",
    "credentials_supported": [
        {
            "format": "ldp_vc",
            "id": "InsuranceCredential",
            "scope": "sunbird_rc_insurance_vc_ldp",
            "cryptographic_binding_methods_supported": [
                "did:jwk"
            ],
            "cryptographic_suites_supported": [
                "RsaSignature2018"
            ],
            "proof_types_supported": [
                "jwt"
            ],
            "credential_definition": {
                "type": [
                    "VerifiableCredential",
                    "InsuranceCredential"
                ],
                "credentialSubject": {
                    "fullName": {
                        "display": [
                            {
                                "name": "Full Name",
                                "locale": "en"
                            }
                        ]
                    },
                    "policyName": {
                        "display": [
                            {
                                "name": "Policy Name",
                                "locale": "en"
                            }
                        ]
                    },
                    "policyNumber": {
                        "display": [
                            {
                                "name": "Policy Number",
                                "locale": "en"
                            }
                        ]
                    },
                    "gender": {
                        "display": [
                            {
                                "name": "Gender",
                                "locale": "en"
                            }
                        ]
                    },
                    "expiresOn": {
                        "display": [
                            {
                                "name": "Expiry Date",
                                "locale": "en"
                            }
                        ]
                    },
                    "dob": {
                        "display": [
                            {
                                "name": "Date Of Birth",
                                "locale": "en"
                            }
                        ]
                    }
                }
            },
            "display": [
                {
                    "name": "MOSIP Insurance",
                    "locale": "en",
                    "logo": {
                        "url": "https://${mosip.api.public.host}/inji/mosip-logo.png",
                        "alt_text": "insurance logo"
                    },
                    "background_color": "#fafcff",
                    "text_color": "#00284d"
                }
            ]
        },
        {
            "format": "ldp_vc",
            "id": "LifeInsuranceCredential_ldp",
            "scope": "life_insurance_vc_ldp",
            "cryptographic_binding_methods_supported": [
                "did:jwk"
            ],
            "cryptographic_suites_supported": [
                "RsaSignature2018"
            ],
            "proof_types_supported": [
                "jwt"
            ],
            "credential_definition": {
                "type": [
                    "VerifiableCredential",
                    "LifeInsuranceCredential"
                ],
                "credentialSubject": {
                    "fullName": {
                        "display": [
                            {
                                "name": "Full Name",
                                "locale": "en"
                            }
                        ]
                    },
                    "policyName": {
                        "display": [
                            {
                                "name": "Policy Name",
                                "locale": "en"
                            }
                        ]
                    },
                    "policyNumber": {
                        "display": [
                            {
                                "name": "Policy Number",
                                "locale": "en"
                            }
                        ]
                    },
                    "gender": {
                        "display": [
                            {
                                "name": "Gender",
                                "locale": "en"
                            }
                        ]
                    },
                    "policyExpiresOn": {
                        "display": [
                            {
                                "name": "Expiry Date",
                                "locale": "en"
                            }
                        ]
                    },
                    "dob": {
                        "display": [
                            {
                                "name": "Date Of Birth",
                                "locale": "en"
                            }
                        ]
                    }
                }
            },
            "display": [
                {
                    "name": "Sunbird Life Insurance",
                    "locale": "en",
                    "logo": {
                        "url": "https://sunbird.org/images/sunbird-logo-new.png",
                        "alt_text": "Sunbird life insurance logo"
                    },
                    "background_color": "#fefcfa",
                    "text_color": "#7C4616"
                }
            ]
        }
    ]
}

const fetchWellknownProperties = async (url: string) => {
    url = "https://raw.githubusercontent.com/mosip/mosip-config/develop/sunbird-insurance-wellKnown.json";
    try {
        const response = await fetch(url);
        return await response.json();
    }
    catch (error) {
        console.log(`Error occurred while fetching display properties of the credential. url: ${url}, error: ${error}`)
    }
}

const constructWellKnownUrlFromDid = (did: string) => {
    //TODO: add logic to construct the wellknown url from a web did
    return "https://raw.githubusercontent.com/mosip/mosip-config/develop/sunbird-insurance-wellKnown.json";
}

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
                Object.keys(credentialDisplayProperties)
                    .map((key, index) => (
                        <div
                            className={`py-2.5 px-1 xs:col-end-13 ${(index % 2 === 0) ? "md:col-start-1 md:col-end-6" : "md:col-start-8 md:col-end-13"}`}
                            key={key}>
                            <p className="font-normal  text-[11px]">
                                {credentialDisplayProperties[key].display[0].name}
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
    const [wellKnownProperties, setWellKnownProperties] = useState(WellKnownProperties);
    const [loadingWellKnown, setLoadingWellKnown] = useState(true);

    useEffect(() => {
        fetchWellknownProperties(constructWellKnownUrlFromDid(vc?.issuer))
            .then(response => {
                setWellKnownProperties(response);
            })
            .catch(error => {
                // TODO: remove this and add appropriate handling
                setWellKnownProperties(WellKnownProperties);
            })
            .finally(() => {setLoadingWellKnown(false)})
    }, []);

    const credentialDetails = wellKnownProperties?.credentials_supported?.filter(cred => cred/*write filter condition*/)[0];
    const credentialDisplayProperties: any = credentialDetails.credential_definition.credentialSubject;

    return (
        <div>
            <div className={`grid xs:w-[90vw] md:w-[400px] m-auto bg-white rounded-[12px] py-[5px] px-[15px] shadow-lg`}>
                {
                    vc ? (<DisplayVc loadingWellKnown={loadingWellKnown} credentialDisplayProperties={credentialDisplayProperties} vc={vc}/>)
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
