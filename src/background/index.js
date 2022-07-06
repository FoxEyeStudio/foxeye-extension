chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'clickBackground') {
    }
    sendResponse({status: "true"});
    return true;
});
