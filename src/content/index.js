import React from "react";
import ReactDOM from 'react-dom/client';
import AlertView from './AlertView'
import {listenMessage, postMessage} from "../proxy/ProxyMessage";
import riskCenter, {RiskType_PhishingWebsite} from "../background/RiskCenter";

class Content {
	constructor() {
		this.container = null;
		this.init();
	}

	init() {
		document.addEventListener('DOMContentLoaded', () => {
			this.initContainer();
			this.initListener();
			this.injectScript(chrome.runtime.getURL('foxeyeProxy.js'), 'body');
			this.injectCss(chrome.runtime.getURL('/css/foxeye-chrome-extension-content.css'), 'head');
		});
	}

	injectScript(file, node) {
		const tagNode = document.getElementsByTagName(node)[0];
		const script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', file);
		tagNode.appendChild(script);
	}

	injectCss(file, node) {
		const tagNode = document.getElementsByTagName(node)[0];
		const script = document.createElement('link');
		script.setAttribute('type', 'text/css');
		script.setAttribute('rel', 'stylesheet');
		script.setAttribute('href', file);
		tagNode.appendChild(script);
	}

	initListener() {
		const theThis = this;
		const containerRoot = ReactDOM.createRoot(this.container)

		window.addEventListener('message', async (e) => { // 监听 message 事件
			if (e.origin !== window.location.origin) { // 验证消息来源地址
				return;
			}
			if (typeof e.data.foxeye_extension_action === 'undefined') {
				return;
			}
			if (e.data.foxeye_extension_action === 'foxeye_sendTransaction') {
				theThis.showContainer();
				containerRoot.render(<AlertView toast />);
				chrome.runtime.sendMessage(e.data, function (res) {
					const backMsg = {foxeye_extension_action: 'foxeye_parse_transaction', ...res};
					postMessage(backMsg)
					if (backMsg.type !== 0) {
						theThis.showContainer();
						containerRoot.render(<AlertView info={backMsg} hideContainer={theThis.hideContainer}/>);
					} else {
						theThis.hideContainer();
					}
				});
			} else if (e.data.foxeye_extension_action === 'foxeye_phishing_website') {
				chrome.runtime.sendMessage(e.data, async res => {
					// res.type = RiskType_PhishingWebsite;
					if (res.type != 0) {
						const domain = riskCenter.getDomain(window.location.href);
						const _domain = riskCenter.getDomain(res.url);
						if (domain == _domain) {
							theThis.showContainer();
							containerRoot.render(<AlertView info={res} hideContainer={theThis.hideContainer}/>);
							const callback = await listenMessage('foxeye_alert_callback')
							if (callback.action === 'abort') {
								chrome.runtime.sendMessage({
									foxeye_extension_action: 'foxeye_close_activetab'
								});
							}
						}
					}
				});
			}
		});

		chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
			if (request.foxeye_extension_action === 'foxeye_wallet_request_account') {
				postMessage({foxeye_extension_action: 'foxeye_wallet_request_account'});
				const result = await listenMessage('foxeye_wallet_return_account')
				chrome.runtime.sendMessage(result, null);
			}
			return true;
		});

		if (window.self == window.top) {
			postMessage({foxeye_extension_action: 'foxeye_phishing_website', url: window.location.href});
		}
	}

	initContainer() {
		const contentWrap = window.document.querySelector('#foxeye-chrome-extension-content-wrap');
		if (contentWrap) {
			this.container = contentWrap;
		} else {
			this.container = window.document.createElement('div');
			this.container.setAttribute('id', 'foxeye-chrome-extension-content-wrap');
			window.document.body.appendChild(this.container);
		}
	}

	showContainer() {
		this.container.setAttribute('style', 'display: block');
	}

	hideContainer() {
		const contentWrap = window.document.querySelector('#foxeye-chrome-extension-content-wrap');
		if (contentWrap) {
			contentWrap.setAttribute('style', 'display: none');
		}
	}
}

const content = new Content();
export default content;
