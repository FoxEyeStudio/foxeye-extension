import React from "react";
function Popup() {
    const clickContent = () => {
      // chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      //     chrome.tabs.sendMessage(tabs[0].id, {action: "clickContent"}, function(response) {
      //     });
      // });
      console.log('====window.ethereum = ', window.ethereum);
    }

  const clickBackground = () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: "clickBackground"}, function(response) {
      });
    });
  }

  return (
      <div style={{width: 200, height: 300}}>
          <h1>Foxexy Pop</h1>
          <button style={{marginTop: 50}} onClick={clickContent}>click Content</button>
          <button style={{marginTop: 50}} onClick={clickBackground}>click Background</button>
      </div>
  )
}

export default Popup
