import React from "react";
// import '../css/content.css'
import ReactDOM from 'react-dom/client';
import AlertView from './AlertView'

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
		const containerRoot = ReactDOM.createRoot(this.container)
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.action === 'clickContent') {
				this.showContainer();
				containerRoot.render(<AlertView />);
			}
			sendResponse({status: "true"})
			return true;
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
