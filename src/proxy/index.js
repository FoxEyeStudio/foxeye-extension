import React from 'react';
import RiskCenter from "../background/RiskCenter";

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
                    const result = await RiskCenter.get().parseTransaction(Number(window.ethereum.chainId).toString(), transaction.params[0], args);
                    console.log(tag, result);
                }
                return target(...argArray);
            }
        };

        const proxyInterval = setInterval(insertProxy(), 1000);
        function insertProxy() {
            if (typeof window.ethereum !== 'undefined') {
                const proxy = new Proxy(window.ethereum.request, proxyHandler);
                window.ethereum.request = proxy;
                clearInterval(proxyInterval);
            } else {
                console.log(tag, '@cyh: No Found window.ethereum');
            }
        }
        setTimeout(() => { clearInterval(proxyInterval); }, 10000);
    }
}

const foxeyeProxy = new FoxeyeProxy();
export default foxeyeProxy;
