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
                const result = await RiskCenter.get().parseTransaction(Number(window.ethereum.chainId).toString(), transaction);
                console.log(tag, result);
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
