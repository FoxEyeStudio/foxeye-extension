import React, {useEffect, useState} from "react";
import webFavicon from '../../images/web_favicon.png'
import settingIcon from '../../images/ic_setting.png'
import detectionIcon from '../../images/ic_detection.png'
import arrowIcon from '../../images/ic_arrow.png'
import monitorIcon from '../../images/ic_monitor.png'
import '../../css/home.css'
import '../../css/common.css'
import {useNavigate} from "react-router-dom";
import titleLogo from "../../images/title_logo.png";
import aboutIcon from "../../images/ic_about.png";
import aboutHoverIcon from "../../images/ic_about_hover.png";
import riskCenter from "../../background/RiskCenter";

function Home() {
    const navigate = useNavigate()
    const [account, setAccount] = useState();
    const [domain, setDomain] = useState();
    const [lowRisk, setLowRisk] = useState(true);
    const [favIconUrl, setFavIconUrl] = useState();

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
            <div className="account-wrap flex-col justify-center">
                {!!account ? (
                    <div className="flex-col justify-between align-center">
                        <span className="address-text">{account.substring(0, 6) + '...' + account.substring(account.length-4)}</span>
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

            <div className="current-website">Current&nbsp;Website</div>
            <div className="web-info-wrap flex-row justify-between align-center">
                <div className="flex-row align-center">
                    <img src={favIconUrl || webFavicon} className='web-favicon'/>
                    <div className="web-host-info flex-col justify-between">
                        <div className="host-text">{domain}</div>
                        <div className="website-name">{lowRisk ? 'No threat detected' : 'Malicious website'}</div>
                    </div>
                </div>
                <div className="security_wrap flex-col" style={{backgroundColor: lowRisk ? '#06A130' : '#D73A4A'}}>
                    <div className="security-text">{lowRisk ? 'Low Risk' : 'High Risk'}</div>
                </div>
            </div>
            <div className="line flex-col"></div>
            <div className="token-detection-wrap flex-col" onClick={()=>{navigate('/detection')}}>
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
            <div className="setting-wrap flex-col" onClick={openSetting}>
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
