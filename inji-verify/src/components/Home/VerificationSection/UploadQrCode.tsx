import {scanFilesForQr} from "../../../utils/qr-utils";
import {AlertMessages, SupportedFileTypes, UploadFileSizeLimits} from "../../../utils/config";
import {ReactComponent as UploadIcon} from "../../../assets/upload-icon.svg";
import {useAppDispatch} from "../../../redux/hooks";
import {goHomeScreen, qrReadInit, verificationInit} from "../../../redux/features/verification/verification.slice";
import {raiseAlert} from "../../../redux/features/alerts/alerts.slice";
import {checkInternetStatus, getFileExtension} from "../../../utils/misc";
import {updateInternetConnectionStatus} from "../../../redux/features/application-state/application-state.slice";
import {AlertInfo} from "../../../types/data-types";
import {useCallback, useEffect, useRef} from "react";
import jsQR from "jsqr";
import {
    BrowserQRCodeReader,
    QRCodeReader,
    BinaryBitmap,
    HybridBinarizer,
    RGBLuminanceSource,
    MultiFormatReader, BarcodeFormat, DecodeHintType, BrowserMultiFormatReader
} from '@zxing/library';

import QrScanner from "qr-scanner";

import result from "./Result";
import {BarcodeDetector} from "barcode-detector";

function getBase64Data(data: string) {

// Define the regex pattern
    const regex = /^data:image\/png;base64,(.+)/;

// Extract the base64 data
    const match = data.match(regex);
    const base64Data = match ? match[0] : "";
    console.log("Base 64 data", base64Data)
    return base64Data;
}

function createBinaryBitmapFromImage(image: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    ctx?.drawImage(image, 0, 0);

    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) {
        console.log("Image data not available");
        return;
    }
    const luminanceSource = new RGBLuminanceSource(imageData.data, canvas.width, canvas.height);
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
    return binaryBitmap;
}

function decodeQRCode(binaryBitmap: BinaryBitmap) {
    const codeReader = new QRCodeReader();
    try {
        const result = codeReader.decode(binaryBitmap);
        console.log('QR Code Data:', result.getText());
    } catch (error) {
        console.error('Error decoding QR code:', error);
    }
}

const doFileChecks = (file: File): AlertInfo | null => {
    // file format check
    const fileExtension = getFileExtension(file.name);
    if (!SupportedFileTypes.includes(fileExtension)) {
        return AlertMessages.unsupportedFileType;
    }

    // file size check
    if (file.size < UploadFileSizeLimits.min || file.size > UploadFileSizeLimits.max) {
        return AlertMessages.unsupportedFileSize;
    }

    return null;
}

const acceptedFileTypes = SupportedFileTypes.map(ext => `.${ext}`).join(', ')

function UploadButton({ displayMessage }: {displayMessage: string}) {
    const dispatch = useAppDispatch();
    return (
        <label
            className="hover:bg-primary bg-[#FFFFFF] hover:text-[#FFFFFF] text-primary bg-no-repeat rounded-[9999px] border-2 border-primary font-bold w-[350px] cursor-pointer text-center px-0 py-[12px] text-[16px] fill-[#ff7f00] hover:fill-white"
            htmlFor={"upload-qr"}
            onClick={async (event) => {
                dispatch(updateInternetConnectionStatus({internetConnectionStatus: "LOADING"}));
                event.stopPropagation();
                event.preventDefault();
                let isOnline = await checkInternetStatus();
                dispatch(updateInternetConnectionStatus({internetConnectionStatus: isOnline ? "ONLINE" : "OFFLINE"}));
                if (isOnline) document.getElementById("upload-qr")?.click();
            }}
        >
            <span className="flex m-auto content-center justify-center w-[100%]">
                <span className="inline-grid mr-1.5">
                    <UploadIcon className="fill-inherit"/>
                </span>
                <span id="upload-qr-code-button" className="inline-grid">
                    {displayMessage}
                </span>
            </span>
        </label>
    );
}

export const UploadQrCode = ({displayMessage, className}: { displayMessage: string, className?: string }) => {
    const dispatch = useAppDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onload = {
        onLoad: useCallback((file: File) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                /*img.onload = () => {
                    console.log("Loading image");
                    const canvas = canvasRef.current;
                    console.log("Canvas", canvas);
                    if (!canvas) return;
                    const context = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context?.drawImage(img, 0, 0);

                    const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
                    console.log("imagedata", imageData)
                    if (!imageData) return;
                    const code = jsQR(imageData.data, canvas.width, canvas.height);
                    console.log("QR data: ", code?.data);
                };*/
                img.onload = () => {
                    QrScanner.scanImage(URL.createObjectURL(file))
                        .then(result => console.log("[qr-scanner] Qr code result: ", result))
                        .catch(error => console.log(error || "[qr-scanner] No QR code found."));

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context?.drawImage(img, 0, 0);
                    const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
                    console.log("[jsqr] Image data", imageData)
                    if (!imageData) return;
                    const code = jsQR(imageData.data, canvas.width, canvas.height);
                    console.log("[jsqr] Qr code result: ", code?.data);

                    try {
                        const hints = new Map();
                        const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX/*, ...*/];
                        hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

                        const multiFormatReader = new BrowserMultiFormatReader();
                        multiFormatReader.decodeFromImageUrl(URL.createObjectURL(file))
                            .then(result => {console.log("[zxing] Qr code result: ", result);})
                            .catch(error => {console.log("[zxing] Error occurred: ", error);});
                    }
                    catch (error) {
                        console.log("[zxing] Error occurred: ", error);
                    }


                    const barcodeDetector = new BarcodeDetector({formats: ["qr_code", "rm_qr_code", "micro_qr_code"]});
                    barcodeDetector.detect(imageData)
                        .then(result => {console.log("[barcode-detector] Qr code result: ", result[0].rawValue);})
                        .catch(error => {console.log("[barcode-detector] Error occurred: ", error);});
                }
                img.src = URL.createObjectURL(file);
            };
            reader.readAsDataURL(file);
        }, [/*canvasRef?.current*/])
    }

    return (
        <div className={`mx-auto my-1.5 flex content-center justify-center ${className}`}>
            <UploadButton displayMessage={displayMessage}/>
            <br/>
            <input
                type="file"
                id="upload-qr"
                name="upload-qr"
                accept={acceptedFileTypes}
                className="mx-auto my-2 hidden h-0"
                onChange={e => {
                    const file = e?.target?.files && e?.target?.files[0];
                    if (!file) return;
                    const alert = doFileChecks(file);
                    if (alert) {
                        dispatch(goHomeScreen({}));
                        dispatch(raiseAlert({...alert, open: true}))
                        if (e?.target)
                            e.target.value = ""; // clear the target to be able to read same file again
                        return;
                    }
                    dispatch(qrReadInit({method: "UPLOAD"}));
                    if (file) {
                        onload.onLoad(file)
                    }
                    scanFilesForQr(file)
                        .then(scanResult => {
                            console.log({scanResult});
                            if (scanResult.error) console.error(scanResult.error);
                            if (!!scanResult.data) {
                                dispatch(raiseAlert({...AlertMessages.qrUploadSuccess, open: true}));
                                dispatch(verificationInit({
                                    qrReadResult: {
                                        qrData: scanResult.data,
                                        status: "SUCCESS"
                                    }
                                }));
                            } else {
                                dispatch(raiseAlert({...AlertMessages.qrNotDetected, open: true}));
                                dispatch(goHomeScreen({}));
                            }
                        });
                }}
            />
            <canvas id='canvas' ref={canvasRef} style={{display: 'none'}}></canvas>
        </div>);
}
