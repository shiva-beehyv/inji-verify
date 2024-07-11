export const toggleTorch = async (videoTrack, currentTorchStatus) => {
    if (videoTrack) {
        const capabilities = videoTrack?.getCapabilities();
        if (capabilities?.torch) {
            const newTorchState = !currentTorchStatus;
            await videoTrack?.applyConstraints({
                advanced: [{ torch: newTorchState }]
            });
            return newTorchState;
        } else {
            console.log('Torch not supported on this device.');
        }
    }
    return currentTorchStatus;
}
