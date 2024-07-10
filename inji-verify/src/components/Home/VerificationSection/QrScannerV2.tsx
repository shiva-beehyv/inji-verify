import React, {useEffect} from 'react';
import QrScanner from "qr-scanner";

function QrScannerV2(props: any) {
    useEffect(() => {
        const qrCodeScannerElement = document.getElementById("qr-code-scanner");
        if (!qrCodeScannerElement) return;
        const qrScanner = new QrScanner(
            qrCodeScannerElement as HTMLVideoElement,
            result => {
                console.log('decoded qr code:', result)
            },
            {
                preferredCamera: "environment",
                onDecodeError: (error) => {console.log("Error occurred while decoding: ", error)}
                /* your options or returnDetailedScanResult: true if you're not specifying any other options */ },
        );
        // qrScanner.
        qrScanner.start().then(() => {
            console.log("Scanner started");
        }).catch(error => {
            console.error("Error occurred while starting the scanner: ", error);
        });
        return () => {
            qrScanner.stop();
            qrScanner.destroy();
        }
    }, []);
    return (
        <div
            className="grid place-items-center place-content-center w-[250px] lg:w-[316px] rounded-[12px] aspect-square"
        >
            <video
                id="qr-code-scanner"
                className="object-cover object-center"
            />
        </div>
    );
}

export default QrScannerV2;
