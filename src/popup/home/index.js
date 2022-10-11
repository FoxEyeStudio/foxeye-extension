import React, {useEffect, useState} from "react";
import webFavicon from '../../images/web_favicon.png'
import settingIcon from '../../images/ic_setting.png'
import detectionIcon from '../../images/ic_detection.png'
import approvalListIcon from '../../images/ic_approval_list.png'
import arrowIcon from '../../images/ic_arrow.png'
import '../../css/home.css'
import '../../css/common.css'
import {useNavigate} from "react-router-dom";
import titleLogo from "../../images/title_logo.png";
import aboutIcon from "../../images/ic_about.png";
import aboutHoverIcon from "../../images/ic_about_hover.png";
import earnIcon from "../../images/ic_earn.png";
import earnHoverIcon from "../../images/ic_earn_hover.png";
import ic_connected from '../../images/ic_connected.png'
import ic_inactive from '../../images/ic_inactive.png'
import ic_address_enter from '../../images/ic_address_enter.png'
import ic_web_danger from '../../images/ic_web_danger.png'
import ic_web_safe from '../../images/ic_web_safe.png'
import ic_security from '../../images/ic_security.png'
import imgAdAirdrop from '../../images/img_ad_airdrop.png'
import imgAdTag from '../../images/img_ad_tag.png'
import riskCenter from "../../background/RiskCenter";
import {
    iLocal,
    STORAGE_INTERCEPTED_AMOUNT,
    STORAGE_RECENT_ACCOUTS,
    STORAGE_SECURITY_STATISTIC_AMOUNT, STORAGE_SELECTED_ACCOUT
} from "../../common/utils";
import BannerView from "../../common/BannerView";

