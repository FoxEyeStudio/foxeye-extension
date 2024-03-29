import React from "react";
import ReactDOM from 'react-dom/client';
import AlertView from './AlertView'
import {listenMessage, postMessage} from "../proxy/ProxyMessage";
import riskCenter, {RiskType_ETHSIGN, Task_RiskAlert} from "../background/RiskCenter";
import {
	MaliciousContract,
	PhishingWebsites,
	SWITCH_ALERT_ID,
	TargetCorrectness,
	TokenSafety,
	ApproveReminder,
	EthSign,
	STORAGE_INTERCEPTED_AMOUNT,
	STORAGE_SELECTED_ACCOUT
} from "../common/utils";

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
			this.injectCss(chrome.runtime.getURL('/css/foxeye-chrome-extension-token.css'), 'head');
			this.saveAppVersioin();
		}, { once: true });
	}

	saveAppVersioin() {
		const url = chrome.runtime.getURL('manifest.json');
		const xhr = new XMLHttpRequest();
		xhr.onload = function() {
			const manifest = JSON.parse(xhr.response);
			const version = manifest.version;
			chrome.storage.local.set({ 'app_version': version });
		};
		xhr.open('GET', url, true);
		xhr.send();
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

	addInterceptedAccount = () => {
		chrome.storage.local.get(STORAGE_INTERCEPTED_AMOUNT, function (result) {
			let interceptedAmount = 0;
			if (result && result[STORAGE_INTERCEPTED_AMOUNT]) {
				interceptedAmount = result[STORAGE_INTERCEPTED_AMOUNT];
			}
			interceptedAmount += 1;
			chrome.storage.local.set({ [STORAGE_INTERCEPTED_AMOUNT]: interceptedAmount });
		});
	}

	initListener() {
		theThis = this;

		window.addEventListener('message', async (e) => { //add message event listener
			if (e.origin !== window.location.origin) {
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
					if (switchInfo[ApproveReminder] === false) {
						args = { ...args, approve_reminder_off: 1}
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
						theThis.addInterceptedAccount();
					} else {
						theThis.getRoot().render(<AlertView toast success/>);
						setTimeout(() => {
							theThis.hideContainer();
						}, 1500);
					}
				});
			} else if (e.data.foxeye_extension_action === 'foxeye_ethSign') {
				chrome.storage.local.get(SWITCH_ALERT_ID, function(switchInfo) {
					if (!!switchInfo) {
						if (switchInfo[EthSign] === false) {
							postMessage({foxeye_extension_action: 'foxeye_alert_callback', action: 'continue'});
						} else {
							theThis.showContainer();
							const backMsg = { type: RiskType_ETHSIGN }
							theThis.getRoot().render(<AlertView info={backMsg} hideContainer={theThis.hideContainer}/>);
							theThis.addInterceptedAccount();
							chrome.storage.local.get(STORAGE_SELECTED_ACCOUT, function (selResult) {
								let account;
								if (selResult && selResult[STORAGE_SELECTED_ACCOUT]) {
									account = selResult[STORAGE_SELECTED_ACCOUT];
								}
								chrome.runtime.sendMessage({foxeye_extension_action: 'foxeye_taskstat', content: e.data.params, type: Task_RiskAlert, account}, null);
							});
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
					chrome.storage.local.get(STORAGE_SELECTED_ACCOUT, function (selResult) {
						let account;
						if (selResult && selResult[STORAGE_SELECTED_ACCOUT]) {
							account = selResult[STORAGE_SELECTED_ACCOUT];
						}
						chrome.runtime.sendMessage({foxeye_extension_action: 'foxeye_phishing_website', url: window.location.href, args, account}, async res => {
							if (res.type != 0) {
								const domain = riskCenter.getDomain(window.location.href);
								const _domain = riskCenter.getDomain(res.url);
								if (domain == _domain) {
									theThis.addInterceptedAccount();
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
		// theThis.getContainer()?.setAttribute('style', 'display: none');
		theThis.getRoot().render(undefined);
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
