export function postMessage(message) {
    const origin = window.location.origin;
    const msg = JSON.parse(JSON.stringify(message));
    window.postMessage(msg, origin);
}

export function listenMessage(action) {
    return new Promise((resolve) => {
        window.addEventListener('message', (e) => {
            if (e.origin !== window.location.origin) {
                return;
            }
            if (typeof e.data.foxeye_extension_action === 'undefined') {
                return;
            }
            if (e.data.foxeye_extension_action !== action) {
                return;
            }
            resolve(e.data);
        });
    });
}
