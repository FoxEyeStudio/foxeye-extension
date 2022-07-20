import React from "react";
import ReactDOM from 'react-dom/client';
import AlertView from './AlertView'
import {listenMessage, postMessage} from "../proxy/ProxyMessage";
import riskCenter, {RiskType_PhishingWebsite} from "../background/RiskCenter";
import {MaliciousContract, PhishingWebsites, SWITCH_ALERT_ID, TargetCorrectness, TokenSafety} from "../common/utils";

let theThis;
class Content {
	constructor() {
		this.init();
	}

	init() {
		document.addEventListener('DOMContentLoaded', () => {
			this.initContainer();
			this.initListener();
			this.injectScript(chrome.runtime.getURL('/js/foxeyeProxy.js'), 'body');
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
		theThis = this;

		window.addEventListener('message', async (e) => { // 监听 message 事件
			if (e.origin !== window.location.origin) { // 验证消息来源地址
				return;
			}
			if (typeof e.data.foxeye_extension_action === 'undefined') {
				return;
			}
			if (e.data.foxeye_extension_action === 'foxeye_sendTransaction') {
				const switchInfo = await chrome.storage.local.get(SWITCH_ALERT_ID);
				let args = { }; // set malicious_contract_off, token_safety_off, target_correctness_off = 1 to turn oooooooof
				if (!!switchInfo) {
					if (switchInfo[MaliciousContract] === false) {
						args = { ...args, malicious_contract_off: 1}
					}
					if (switchInfo[TokenSafety] === false) {
						args = { ...args, token_safety_off: 1}
					}
					if (switchInfo[TargetCorrectness] === false) {
						args = { ...args, target_correctness_off: 1}
					}
				}
				const msg = { ...e.data, args}
				theThis.showContainer();
				theThis.getRoot().render(<AlertView toast />);
				chrome.runtime.sendMessage(msg, function (res) {
					const backMsg = {foxeye_extension_action: 'foxeye_parse_transaction', ...res};
					postMessage(backMsg)
					if (backMsg.type !== 0) {
						theThis.showContainer();
						theThis.getRoot().render(<AlertView info={backMsg} hideContainer={theThis.hideContainer}/>);
					} else {
						theThis.hideContainer();
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
			return false;
		});

		if (window.self == window.top) {
			chrome.storage.local.get(SWITCH_ALERT_ID, function(switchInfo){
				let args = { };
				if (!!switchInfo) {
					if (switchInfo[PhishingWebsites] === false) {
						args = { phishing_website_off: 1}
					}
				}
				if (!args.phishing_website_off) {
					chrome.runtime.sendMessage({foxeye_extension_action: 'foxeye_phishing_website', url: window.location.href, args}, async res => {
						// res.type = RiskType_PhishingWebsite;
						if (res.type != 0) {
							const domain = riskCenter.getDomain(window.location.href);
							const _domain = riskCenter.getDomain(res.url);
							if (domain == _domain) {
								theThis.showContainer();
								theThis.getRoot().render(<AlertView info={res} hideContainer={theThis.hideContainer}/>);
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
		}
	}

	initContainer() {
		if (window.self == window.top) {
			const contentWrap = window.document.querySelector('#foxeye-chrome-extension-content-wrap');
			if (contentWrap) {
				window.FoxEyeContainer = contentWrap;
			} else {
				window.FoxEyeContainer = window.document.createElement('div');
				window.FoxEyeContainer.setAttribute('id', 'foxeye-chrome-extension-content-wrap');
				window.document.body.appendChild(window.FoxEyeContainer);
			}
			window.FoxEyeRoot = ReactDOM.createRoot(window.FoxEyeContainer);
		}
	}

	getContainer() {
		let win = window;
		while (win.self != win.top) {
			win = win.top;
		}
		return win.FoxEyeContainer;
	}

	showContainer() {
		theThis.getContainer()?.setAttribute('style', 'display: block');
	}

	hideContainer() {
		theThis.getContainer()?.setAttribute('style', 'display: none');
	}

	getRoot() {
		let win = window;
		while (win.self != win.top) {
			win = win.top;
		}
		return win.FoxEyeRoot;
	}
}

const content = new Content();
export default content;
