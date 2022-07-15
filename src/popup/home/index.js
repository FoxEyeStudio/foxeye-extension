import React, {useEffect, useState} from "react";
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
    const [account, setAccount] = useState();
    const [domain, setDomain] = useState();

    useEffect(() => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {foxeye_extension_action: "foxeye_wallet_request_account"}, null);
        });

        chrome.runtime.onMessage.addListener(function getAccount(request) {
            chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
                if (request.foxeye_extension_action === 'foxeye_wallet_return_account') {
                    const { account } = request;
                    setAccount(account);
                    chrome.runtime.onMessage.removeListener(getAccount);
                }
            })
            return true;
        });

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tab = tabs[0];
            const url = new URL(tab.url);
            const domain = url.hostname;
            setDomain(domain);
        })
    }, []);

    const openSetting = () => {
        navigate('/setting')
        // chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        //     const tt = Math.ceil(Math.random()*7);
        //     chrome.tabs.sendMessage(tabs[0].id, {foxeye_extension_action: 'foxeye_parse_transaction', type: 4, address: '0x0dfb7137bc64b63f7a0de7cb9cda178702666220', symbol: 'ssskk'}, function(response) {
        //         console.log('====res = ', response);
        //     });
        // });
    }


    return (
        <div className='flex-col'>
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
            <div className="web-info-wrap flex-row justify-between">
                <div className="flex-row align-center">
                    <img src={webFavicon} className='web-favicon'/>
                    <div className="web-host-info flex-col justify-between">
                        <div className="host-text">{domain}</div>
                        <div className="website-name">No threat detected</div>
                    </div>
                </div>
                <div className="security_wrap flex-col">
                    <div className="security-text">Low&nbsp;Risk</div>
                </div>
            </div>
            <div className="line flex-col"></div>
            <div className="token-detection-wrap flex-col" onClick={()=>{navigate('/detection')}}>
                <div className="token-detection-inter flex-row align-center">
                    <img src={detectionIcon} className='detection-img'/>
                    <div className="item-wrapper flex-col justify-between">
                        <div className="item-title">Token&nbsp;Detection</div>
                        <div className="item-desc">Have&nbsp;a&nbsp;check&nbsp;before&nbsp;buying</div>
                    </div>
                    <div className={'flex-full'}/>
                    <img src={arrowIcon} className={'arrow-img'}/>
                </div>
            </div>
            <div className="setting-wrap flex-col" onClick={openSetting}>
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
