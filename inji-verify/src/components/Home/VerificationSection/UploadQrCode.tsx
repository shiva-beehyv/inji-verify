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
    /*BrowserQRCodeReader,*/
    QRCodeReader,
    BinaryBitmap,
    HybridBinarizer,
    RGBLuminanceSource,
    MultiFormatReader, BarcodeFormat, DecodeHintType, /*BrowserMultiFormatReader*/
} from '@zxing/library';
import { BrowserMultiFormatReader, BrowserQRCodeReader } from '@zxing/browser';

import { pdfjs } from 'react-pdf';
import QrScanner from 'qr-scanner';
import { Document, Page } from 'react-pdf';
import result from "./Result";
import {BarcodeDetector} from "barcode-detector";

// @ts-ignore
// import {WorkerMessageHandler as pdfjsWorker} from "pdfjs-dist/build/pdf.worker.min.mjs";
import * as pdfjsLib from 'pdfjs-dist';
import {Dispatch} from "redux";


pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();;



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

const decodeQrCodeFromImage = async (imageData: ImageData | undefined) => {
    if (!imageData) {
        console.log("Image data not available");
        return;
    }
    const barcodeDetector = new BarcodeDetector({formats: ["qr_code", "rm_qr_code", "micro_qr_code"]});
    barcodeDetector.detect(imageData)
        .then(result => {console.log("[barcode-detector] Qr code result: ", result[0].rawValue);})
        .catch(error => {console.log("[barcode-detector] Error occurred: ", error);});
};

// const renderPageToImage = async (canvas: HTMLCanvasElement, pageNumber: number, file: File) => {
//     const context = canvas.getContext('2d');
//     const page = await pdfjs.getDocument({ url: URL.createObjectURL(file) }).promise.then(pdf => pdf.getPage(pageNumber));
//     const viewport = page.getViewport({ scale: 2.0 });
//
//     canvas.height = viewport.height;
//     canvas.width = viewport.width;
//     if (!context) {
//         console.log("Canvas context not available");
//     }
//
//     await page.render({ canvasContext: context, viewport: viewport }).promise;
//
//     const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
//     const qrCode = await decodeQrCodeFromImage(imageData);
// };

const readFromPdf = async (file: File, dispatch: Dispatch) => {
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    for (let i = 1; i <= pdf.numPages; i++) {
        try {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement('canvas');
            if (!canvas) return;
            const context = canvas.getContext('2d');
            if (!context) return;
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            // const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            const image = document.createElement('img');
            image.width = 200;
            image.height = 200;
            image.src = canvas.toDataURL();

            const codeReader = new /*BrowserMultiFormatReader*/BrowserQRCodeReader();
            const result = await codeReader.decodeFromImageElement(image);
            console.log(`[pdf] Page - ${i}, Result: ${result}`);
            dispatch(verificationInit({qrReadResult: {qrData: result.getText(), status: "SUCCESS"}, flow: "SCAN"}));
        }
        catch (error) {
            console.log(`[pdf] Page - ${i}, Result: No result`);
        }
    }
}

function readQrFromImage(canvas: HTMLCanvasElement, file: File) {
    const img = /*new Image()*/document.createElement("img");
    img.width = 200;
    img.height = 200;
    const context = canvas.getContext('2d');
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
                .then(result => {console.log("[zxing] Qr code result: ", result.getText());})
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
}

// async function readFromPdfFile(canvas: HTMLCanvasElement, file: File) {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdfDocument = await pdfjs.getDocument({ data: arrayBuffer }).promise;
//     const numPages = pdfDocument.numPages;
//     for (let i = 1; i <= numPages; i++) {
//         const page = await pdfDocument.getPage(i);
//         const image = await renderPageToImage(canvas, page, file);
//         const qrCode = await decodeQrCodeFromImage(image);
//         if (qrCode) {
//             console.log(`QR Code found on page ${i}:`, qrCode);
//         }
//     }
// }

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
                const canvas = document.createElement('canvas');
                console.log("File type: ", file.type);
                if (file.type.startsWith("image/")) {
                    readQrFromImage(canvas, file);
                }
                if (file.type === "application/pdf") {
                    readFromPdf(file, dispatch);
                }
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
                            } else if (getFileExtension(file.name) !== "pdf") {
                                dispatch(raiseAlert({...AlertMessages.qrNotDetected, open: true}));
                                dispatch(goHomeScreen({}));
                            }
                        });
                }}
            />
            <canvas id='canvas' ref={canvasRef} style={{display: 'none'}}></canvas>
        </div>);
}