function Home() {
    const navigate = useNavigate()
    const [account, setAccount] = useState();
    const [domain, setDomain] = useState();
    const [lowRisk, setLowRisk] = useState(true);
    const [favIconUrl, setFavIconUrl] = useState();
    const [interceptedAmount, setInterceptedAmount] = useState(0);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [phishingAmount, setPhishingAmount] = useState(0);
    const [contractAmount, setContractAmount] = useState(0);
    const [syncTime, setSyncTime] = useState();
    const [recentAccount, setRecentAccount] = useState();
    const [adList, setAdList] = useState(undefined);

    useEffect(() => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            updateAccount(undefined);
            const tab = tabs[0];
            const url = new URL(tab.url);
            const domain = riskCenter.getDomain(url)
            if (url.protocol !== 'chrome:') {
                chrome.tabs.sendMessage(tab.id, {foxeye_extension_action: "foxeye_wallet_request_account"}, undefined); //send to content.js
            }
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
                updateAccount(account);
            }
            return false;
        });

        chrome.storage.local.get(STORAGE_INTERCEPTED_AMOUNT, function (result) {
            if (result && result[STORAGE_INTERCEPTED_AMOUNT]) {
                const interceptedAmount = result[STORAGE_INTERCEPTED_AMOUNT];
                setInterceptedAmount(interceptedAmount);
                document.getElementById("threats_intercepted_id").innerHTML = iLocal("threats_intercepted", [interceptedAmount.toString().fontcolor("#027DD5")]);
            }
        });

        chrome.storage.local.get(STORAGE_SECURITY_STATISTIC_AMOUNT, function (result) {
            if (result && result[STORAGE_SECURITY_STATISTIC_AMOUNT]) {
                const content = result[STORAGE_SECURITY_STATISTIC_AMOUNT];
                setTokenAmount(formatNumber(content['TOKEN']));
                setPhishingAmount(formatNumber(content['WEBSITE']));
                setContractAmount(formatNumber(content['DAPP']));
                setSyncTime(content['time']);
            }
        });

        chrome.runtime.sendMessage({foxeye_extension_action: "foxeye_security_statistic"}, result => {
            if(result) {
                setTokenAmount(formatNumber(result['TOKEN']));
                setPhishingAmount(formatNumber(result['WEBSITE']));
                setContractAmount(formatNumber(result['DAPP']));
                const d = new Date();
                const date = new Date()
                const time = dateFormat("HH:MM", date);
                result['time'] = time;
                setSyncTime(time);
                chrome.storage.local.set({ [STORAGE_SECURITY_STATISTIC_AMOUNT]: result });
            }
        });

        chrome.runtime.sendMessage({foxeye_extension_action: "foxeye_get_banner_ad_config"}, result => {
            if(result && result.banners && result.banners.length > 0) {
                setAdList(result.banners);
            } else {
                setAdList([]);
            }
        });

        document.getElementById("threats_intercepted_id").innerHTML = iLocal("threats_intercepted", [interceptedAmount.toString().fontcolor("#027DD5")]);
    }, []);

    const updateAccount = account => {
        chrome.storage.local.get(STORAGE_RECENT_ACCOUTS, function (result) {
            let accountData;
            if (result && result[STORAGE_RECENT_ACCOUTS]) {
                accountData = result[STORAGE_RECENT_ACCOUTS];
            }
            if (account) {
                if (accountData) {
                    const accountlist = accountData.split(',');
                    if (accountlist[accountlist.length - 1] != account) {
                        accountData += ',' + account;
                        chrome.storage.local.set({ [STORAGE_RECENT_ACCOUTS]: accountData });
                    }
                } else {
                    chrome.storage.local.set({ [STORAGE_RECENT_ACCOUTS]: account });
                }
                chrome.storage.local.set({ [STORAGE_SELECTED_ACCOUT]: account });
            } else if (accountData) {
                chrome.storage.local.get(STORAGE_SELECTED_ACCOUT, function (selResult) {
                    if (selResult && selResult[STORAGE_SELECTED_ACCOUT]) {
                        setRecentAccount(selResult[STORAGE_SELECTED_ACCOUT]);
                    } else {
                        const accountlist = accountData.split(',');
                        if (accountlist && accountlist.length > 0) {
                            setRecentAccount(accountlist[accountlist.length - 1]);
                        }
                    }
                })
            }
        });
    }

    const formatNumber = num => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    const dateFormat = (fmt, date) => {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),
            "m+": (date.getMonth() + 1).toString(),
            "d+": date.getDate().toString(),
            "H+": date.getHours().toString(),
            "M+": date.getMinutes().toString(),
            "S+": date.getSeconds().toString()
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }

    const goEarn = () => {
        navigate('/earn', {state: { account: account || recentAccount}});
    }

    return (
        <div className='flex-col'>
            <div className='title-wrap'>
                <img src={titleLogo} className='title-logo' />
                <div className='flex-row'>
                    <div style={{ '--ic-about-normal': 'url(' + earnIcon + ')', '--ic-about-hover': 'url(' + earnHoverIcon + ')'}} className='title-about' onClick={goEarn}/>
                    <div style={{ '--ic-about-normal': 'url(' + aboutIcon + ')', '--ic-about-hover': 'url(' + aboutHoverIcon + ')'}} className='title-about' onClick={()=>{navigate('/about', {state: {from: 'home'}})}}/>
                </div>
            </div>
            <div className='home-top-wrap'>
                <div className='intercepted-and-account-wrap'>
                    <div className='intercepted-wrap'>
                        <div className='intercepted-desc' id='threats_intercepted_id'>
                        </div>
                    </div>
                    {!!account ? (
                        <div className='account-wrap'>
                            <img src={ic_connected} className='account-icon'/>
                            <div className='state-desc'>
                                {account.substring(0, 6) + '...' + account.substring(account.length-4)}
                            </div>
                        </div>
                    ) : !!recentAccount ? (
                        <div className='account-wrap-edit' onClick={()=>{navigate('/account')}}>
                            <img src={ic_inactive} className='account-icon'/>
                            <div className='state-desc'>
                                {recentAccount.substring(0, 6) + '...' + recentAccount.substring(recentAccount.length-4)}
                            </div>
                            <img src={ic_address_enter} style={{ marginLeft: 6 }} className='account-icon'/>
                        </div>
                    ) : (
                        <div className='account-wrap'>
                            <img src={ic_inactive} className='account-icon'/>
                            <div className='state-desc'>
                                {iLocal('Wallet_is_Inactive')}
                            </div>
                        </div>
                    )}
                </div>

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
                        {iLocal('Safe_Library')}
                    </div>
                    <div className='flex-full'/>
                    {syncTime && (
                        <div className='state-synced'>
                            {iLocal('Synced_at', [syncTime])}
                        </div>
                    )}
                </div>
                <div className='security-check-wrap'>
                    <div className='security-check-item'>
                        <div className='security-check-item-amount'>
                            {tokenAmount}
                        </div>
                        <div className='security-check-item-desc'>
                            Tokens
                        </div>
                    </div>
                    <div className='security-check-item-line'/>
                    <div className='security-check-item'>
                        <div className='security-check-item-amount'>
                            {phishingAmount}
                        </div>
                        <div className='security-check-item-desc'>
                            {iLocal('Phishing')}
                        </div>
                    </div>
                    <div className='security-check-item-line'/>
                    <div className='security-check-item'>
                        <div className='security-check-item-amount'>
                            {contractAmount}
                        </div>
                        <div className='security-check-item-desc'>
                            Contracts
                        </div>
                    </div>
                </div>
            </div>
            <div className="token-detection-wrap flex-col" onClick={()=>{navigate('/approval', { state: { account: account || recentAccount }})}}>
                <div className="token-detection-inter flex-row align-center">
                    <img src={approvalListIcon} className='detection-img'/>
                    <div className="item-wrapper flex-col justify-between">
                        <div className="home-item-title">{iLocal('Approval_List')}</div>
                        <div className="home-item-desc">{iLocal('Manage_approval_regularly')}</div>
                    </div>
                    <div className={'flex-full'}/>
                    <img src={arrowIcon} className={'arrow-img'}/>
                </div>
            </div>
            <div className="setting-wrap flex-col" onClick={()=>{navigate('/detection', { state: { account: account || recentAccount }})}}>
                <div className="token-detection-inter flex-row align-center">
                    <img src={detectionIcon} className='detection-img'/>
                    <div className="item-wrapper flex-col justify-between">
                        <div className="home-item-title">{iLocal('Token_Detection')}</div>
                        <div className="home-item-desc">{iLocal('Have_a_check')}</div>
                    </div>
                    <div className={'flex-full'}/>
                    <img src={arrowIcon} className={'arrow-img'}/>
                </div>
            </div>
            <div className="setting-wrap flex-col" onClick={() => {navigate('/setting')}}>
                <div className="token-detection-inter flex-row align-center">
                    <img src={settingIcon} className='detection-img'/>
                    <div className="item-wrapper flex-col justify-between">
                        <div className="home-item-title">{iLocal('Risk_Alerts')}</div>
                        <div className="home-item-desc">{iLocal('five_strategies_on')}</div>
                    </div>
                    <div className={'flex-full'}/>
                    <img src={arrowIcon} className={'arrow-img'}/>
                </div>
            </div>
            <div className='ad-airdrop-wrap'>
                {adList?.length <= 0 && <img src={imgAdAirdrop} className='ad-airdrop' onClick={goEarn}/>}
                {adList?.length > 0 && (
                    <div style={{ width: 325, height: 80}}>
                        <BannerView adList={adList}/>
                    </div>
                )}
                {adList?.length > 0 && <img src={imgAdTag} className='ad-tag'/>}
            </div>
        </div>
    )
}

export default Home;
