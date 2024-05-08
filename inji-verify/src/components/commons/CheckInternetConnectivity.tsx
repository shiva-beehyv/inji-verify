import React, { useEffect } from 'react';

const makeAnApiCall = async(): Promise<boolean> => {
    let response;
    try {
        // Try making an api call if the window.navigator.onLine is true
        response = await fetch('https://api.github.com', {
            method: 'HEAD',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'text/plain'
            }
        }); // Use a reliable external endpoint
        return true;
    } catch (error) {
        return false; // Network request failed, assume offline
    }
}

function OnlineStatus() {
    function setInternetConnectivityStatus (status: boolean) {localStorage.setItem("isOnline", status.toString())}
    useEffect(() => {
        window.localStorage.removeItem('isOnline')
        const checkOnlineStatus = async () => {
            // According to docs here: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine,
            // the onLine variable can give false positives, meaning it could say the browser is online occasionally even if it is offline
            // so additional means of checking the internet connectivity is required
            if (!window.navigator.onLine) {
                setInternetConnectivityStatus(false);
                return;
            }
            const status = await makeAnApiCall();
            setInternetConnectivityStatus(status);
        };

        window.addEventListener('online', checkOnlineStatus);
        window.addEventListener('offline', checkOnlineStatus);

        const intervalId = setInterval(checkOnlineStatus, 5000); // Check online status periodically

        checkOnlineStatus(); // Check online status immediately

        return () => {
            clearInterval(intervalId); // Clean up interval
            window.removeEventListener('online', checkOnlineStatus);
            window.removeEventListener('offline', checkOnlineStatus);
        };
    }, []);
    return (
        <></>
    );
}

export default OnlineStatus;
