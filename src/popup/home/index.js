import React, {useState} from "react";
import webFavicon from '../../../public/images/web_favicon.png'
import settingIcon from '../../../public/images/ic_setting.png'
import detectionIcon from '../../../public/images/ic_detection.png'
import arrowIcon from '../../../public/images/ic_arrow.png'
import monitorIcon from '../../../public/images/ic_monitor.png'
import '../../css/home.css'
import '../../css/common.css'
import {useNavigate} from "react-router-dom";

function Home() {
    const navigate = useNavigate()
    const [monitoring, setMonitoring] = useState(false);

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
        <div className='flex-col'>
            <div className="account-wrap flex-col justify-center">
                {monitoring ? (
                    <div className="flex-col justify-between align-center">
                        <span className="address-text">0x4578…1231</span>
                        <div className="monitor-bg flex-row justify-center align-center">
                            <img
                                className="monitor-img"
                                src={monitorIcon}
                            />
                            <span className="monitor-text">Monitoring</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex-col justify-between">
                        <div className="wallet-inactive-text">Wallet&nbsp;Inactive</div>
                        <div className="wallet-inactive_desc">When&nbsp;Connected&nbsp;to&nbsp;website,FoxEye&nbsp;will&nbsp;
                            <br/>monitor&nbsp;malicious&nbsp;behaviour.</div>
                    </div>
                )}
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
                    <div className="security-text">Low&nbsp;Risk</div>
                </div>
            </div>
            <div class="line flex-col"></div>
            <div class="token-detection-wrap flex-col" onClick={()=>{navigate('/detection')}}>
                <div class="token-detection-inter flex-row align-center">
                    <img src={detectionIcon} className='detection-img'/>
                    <div class="item-wrapper flex-col justify-between">
                        <div class="item-title">Token&nbsp;Detection</div>
                        <div class="item-desc">Have&nbsp;a&nbsp;check&nbsp;before&nbsp;buying</div>
                    </div>
                    <div className={'flex-full'}/>
                    <img src={arrowIcon} className={'arrow-img'}/>
                </div>
            </div>
            <div class="setting-wrap flex-col" onClick={()=>{navigate('/setting')}}>
                <div className="token-detection-inter flex-row align-center">
                    <img src={settingIcon} className='detection-img'/>
                    <div className="item-wrapper flex-col justify-between">
                        <div className="item-title">Risk&nbsp;Alerts</div>
                        <div className="item-desc">3&nbsp;strategies&nbsp;on</div>
                    </div>
                    <div className={'flex-full'}/>
                    <img src={arrowIcon} className={'arrow-img'}/>
                </div>
            </div>
        </div>
    )
}

export default Home;
