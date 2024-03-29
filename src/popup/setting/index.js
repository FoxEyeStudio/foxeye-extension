import React, {useEffect, useState} from "react";
import '../../css/common.css'
import '../../css/setting.css'
import titleLogo from "../../images/title_logo.png";
import aboutIcon from "../../images/ic_about.png";
import aboutHoverIcon from "../../images/ic_about_hover.png";
import {useNavigate} from "react-router-dom";
import backIcon from "../../images/ic_back.png";
import backHoverIcon from "../../images/ic_back_hover.png";
import {iLocal, SWITCH_ALERT_ID} from "../../common/utils";

function Setting() {
    const navigate = useNavigate()
    const [switchValue, setSwitchValue] = useState(undefined);

    const SETTING_ITEM_TITLE = [iLocal('Phishing_Websites'), iLocal('Malicious_Contract'), iLocal('Token_Safety'), iLocal('Target_Correctness'), iLocal('Approve_Reminder'), iLocal('Message_Signing')];
    const SETTING_ITEM_DESC = [iLocal('Detect_and_intercept'), iLocal('Show_alert'), iLocal('Check_token_security'), iLocal('Intercept_transactions'), iLocal('Alert_for_all'), iLocal('Intercept_malicious_signature')]

    useEffect(() => {
        chrome.storage.local.get(SWITCH_ALERT_ID, function(items){
            if (items) {
                setSwitchValue(items);
            }
        });
    }, [])

    function handleClick(id) {
        const checked = document.getElementById(id).checked;
        chrome.storage.local.set({ [id]: checked }, function(){
            //  Data's been saved boys and girls, go on home
        });
    }


    function getSettingItem(index) {
        return (
            <div className='flex-col'>
                <div className="setting-item flex-row justify-between">
                    <div className='setting-item-title'>{SETTING_ITEM_TITLE[index]}</div>
                    {switchValue && (
                        <div className='flex-row' >
                            <input type="checkbox" id={SWITCH_ALERT_ID[index]} defaultChecked={switchValue[SWITCH_ALERT_ID[index]] !== false} onClick={() => handleClick(SWITCH_ALERT_ID[index])}/>
                            <label htmlFor={SWITCH_ALERT_ID[index]}></label>
                        </div>
                    )}
                </div>
                <div className="setting-item-desc">{SETTING_ITEM_DESC[index]}</div>
            </div>
        );
    }

    return (
        <div className='flex-col' style={{height: '100%'}}>
            <div className='title-wrap'>
                <img src={titleLogo} className='title-logo' />
                <div style={{ '--ic-about-normal': 'url(' + aboutIcon + ')', '--ic-about-hover': 'url(' + aboutHoverIcon + ')'}} className='title-about' onClick={()=>{navigate('/about', {state: {from: 'setting'}})}}/>
            </div>
            <div className="token-detection-title flex-row align-center">
                <div className="back-img" style={{ '--ic-back-normal': 'url(' + backIcon + ')', '--ic-back-hover': 'url(' + backHoverIcon + ')'}} onClick={()=>{navigate('/home')}}/>
                <span className="detection-text">{iLocal('Settings')}</span>
            </div>
            <div className='flex-full'/>
            <span className="setting-risk-alert">{iLocal('Risk_Alerts')}</span>
            {getSettingItem(0)}
            <div className='flex-full'/>
            {getSettingItem(1)}
            <div className='flex-full'/>
            {getSettingItem(2)}
            <div className='flex-full'/>
            {getSettingItem(3)}
            <div className='flex-full'/>
            {getSettingItem(4)}
            <div className='flex-full'/>
            {getSettingItem(5)}
            <div className='flex-full'/>
            <div className='flex-full'/>
        </div>
    )
}

export default Setting;
