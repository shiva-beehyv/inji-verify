// match fot the occurrence of an uppercase letter
const splitCamelCaseRegex: RegExp = /([A-Z][a-z]+)/g;

// match if the first char is lower case
const lowercaseStartRegex: RegExp = /^([a-z])/;

export const convertToTitleCase = (text: string): string => {
    if (!text) return "";
    return text
        // Once match is found, split the words by adding space at the beginning of the natch and ensure the first letter is capital
        .replace(splitCamelCaseRegex, (match) => ` ${match.charAt(0).toUpperCase()}${match.slice(1)}`)
        // convert the first char of 'text' to capital case
        .replace(lowercaseStartRegex, (match) => match.toUpperCase());
};

export const getDisplayValue = (data: any): string => {
    if (data instanceof Array && data?.length > 0) {
        let displayValue = "";
        data.forEach(value => {
            displayValue += `${value}, `;
        });
        return displayValue.slice(0, displayValue.length - 2);
    }
    return data?.toString();
}

export const checkInternetStatus = async (): Promise<boolean> => {
    if (!window.navigator.onLine) return false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    try {
        // Try making an api call if the window.navigator.onLine is true
        await fetch("https://dns.google/", {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'text/plain'
            },
            signal: controller.signal
        }); // Use a reliable external endpoint
        return true;
    } catch (error) {
        return false; // Network request failed, assume offline
    } finally {
        clearTimeout(timeoutId);
    }
}

export const navigateToOffline = () => {
    window.location.assign("/offline");
}