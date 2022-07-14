import riskCenter from './RiskCenter'

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
        if (request.foxeye_extension_action === 'foxeye_sendTransaction') {
            const { chianId, params, args } = request;
            const result = await riskCenter.parseTransaction(chianId, params, args);
            sendResponse(result);
        }
    })
    return true;
});
