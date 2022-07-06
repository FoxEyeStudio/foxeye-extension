import React from "react";
import ReactDOM from "react-dom/client";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clickContent') {
    injectContent();
  }
  sendResponse({status: "true"});
  return true;
});

function injectContent() {
  const content = (
      <div style={{width: 200, height: 300, backgroundColor: 'red', position: 'fixed', zIndex: 9999, top: 100, left: 100,}}>
        Foxexy Content
      </div>
  );

  const container = document.createElement('div')
  container.id = 'foxeye-container'
  document.body.appendChild(container)

  const root = ReactDOM.createRoot(container);
  root.render(content)
}


