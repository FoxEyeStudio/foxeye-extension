import React from "react";
import titleLogo from '../../public/images/title_logo.png';
import icDoubt from '../../public/images/ic_doubt.png'
import webFavicon from '../../public/images/web_favicon.png'
import '../css/popup.css'
import '../css/common.css'

function Popup() {
    const clickContent = () => {
      // chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      //     chrome.tabs.sendMessage(tabs[0].id, {action: "clickContent"}, function(response) {
      //     });
      // });
      console.log('====window.ethereum = ', window.ethereum);
    }


    const clickBackground = () => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "clickBackground"}, function(response) {

            });
        });
    }

    return (
        <div className='popup-body'>
            <div className='title-wrap'>
                <img src={titleLogo} className='title-logo' />
                <img src={icDoubt} className='title-doubt'/>
            </div>
            <div className="account-wrap flex-col justify-center">
                <div className="flex-col justify-between">
                    <div className="wallet-inactive-text">Wallet&nbsp;Inactive</div>
                    <div className="wallet-inactive_desc">When&nbsp;Connected&nbsp;to&nbsp;website,FoxEye&nbsp;will&nbsp;
                        <br/>monitor&nbsp;malicious&nbsp;behaviour.</div>
                </div>
            </div>

            <div class="current-website">Current&nbsp;Website</div>
            <div class="web-info-wrap flex-row justify-between">
                <div class="flex-row align-center">
                    <img src={webFavicon} className='web-favicon'/>
                    <div class="web-host-info flex-col justify-between">
                        <div class="host-text">etherscan.io</div>
                        <div class="website-name">Malicious&nbsp;website</div>
                    </div>
                </div>
                <div className="security_wrap flex-col">
                    <div className="text_10">Low&nbsp;Risk</div>
                </div>
            </div>
            <div class="line flex-col"></div>
            <div class="block_6 flex-col">
                <div class="box_6 flex-row">
                    <div class="group_13 flex-col">
                        <div class="group_14 flex-col"></div>
                        <div class="group_15 flex-col"></div>
                    </div>
                    <div class="text-wrapper_4 flex-col justify-between">
                        <div class="text_6">Token&nbsp;Detection</div>
                        <div class="text_7"
                        >Have&nbsp;a&nbsp;check&nbsp;before&nbsp;buying</div
                        >
                    </div>
                    <div class="group_16 flex-col">
                        <div class="box_11 flex-col"></div>
                    </div>
                </div>
            </div>
            <div class="block_7 flex-col">
                <div class="section_3 flex-row">
                    <div class="group_17 flex-col">
                        <div class="box_12 flex-col">
                            <div class="box_13 flex-col"></div>
                        </div>
                    </div>
                    <div class="text-wrapper_5 flex-col justify-between">
                        <div class="text_8">Risk&nbsp;Alerts</div>
                        <div class="text_9">3&nbsp;strategies&nbsp;on</div>
                    </div>
                    <div class="group_18 flex-col">
                        <div class="box_14 flex-col"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Popup;
