import React from "react";
import ReactDOM from 'react-dom/client';
import AlertView from './AlertView'
import {postMessage} from "../proxy/ProxyMessage";

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
			this.injectCss(chrome.runtime.getURL('/css/foxeye-chrome-extension-content.css'), 'head')
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
				chrome.runtime.sendMessage(e.data, function (res) {
					const backMsg = {foxeye_extension_action: 'foxeye_parse_transaction', ...res};
					postMessage(backMsg)
					if (backMsg.type !== 0) {
						theThis.showContainer();
						containerRoot.render(<AlertView />);
					}
				});
			}
		});
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
		this.container.setAttribute('style', 'display: none');
	}
}

const content = new Content();
export default content;
