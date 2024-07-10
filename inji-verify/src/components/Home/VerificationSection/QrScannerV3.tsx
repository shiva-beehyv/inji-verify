import React, {useEffect} from 'react';
import { useQrReader } from 'react-qr-reader';
import {useAppDispatch} from "../../../redux/hooks";
import {verificationInit} from "../../../redux/features/verification/verification.slice";

function stopWebCam() {
    const videoElement = (document.getElementById("qr-code-scanner") as HTMLVideoElement);
    if (!videoElement) return;
    console.log("Stopping webcam")
    videoElement?.pause();
    const stream = videoElement?.srcObject as MediaStream;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    videoElement.srcObject = null;
    videoElement.remove();
}

const QrScannerV3 = (props: any) => {
    const dispatch = useAppDispatch();
    useQrReader({
            constraints: {
                autoGainControl: true,
                facingMode: "environment"
            },
            videoId: "qr-code-scanner",
            onResult: (result, error, codeReader) => {
                if (result) {
                    if (codeReader) {
                        console.log("Stopping scan");
                        (codeReader as any).processingScan = false;
                    }

                    console.log("Result: ", result, result.getText());
                    stopWebCam();
                    dispatch(verificationInit({qrReadResult: {qrData: result.getText(), status: "SUCCESS"}}));
                }
            },
        scanDelay: 125
        }
    );
    /*
    useEffect(() => {
        const videoElement = document.getElementById("qr-code-scanner");
        if (!videoElement) return;
        const stream = (videoElement as HTMLVideoElement).srcObject;
        if (stream) {
            const videoTrack = (stream as MediaStream).getVideoTracks()[0];
            const capabilities = videoTrack.getCapabilities();
            const settings = videoTrack.getSettings();
            const constraints = videoTrack.getConstraints();
            console.log({capabilities, });
        }
    }, []);*/

    /*useEffect(() => {
        return stopWebCam
    }, []);*/

    return (
        <div
            className="grid place-items-center place-content-center w-[250px] lg:w-[316px] rounded-[12px] aspect-square"
        >
            <video
                id="qr-code-scanner"
                className="object-cover object-center"
                /*onAbort={event => {
                    stopWebCam()
                }}*/
            />
        </div>
    );
};

export default QrScannerV3;
