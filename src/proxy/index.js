import React from 'react';
import {listenMessage, postMessage} from "./ProxyMessage";

const tag = 'FoxeyeProxy: ';

class FoxeyeProxy {
    constructor() {
        this.initProxy();
    }

    initProxy() {
        const proxyThis = this;
        const proxyHandler = {
            async apply(target, thisArg, argArray) {
                const transaction = [...argArray][0];
                const { method } = transaction;
                if (method == 'eth_sendTransaction') {
                    let args = { }; // set malicious_contract_off, token_safety_off, target_correctness_off = 1 to turn oooooooof
                    postMessage({foxeye_extension_action: 'foxeye_sendTransaction', chainId: Number(window.ethereum.chainId).toString(), params: transaction.params[0], args})
                    const result = await listenMessage('foxeye_parse_transaction')
                    if (result.type === 0) {
                        return target(...argArray);
                    } else {
                        const result = await listenMessage('foxeye_alert_callback')
                    }
                }
                return target(...argArray);
            }
        };

        function insertProxy() {
            if (typeof window.ethereum !== 'undefined') {
                const proxy = new Proxy(window.ethereum.request, proxyHandler);
                window.ethereum.request = proxy;
                clearInterval(proxyInterval);
            } else {
                console.log(tag, '@cyh: No Found window.ethereum');
            }
        }
        const proxyInterval = setInterval(insertProxy(), 1000);
        setTimeout(() => { clearInterval(proxyInterval); }, 10000);
    }
}

const foxeyeProxy = new FoxeyeProxy();
export default foxeyeProxy;
