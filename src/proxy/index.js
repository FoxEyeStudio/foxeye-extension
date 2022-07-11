import React from 'react';
const dictionary = {
    '0x095ea7b3': 'approve'
};

class FoxeyeProxy {
    constructor() {
        this.initProxy();
    }

    parseProxy(contract) {
        const notableActionList = ['approve'];
        console.log('@cyh: contract = ', contract);
        if (typeof contract.method !== 'undefined') {
            if (contract.method === 'eth_sendTransaction') {
                if (contract.params[0].data) {
                    const methodName = dictionary[contract.params[0].data.substring(0, 10)];
                    if (notableActionList.includes(methodName)) {
                        return { result: true, action: methodName };
                    }
                }

            }
        }
        return { result: false };
    }

    initProxy() {
        const proxyThis = this;
        const proxyHandler = {
            async apply(target, thisArg, argArray) {
                const contract = [...argArray][0];
                const result = proxyThis.parseProxy(contract).result;
                const actionName = proxyThis.parseProxy(contract).action;
                return target(...argArray);
            }
        };

        const proxyInterval = setInterval(insertProxy(), 1000);
        function insertProxy() {
            if (typeof window.ethereum !== 'undefined') {
                console.log('@cyh: window.ethereum = ', window.ethereum);
                const proxy = new Proxy(window.ethereum.request, proxyHandler);
                window.ethereum.request = proxy;
                clearInterval(proxyInterval);
            } else {
                console.log('@cyh: No Found window.ethereum');
            }
        }
        setTimeout(() => { clearInterval(proxyInterval); }, 10000);
    }
}

const foxeyeProxy = new FoxeyeProxy();
export default foxeyeProxy;
