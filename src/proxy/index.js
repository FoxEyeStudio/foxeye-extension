import React from 'react';
import {listenMessage, postMessage} from "./ProxyMessage";

const tag = 'FoxeyeProxy: ';

class FoxeyeProxy {
    constructor() {
        this.initProxy();
        this.initListener();
    }

    initListener() {
        window.addEventListener('message', async (e) => { // 监听 message 事件
            if (e.origin !== window.location.origin) { // 验证消息来源地址
                return;
            }
            if (typeof e.data.foxeye_extension_action === 'undefined') {
                return;
            }
            if (e.data.foxeye_extension_action === 'foxeye_wallet_request_account') {
                if (window.ethereum) {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
                    if (accounts && accounts.length > 0) {
                        postMessage({foxeye_extension_action: 'foxeye_wallet_return_account', account: accounts[0]});
                        return;
                    }
                };
                postMessage({foxeye_extension_action: 'foxeye_wallet_return_account', account: null});
            }
        });
    }

    insertProxy() {
        if (window?.ethereum) {
            const proxy = new Proxy(window.ethereum.request, this.proxyHandler);
            window.ethereum.request = proxy;
            const proxy2 = new Proxy(window.ethereum.sendAsync, this.proxyHandler);
            window.ethereum.sendAsync = proxy2;
            clearInterval(this.proxyInterval);
        } else {
            console.log(tag, '@cyh: No Found window.ethereum');
        }
    }

    // proxyInterval = setInterval(this.insertProxy(), 1000);

    initProxy() {
        // const proxyThis = this;
        this.proxyHandler = {
            async apply(target, thisArg, argArray) {
                const transaction = [...argArray][0];
                const { method } = transaction;
                if (method == 'eth_sendTransaction') {
                    postMessage({foxeye_extension_action: 'foxeye_sendTransaction', chainId: Number(window.ethereum.chainId).toString(), params: transaction.params[0]})
                    const result = await listenMessage('foxeye_parse_transaction')
                    if (result.type === 0) {
                        return target(...argArray);
                    } else {
                        const callback = await listenMessage('foxeye_alert_callback')
                        if (callback.action === 'continue') {
                            return target(...argArray);
                        } else {
                            return null;
                        }
                    }
                }
                return target(...argArray);
            }
        };
        this.proxyInterval = setInterval(this.insertProxy(), 1000);
        setTimeout(() => { clearInterval(this.proxyInterval); }, 10000);
    }
}

const foxeyeProxy = new FoxeyeProxy();
export default foxeyeProxy;
