import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useQrReader } from 'react-qr-reader';
import {useAppDispatch} from "../../../redux/hooks";
import {goHomeScreen, verificationInit} from "../../../redux/features/verification/verification.slice";
import {toggleTorch} from "../../../utils/video-utils";
import {raiseAlert} from "../../../redux/features/alerts/alerts.slice";
import StyledButton from "./commons/StyledButton";

const QrScannerV3 = (props: any) => {
    const dispatch = useAppDispatch();
    const [torch, setTorch] = useState(false);
    /*const videoRef = useRef(null);*/
    const [videoTrack, setVideoTrack] = useState<MediaStreamTrack | undefined>();
    const stopVideoTrack = useCallback(() => {
        console.log(`Track state: ${videoTrack?.readyState}`);
        const videoElement = document.getElementById("qr-code-scanner") as HTMLVideoElement | null;
        if (videoTrack?.readyState === "live" && videoElement && videoElement.srcObject) {
            console.log("Stopping video track")
            videoTrack?.stop();
            videoElement.pause();
            // videoElement.srcObject = null;
        }
    }, [videoTrack]);

    useEffect(() => {
        // return stopVideoTrack;
    }, [stopVideoTrack]);

    const toggleTorchCallback = useCallback(() => {
        toggleTorch(videoTrack, torch)
            .then((torchStatus) => {
                setTorch(torchStatus);
                console.log("Torch status toggled");
            })
            .catch(error => {
                console.error("Failed to toggle the torch status. Error: ", error);
            });
    }, [videoTrack, torch]);

    /*useEffect(() => {
        const videoElement = (videoRef?.current as (HTMLVideoElement | null));

        let stream: MediaStream | undefined = undefined;
        function setStream(newStream: MediaStream) {
            stream = newStream;
        }
        if (videoElement) {
            // Load only if the video is not playing
            if (videoElement.readyState >= videoElement.HAVE_ENOUGH_DATA) return;

            navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}})
                .then(stream => {
                    setVideoStream(stream);
                    setStream(stream);
                    const videoElement = videoRef.current as (HTMLVideoElement | null);
                    if (videoElement) {
                        videoElement.srcObject = stream as MediaStream;
                        // setVideoDeviceId(videoStream.getVideoTracks()[0].id);
                        videoElement.addEventListener("loadeddata", () => {
                            videoElement.play();
                        });
                    }
                })
        }
        return () => {
            console.log("Video state: ", videoElement?.readyState, " Enough data: ", )
            if (videoElement && (videoElement.readyState >= videoElement.HAVE_ENOUGH_DATA) &&
                stream && stream?.active) {
                console.log("Stopping video stream");
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [videoRef]);*/
    useQrReader(
        {
            videoId: "qr-code-scanner",
            constraints: {
                facingMode: "environment"
            },
            onResult: (result, error, codeReader) => {
                if (result) {
                    (codeReader as any).processingScan = false;
                    console.log("Result: ", result, result.getText());
                    // stopVideoTrack();
                    dispatch(verificationInit({qrReadResult: {qrData: result.getText(), status: "SUCCESS"}}));
                } else {
                    console.log("Error: ", error);
                }
            },
            scanDelay: 125
        }
    );

    return (
        <>
            <div
                className="grid place-items-center place-content-center w-[250px] lg:w-[316px] rounded-[12px] aspect-square"
            >
                <video
                    id="qr-code-scanner"
                    /*ref={videoRef}*/
                    className="object-cover object-center"
                    onPlay={() => {
                        const videoElement = document.getElementById("qr-code-scanner") as HTMLVideoElement | null;
                        if (videoElement && videoElement.srcObject) {
                            console.log((videoElement.srcObject as MediaStream)?.getVideoTracks());
                            setVideoTrack((videoElement.srcObject as MediaStream)?.getVideoTracks()[0]);
                        }
                    }}
                    // onEnded={}
                />
                <button onClick={() => {
                    toggleTorchCallback();
                }}>
                    toggle torch
                </button>
            </div>
            <div className="col-span-12">
                <StyledButton
                    id="verification-back-button"
                    className="w-[100%] lg:w-[350px] max-w-[280px] lg:max-w-none mt-[18px]"
                    onClick={() => {
                        // stopVideoTrack();
                        dispatch(goHomeScreen({}))
                    }}>
                    Back
                </StyledButton>
            </div>
        </>
    );
};

export default QrScannerV3;
