import React from "react";;

function injectScript(file, node) {
  const tagNode = document.getElementsByTagName(node)[0];
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file);
  tagNode.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
  injectScript(chrome.runtime.getURL('foxeyeProxy.js'), 'body');
});

function Content() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'clickContent') {
      injectContent();
    }
    sendResponse({status: "true"});
    return true;
  });

  return (
    <div style={{width: 200, height: 300, backgroundColor: 'red', position: 'fixed', zIndex: 9999, top: 100, left: 100,}}>
      Foxexy Content
    </div>
  )
}

// const container = document.createElement('div')
// container.id = 'foxeye-container'
// document.body.appendChild(container)
// const root = ReactDOM.createRoot(container)
// root.render(<Content />)
