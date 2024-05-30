import { call, put, takeLatest } from 'redux-saga/effects';
import {goHomeScreen, verificationComplete, verificationInit} from './verification.slice';
import {raiseAlert} from "../alerts/alerts.slice";
import { AlertMessages } from '../../../utils/config';
import { decodeQrData } from '../../../utils/qr-utils'; // Assuming these functions are defined elsewhere
import {verify} from '../../../utils/verification-utils';
import {VcStatus} from "../../../types/data-types";
import {checkInternetStatus, navigateToOffline} from "../../../utils/misc";

function* handleVerification(qrData: string) {
    try {
        const vc: object = yield call(JSON.parse, (decodeQrData(qrData)));
        yield call(verifyVC, vc);
    } catch (error) {
        console.log(error)
        yield put(goHomeScreen({}));
        yield put(raiseAlert({...AlertMessages.qrNotSupported, open: true}));
    }
}

function* verifyVC(vc: any) {
    const onLine: boolean = yield call(checkInternetStatus);
    try {
        const status: VcStatus = yield call(verify, vc);
        console.log("VC Status [logging in saga]: ", status);
        if (status?.checks?.length >= 0 && status?.checks[0].proof === "NOK" && !onLine) {
            yield call(navigateToOffline);
        }
        yield put(verificationComplete({ verificationResult: { vc, vcStatus: status } }));
    } catch (error) {
        console.error("Error occurred while verifying the VC: ", error);
        if (!onLine) {
            yield call(navigateToOffline);
            return;
        }
        yield put(verificationComplete({
            verificationResult: {
                vcStatus: {
                    status: "NOK",
                    checks: []
                },
                vc: null
            }
        }));
    }
}

function* verificationSaga() {
    yield takeLatest(verificationInit, function* ({ payload }) {
        yield call(handleVerification, payload.qrReadResult?.qrData);
    });
}

export default verificationSaga;
export {handleVerification, verifyVC}
