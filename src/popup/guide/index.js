import React, {useEffect, useState} from "react";
import '../../css/common.css'
import '../../css/guide.css'
import { useNavigate, useLocation } from "react-router-dom";
import aboutLogo from "../../images/img_about_logo.png"
import imgGuideBg from "../../images/img_guide_bg.png";
import imgGuideMonitor from "../../images/img_guide_monitor.png";
import icGuideBack from "../../images/ic_guide_back.png";
import icGuideBackHover from "../../images/ic_guide_back_hover.png";
import icEnterWhite from "../../images/ic_enter_white.png";
import icGuideApproval from "../../images/ic_guide_approval.png";
import icGuideMalicious from "../../images/ic_guide_malicious.png";
import icGuidePhishing from "../../images/ic_guide_phishing.png";
import icGuideReminder from "../../images/ic_guide_reminder.png";
import icGuideReport from "../../images/ic_guide_report.png";
import icGuideToken from "../../images/ic_guide_token.png";
import icGuideSafety from "../../images/ic_guide_safety.png";
import icGuideManage from "../../images/ic_guide_manage.png";
import icGuideIntercepts from "../../images/ic_guide_intercepts.png";
import icGuideFoxeye from "../../images/ic_guide_foxeye.png";
import {iLocal} from "../../common/utils";

function Guide() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [step, setStep] = useState(1);

    const stepOne = () => {
        return (
            <div className='flex-col align-center'>
                <div className='guide-step1-bg' style={{'--img-guide-bg': 'url(' + imgGuideBg + ')'}}>
                    <img src={aboutLogo} className='guide-step1-logo-img'/>
                    <div className='guide-step1-name'>
                        Metamask Protector
                    </div>
                </div>
                <div className='guide-step1-btn' onClick={() => setStep(2)}>
                    {iLocal('Take_Tour')}
                </div>
            </div>
        )
    }

    const stepTwo = () => {
        return (
            <div className='guide-step2-wrap'>
                <div className='flex-col flex-full align-center'>
                    <div className='guide-step2-title'>
                        {iLocal('Automatic_Monitor')}
                    </div>
                    <div className='guide-step2-desc'>
                        {iLocal('FoxEye_automatically_detects')}<br/><br/>{iLocal('If_any_threats')}
                    </div>
                    <img src={imgGuideMonitor} className='guide-step2-img'/>
                </div>
                <div className='flex-row'>
                    <div className='guide-step2-back-img' style={{'--ic-guide-back': 'url(' + icGuideBack + ')', '--ic-guide-back-hover': 'url(' + icGuideBackHover + ')'}} onClick={() => setStep(1)}/>
                    <div className='guide-step2-btn' onClick={() => setStep(3)}>
                        <div className='guide-step2-next'>
                            {iLocal('Next')}
                        </div>
                        <img src={icEnterWhite} className='guide-step2-next-icon'/>
                    </div>
                </div>
            </div>
        )
    }

    const stepThree = () => {
        const icons = [icGuidePhishing, icGuideMalicious, icGuideToken, icGuideReminder];
        const titles  = ['Phishing Websites', 'Malicious Contract', 'Buying a Risky Token', 'Approval Reminder'];
        const descs = ['Intercept phshing websites', 'Identify malicious contracts', 'Every token you buy will be checked before swap happens', 'Explicit alert for approvals'];
        return (
            <div className='guide-step2-wrap'>
                <div className='flex-col flex-full align-center'>
                    <div className='guide-step2-title' style={{ marginBottom: 8 }}>
                        {iLocal('Various_Safe_Alerts')}
                    </div>
                    {icons.map((item, index) => (
                        <div className='guide-step3-item' key={'stepThree-index-' + index}>
                            <img src={item} className='guide-step3-item-img'/>
                            <div className='guide-step3-item-content'>
                                <div className='guide-step3-item-title'>
                                    {titles[index]}
                                </div>
                                <div className='guide-step3-item-desc'>
                                    {descs[index]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex-row'>
                    <div className='guide-step2-back-img' style={{'--ic-guide-back': 'url(' + icGuideBack + ')', '--ic-guide-back-hover': 'url(' + icGuideBackHover + ')'}} onClick={() => setStep(2)}/>
                    <div className='guide-step2-btn' onClick={() => setStep(4)}>
                        <div className='guide-step2-next'>
                            Next
                        </div>
                        <img src={icEnterWhite} className='guide-step2-next-icon'/>
                    </div>
                </div>
            </div>
        )
    }

    const stepFour = () => {
        const icons = [icGuideApproval, icGuideReport];
        const titles  = ['Approval Management', 'Token Safety Report'];
        const descs = ['Tool for revoking approvals', 'Search the safety report for any token'];
        return (
            <div className='guide-step2-wrap'>
                <div className='flex-col flex-full align-center'>
                    <div className='guide-step2-title' style={{ marginBottom: 8 }}>
                        {iLocal('Handy_Tools')}
                    </div>
                    {icons.map((item, index) => (
                        <div className='guide-step3-item' key={'stepFour-index-' + index}>
                            <img src={item} className='guide-step3-item-img'/>
                            <div className='guide-step3-item-content'>
                                <div className='guide-step3-item-title'>
                                    {titles[index]}
                                </div>
                                <div className='guide-step3-item-desc'>
                                    {descs[index]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex-row'>
                    <div className='guide-step2-back-img' style={{'--ic-guide-back': 'url(' + icGuideBack + ')', '--ic-guide-back-hover': 'url(' + icGuideBackHover + ')'}} onClick={() => setStep(3)}/>
                    <div className='guide-step2-btn' onClick={() => setStep(5)}>
                        <div className='guide-step2-next'>
                            Next
                        </div>
                        <img src={icEnterWhite} className='guide-step2-next-icon'/>
                    </div>
                </div>
            </div>
        )
    }

    const stepFive = () => {
        const icons = [icGuideSafety, icGuideManage, icGuideIntercepts, icGuideFoxeye];
        const titles  = ['Check Token Safety Report', 'Manage approvals', 'FoxEye intercepts malicious activities for you', 'Open FoxEye'];
        return (
            <div className='guide-step2-wrap'>
                <div className='flex-col flex-full align-center'>
                    <div className='guide-step2-title' style={{ marginBottom: 8 }}>
                        {iLocal('Fox_Airdrop')}
                    </div>
                    <div className='guide-step5-desc'>
                        {iLocal('You_receive_FOX_airdrop')}
                    </div>

                    {icons.map((item, index) => (
                        <div className='guide-step3-item' key={'stepThree-index-' + index}>
                            <img src={item} className='guide-step3-item-img'/>
                            <div className='guide-step3-item-content'>
                                <div className='guide-step5-item-title'>
                                    {titles[index]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex-row'>
                    <div className='guide-step2-back-img' style={{'--ic-guide-back': 'url(' + icGuideBack + ')', '--ic-guide-back-hover': 'url(' + icGuideBackHover + ')'}} onClick={() => setStep(4)}/>
                    <div className='guide-step2-btn' onClick={()=>{
                        if (state?.from) {
                            navigate('/' + state.from, {state: {...state, from: state.to}})
                        } else {
                            navigate('/home');
                            chrome.storage.local.set({ 'popup-guide-end': true });
                        }
                    }}>
                        <div className='guide-step2-next'>
                            {iLocal('Start_to_use_FoxEye')}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-col' style={{height: '100%'}}>
            {step == 1 && stepOne()}
            {step == 2 && stepTwo()}
            {step == 3 && stepThree()}
            {step == 4 && stepFour()}
            {step == 5 && stepFive()}
        </div>
    )
}

export default Guide;
