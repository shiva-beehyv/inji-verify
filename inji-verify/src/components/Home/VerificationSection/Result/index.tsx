import React, {useEffect, useState} from 'react';
import ResultSummary from "./ResultSummary";
import VcDisplayCard from "./VcDisplayCard";
import {Box} from "@mui/material";
import {CardPositioning, VcStatus} from "../../../../types/data-types";
import {SetActiveStepFunction} from "../../../../types/function-types";
import {ResultsSummaryContainer, VcDisplayCardContainer} from "./styles";

const getPositioning = (resultSectionRef: React.RefObject<HTMLDivElement>): CardPositioning => {
    // top = 340 - it is precalculated based in the xd design
    const positioning = {top: 212, right: 0};
    if (!!resultSectionRef?.current) {
        let resultSectionWidth = resultSectionRef.current.getBoundingClientRect().width;
        if (window.innerWidth === resultSectionWidth) {
            return positioning;
        }
        return {...positioning, right: (resultSectionWidth - 400) / 2};
    }
    return positioning;
}

const Result = ({vc, setActiveStep, vcStatus}: {
    vc: any, setActiveStep: SetActiveStepFunction, vcStatus: VcStatus | null
}) => {
    const initialPositioning: CardPositioning = {};
    const resultSectionRef = React.createRef<HTMLDivElement>();
    const [vcDisplayCardPositioning, setVcDisplayCardPositioning] = useState(initialPositioning);

    useEffect(() => {
        if (resultSectionRef?.current && !(!!vcDisplayCardPositioning.top)) {
            let positioning = getPositioning(resultSectionRef);
            setVcDisplayCardPositioning(positioning);
        }
    }, [resultSectionRef]);
    vc = {
        "id": "did:abc:18d5c3aa-63b8-442d-abc2-dd840b6d14eb",
        "type": [
            "VerifiableCredential"
        ],
        "proof": {
            "type": "Ed25519Signature2020",
            "created": "2024-05-15T07:57:25Z",
            "proofValue": "z344Q1hTwR494VRumTHQWi8moWNB6dc8iS9V8tVnZ3mVZA2WWjzEaxfKni6yYqo2EMHw4DvzjBFXBqYs2ffH4b8PA",
            "proofPurpose": "assertionMethod",
            "verificationMethod": "did:web:holashchand.github.io:test_project:0f0b4d39-e31f-4f8c-be4e-19f0cb351831#key-0"
        },
        "issuer": "did:web:holashchand.github.io:test_project:0f0b4d39-e31f-4f8c-be4e-19f0cb351831",
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            {
                "id": "@id",
                "child": {
                    "@id": "schema:child",
                    "@type": "@id",
                    "@context": {
                        "id": "@id",
                        "dob": "schema:birthDate",
                        "sex": "schema:gender",
                        "full_name": "schema:name",
                        "nationality": "schema:nationality",
                        "place_of_birth": "schema:birthPlace"
                    }
                },
                "father": {
                    "@id": "schema:father",
                    "@context": {
                        "id": "@id",
                        "dob": "schema:birthDate",
                        "full_name": "schema:name",
                        "nationality": "schema:nationality"
                    }
                },
                "mother": {
                    "@id": "schema:mother",
                    "@context": {
                        "id": "@id",
                        "dob": "schema:birthDate",
                        "full_name": "schema:name",
                        "nationality": "schema:nationality"
                    }
                },
                "schema": "https://schema.org/",
                "@version": 1.1,
                "@protected": true,
                "registration": {
                    "@id": "schema:registration",
                    "@context": {
                        "id": "@id",
                        "date_of_issuance": "schema:startDate",
                        "registration_number": "schema:identifier",
                        "date_of_registration": "schema:startDate"
                    }
                },
                "CitizenshipCredential": {
                    "@id": "@id",
                    "@context": {
                        "id": "@id",
                        "@version": 1.1,
                        "@protected": true
                    }
                }
            },
            "https://w3id.org/security/suites/ed25519-2020/v1"
        ],
        "issuanceDate": "2024-05-15T07:57:25.072Z",
        "expirationDate": "2030-05-14T07:49:54Z",
        "credentialSubject": {
            "id": "did:1234",
            "child": {
                "dob": "2024-01-15",
                "sex": "Male",
                "full_name": "Alex Jameson Taylor",
                "nationality": "Arandian",
                "place_of_birth": "Central Hospital, New Valera, Arandia"
            },
            "father": {
                "dob": "1988-04-22",
                "full_name": "Michael David Taylor",
                "nationality": "Arandian"
            },
            "mother": {
                "dob": "1990-06-05",
                "full_name": "Emma Louise Taylor",
                "nationality": "Arandian"
            },
            "registration": {
                "date_of_issuance": "2002-01-22",
                "registration_number": "2002-AR-015678",
                "date_of_registration": "2002-01-20"
            }
        }
    }
    vcStatus = {status: "OK", checks: []};

    let success = vcStatus?.status === "OK";
    // validate vc and show success/failure component
    return (
        <Box id="result-section" ref={resultSectionRef}>
            <ResultsSummaryContainer success={success}>
                <ResultSummary success={success}/>
            </ResultsSummaryContainer>
            <VcDisplayCardContainer
                style={{position: "absolute"}}
                cardPositioning={{top: vcDisplayCardPositioning.top, right: vcDisplayCardPositioning.right}}>
                <VcDisplayCard vc={vc} setActiveStep={setActiveStep}/>
            </VcDisplayCardContainer>
        </Box>
    );
}

export default Result;
