import React, {useEffect, useState} from "react";
import webFavicon from '../../images/web_favicon.png'
import settingIcon from '../../images/ic_setting.png'
import detectionIcon from '../../images/ic_detection.png'
import approvalListIcon from '../../images/ic_approval_list.png'
import arrowIcon from '../../images/ic_arrow.png'
import monitorIcon from '../../images/ic_monitor.png'
import '../../css/home.css'
import '../../css/common.css'
import {useNavigate} from "react-router-dom";
import titleLogo from "../../images/title_logo.png";
import aboutIcon from "../../images/ic_about.png";
import aboutHoverIcon from "../../images/ic_about_hover.png";
import ic_connected from '../../images/ic_connected.png'
import ic_inactive from '../../images/ic_inactive.png'
import ic_web_danger from '../../images/ic_web_danger.png'
import ic_web_safe from '../../images/ic_web_safe.png'
import ic_security from '../../images/ic_security.png'
import riskCenter from "../../background/RiskCenter";
import {STORAGE_INTERCEPTED_AMOUNT} from "../../common/utils";

function Home() {
    const navigate = useNavigate()
    const [account, setAccount] = useState();
    const [domain, setDomain] = useState();
    const [lowRisk, setLowRisk] = useState(true);
    const [favIconUrl, setFavIconUrl] = useState();
    const [interceptedAmount, setInterceptedAmount] = useState(0);

    useEffect(() => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            const tab = tabs[0];
            chrome.tabs.sendMessage(tab.id, {foxeye_extension_action: "foxeye_wallet_request_account"}, undefined); //send to content.js

            const url = new URL(tab.url);
            const domain = riskCenter.getDomain(url)
            // const domain = url.hostname;
            setDomain(domain);

            setFavIconUrl(tab.favIconUrl);

            chrome.runtime.sendMessage({foxeye_extension_action: "foxeye_phishing_website", url}, result => {
                if (result.type != 0) {
                    setLowRisk(false);
                }
            });  //send to background.js
        });


        chrome.runtime.onMessage.addListener(function getAccount(request) {
            if (request.foxeye_extension_action === 'foxeye_wallet_return_account') {
                const { account } = request;
                setAccount(account);
                chrome.runtime.onMessage.removeListener(getAccount);
            }
            return false;
        });

        chrome.storage.local.get(STORAGE_INTERCEPTED_AMOUNT, function (result) {
            if (result && result[STORAGE_INTERCEPTED_AMOUNT]) {
                const interceptedAmount = result[STORAGE_INTERCEPTED_AMOUNT];
                setInterceptedAmount(interceptedAmount);
            }
        });
    }, []);

    const openSetting = () => {
        navigate('/setting')
    }


    return (
        <div className='flex-col'>
            <div className='title-wrap'>
                <img src={titleLogo} className='title-logo' />
                <div style={{ '--ic-about-normal': 'url(' + aboutIcon + ')', '--ic-about-hover': 'url(' + aboutHoverIcon + ')'}} className='title-about' onClick={()=>{navigate('/about', {state: {from: 'home'}})}}/>
            </div>
            <div className='home-top-wrap'>
                <div className='intercepted-wrap'>
                    <div className='intercepted-amount'>
                        {interceptedAmount}
                    </div>
                    <div className='intercepted-desc'>
                        threats intercepted for you
                    </div>
                </div>
                {!!account ? (
                    <div className='state-wrap'>
                        <img src={ic_connected} className='state-icon'/>
                        <div className='state-title'>
                            Account
                        </div>
                        <div className='flex-full'/>
                        <div className='state-desc'>
                            {account.substring(0, 6) + '...' + account.substring(account.length-4)}
                        </div>
                    </div>
                ) : (
                    <div className='state-wrap'>
                        <img src={ic_inactive} className='state-icon'/>
                        <div className='state-title'>
                            Account
                        </div>
                        <div className='flex-full'/>
                        <div className='state-desc'>
                            Wallet is Inactive
                        </div>
                    </div>
                )}
                <div className='state-wrap'>
                    <img src={favIconUrl || webFavicon} className='state-icon'/>
                    <div className='state-title'>
                        {domain}
                    </div>
                    <div className='flex-full'/>
                    <img className='state-web-security' src={lowRisk ? ic_web_safe : ic_web_danger}/>
                    <div className='state-desc'>
                        {lowRisk ? 'No threat detected' : 'Malicious website'}
                    </div>
                </div>
                <div className='state-wrap'>
                    <img src={ic_security} className='state-icon'/>
                    <div className='state-title'>
                        Safe Library
                    </div>
                    <div className='flex-full'/>
                    <div className='state-synced'>
                        Synced at 22:30
                    </div>
                </div>
                <div className='security-check-wrap'>
                    <div className='security-check-item'>
                        <div className='security-check-item-amount'>
                            11,624
                        </div>
                        <div className='security-check-item-desc'>
                            Tokens
                        </div>
                    </div>
                    <div className='security-check-item-line'/>
                    <div className='security-check-item'>
                        <div className='security-check-item-amount'>
                            145,423
                        </div>
                        <div className='security-check-item-desc'>
                            Phishing
                        </div>
                    </div>
                    <div className='security-check-item-line'/>
                    <div className='security-check-item'>
                        <div className='security-check-item-amount'>
                            43,927
                        </div>
                        <div className='security-check-item-desc'>
                            Contracts
                        </div>
                    </div>
                </div>
            </div>
            <div className="token-detection-wrap flex-col" onClick={()=>{navigate('/approval')}}>
                <div className="token-detection-inter flex-row align-center">
                    <img src={approvalListIcon} className='detection-img'/>
                    <div className="item-wrapper flex-col justify-between">
                        <div className="home-item-title">Approval List</div>
                        <div className="home-item-desc">Manage approval regularly</div>
                    </div>
                    <div className={'flex-full'}/>
                    <img src={arrowIcon} className={'arrow-img'}/>
                </div>
            </div>
            <div className="setting-wrap flex-col" onClick={()=>{navigate('/detection')}}>
                <div className="token-detection-inter flex-row align-center">
                    <img src={detectionIcon} className='detection-img'/>
                    <div className="item-wrapper flex-col justify-between">
                        <div className="home-item-title">Token Detection</div>
                        <div className="home-item-desc">Have a check before buying</div>
                    </div>
                    <div className={'flex-full'}/>
                    <img src={arrowIcon} className={'arrow-img'}/>
                </div>
            </div>
            <div className="setting-wrap flex-col" onClick={() => {navigate('/setting')}}>
                <div className="token-detection-inter flex-row align-center">
                    <img src={settingIcon} className='detection-img'/>
                    <div className="item-wrapper flex-col justify-between">
                        <div className="home-item-title">Risk&nbsp;Alerts</div>
                        <div className="home-item-desc">3&nbsp;strategies&nbsp;on</div>
                    </div>
                    <div className={'flex-full'}/>
                    <img src={arrowIcon} className={'arrow-img'}/>
                </div>
            </div>
        </div>
    )
}

export default Home;
