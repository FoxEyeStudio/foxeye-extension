import React, {useEffect, useState} from "react";
import '../../css/common.css'
import '../../css/earn.css'
import titleLogo from "../../images/title_logo.png";
import aboutIcon from "../../images/ic_about.png";
import aboutHoverIcon from "../../images/ic_about_hover.png";
import {useLocation, useNavigate} from "react-router-dom";
import backIcon from "../../images/ic_back.png";
import backHoverIcon from "../../images/ic_back_hover.png";
import icAccount from '../../images/ic_account.png';
import icEarningsDetection from '../../images/ic_earnings_detection.png'
import icEarningsAlert from '../../images/ic_earnings_alert.png'
import icEarningsDemo from '../../images/ic_earnings_demo.png'
import icEarningsRevoke from '../../images/ic_earnings_revoke.png'
import icFord from '../../images/ic_fold.png'
import icTips from '../../images/ic_earnings_tips.png'
import icUnFord from '../../images/ic_unfold.png'
import icAccountSwitch from '../../images/ic_account_switch.png'
import icAccountSwitchHover from '../../images/ic_account_switch_hover.png'
import {Task_ExperienceDemo} from "../../background/RiskCenter";
import {iLocal, isCN} from "../../common/utils";
import ic_link from "../../images/ic_link.png";
import ic_link_hover from "../../images/ic_link_hover.png";

function Earn() {
    const navigate = useNavigate()
    const { state: { account, isAirdropTab } } = useLocation();
    const [showDetection, setShowDetection] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showDemo, setShowDemo] = useState(false);
    const [showRevoke, setRevoke] = useState(false);
    const [airdropTab, setAirdropTab] = useState(true);
    const [claimAmount, setCliamAmount] = useState(0);
    const [poolValue, setPoolValue] = useState(0);
    const [balance, setBalance] = useState(0);

    const formatNumber = num => {
        if (!num) {
            return 0;
        }
        num = Number(num);
        let length = 0;
        if (String(num).indexOf('.') !== -1) {
            const dotIndex = String(num).indexOf('.') + 1;
            length = String(num).length - dotIndex;
        }
        let mon = num.toFixed(length)
        if (length > 2) {
            mon = num.toFixed(2)
        }
        return mon.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    useEffect(() => {
        chrome.runtime.sendMessage({foxeye_extension_action: "foxeye_get_airdrop_amount", account}, result => {
            if(result) {
                if (result.address?.toUpperCase() === account?.toUpperCase()) {
                    setCliamAmount(formatNumber(result.amount))
                    setPoolValue(formatNumber(result.pool))
                    setBalance(formatNumber(result.balance))
                }
            }
        });

        if (isAirdropTab === false) {
            setAirdropTab(false);
        }
    }, []);

    const detectionItem = () => {
        return (
            <div className='earn-claimable-item-wrap'>
                <div className='earn-claimable-item-title-wrap'>
                    <img className='earn-claimable-item-icon' src={icEarningsDetection}/>
                    <div className='earn-claimable-title-text'>
                        {iLocal('Token_Detection')}
                    </div>
                    <div className='flex-full'/>
                    <div className='earn-claimable-per-action'>
                        {iLocal('five_per_action')}
                    </div>
                    <img className='earn-claimable-fold-icon' src={showDetection ? icFord : icUnFord} onClick={() => {
                        setShowDetection(!showDetection);
                    }}/>

                </div>
                {showDetection && (
                    <div className='flex-col'>
                        {isCN() ? (
                            <div className='earn-claimable-item-desc'>
                                使用<em className='earn-claimable-item-clickable-desc' onClick={()=>{navigate('/detection', { state: { account, from: 'earn' }})}}>代币检测</em>功能获取任意代币的安全报告。
                            </div>
                        ) : (
                            <div className='earn-claimable-item-desc'>
                                Use<em className='earn-claimable-item-clickable-desc' onClick={()=>{navigate('/detection', { state: { account, from: 'earn' }})}}> token detection</em> feature to get a safety report of any token.
                            </div>
                        )}

                        <div className='flex-row align-center'>
                            <img src={icTips} className='earn-claimable-tip-icon'/>
                            <div className='earn-claimable-tip-content'>
                                {iLocal('Daily_Upper_20')}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const alertItem = () => {
        return (
            <div className='earn-claimable-item-wrap'>
                <div className='earn-claimable-item-title-wrap'>
                    <img className='earn-claimable-item-icon' src={icEarningsAlert}/>
                    <div className='earn-claimable-title-text'>
                        {iLocal('Risk_Alert')}
                    </div>
                    <div className='flex-full'/>
                    <div className='earn-claimable-per-action'>
                        {iLocal('twenty_per_action')}
                    </div>
                    <img className='earn-claimable-fold-icon' src={showAlert ? icFord : icUnFord} onClick={() => {
                        setShowAlert(!showAlert);
                    }}/>

                </div>
                {showAlert && (
                    <div className='flex-col'>
                        <div className='earn-claimable-item-desc'>
                            {iLocal('Risk_alerts_are_triggered')}
                        </div>
                        <div className='flex-row align-center'>
                            <img src={icTips} className='earn-claimable-tip-icon'/>
                            <div className='earn-claimable-tip-content'>
                                {iLocal('Daily_Upper_60')}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const linkTo = url => {
        chrome.tabs.create({url});
    }

    const demoItem = () => {
        return (
            <div className='earn-claimable-item-wrap'>
                <div className='earn-claimable-item-title-wrap'>
                    <img className='earn-claimable-item-icon' src={icEarningsDemo}/>
                    <div className='earn-claimable-title-text'>
                        {iLocal('Experience_Risk_Demo')}
                    </div>
                    <div className='flex-full'/>
                    <div className='earn-claimable-per-action'>
                        1000
                    </div>
                    <img className='earn-claimable-fold-icon' src={showDemo ? icFord : icUnFord} onClick={() => {
                        setShowDemo(!showDemo);
                    }}/>

                </div>
                {showDemo && (
                    <div className='flex-col'>
                        {isCN() ? (
                            <div className='earn-claimable-item-desc'>
                                <em className='earn-claimable-item-clickable-desc' onClick={() => {
                                    chrome.runtime.sendMessage({foxeye_extension_action: "foxeye_taskstat", account, type: Task_ExperienceDemo, content: ''}, result => {

                                        linkTo('https://foxeye.io/risk-demo');
                                    });
                                }}>风险Demo</em>展示的是遭遇风险时FoxEye的处理方式。在尚未遇到任何风险时可以先通过Demo体验一下。
                            </div>
                        ) : (
                            <div className='earn-claimable-item-desc'>
                                <em className='earn-claimable-item-clickable-desc' onClick={() => {
                                    chrome.runtime.sendMessage({foxeye_extension_action: "foxeye_taskstat", account, type: Task_ExperienceDemo, content: ''}, result => {

                                        linkTo('https://foxeye.io/risk-demo');
                                    });
                                }}>Risk Demo</em> is a demo for risk alerts. When you haven't met any risk alert yet, you can experience risk demo to see how FoxEye will behave when encountering risks.
                            </div>
                        )}
                        <div className='flex-row align-center'>
                            <img src={icTips} className='earn-claimable-tip-icon'/>
                            <div className='earn-claimable-tip-content'>
                                {iLocal('This_is_one_time_task')}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const revokeItem = () => {
        return (
            <div className='earn-claimable-item-wrap'>
                <div className='earn-claimable-item-title-wrap'>
                    <img className='earn-claimable-item-icon' src={icEarningsRevoke}/>
                    <div className='earn-claimable-title-text'>
                        {iLocal('Revoke_Approvals')}
                    </div>
                    <div className='flex-full'/>
                    <div className='earn-claimable-per-action'>
                        {iLocal('ten_per_action')}
                    </div>
                    <img className='earn-claimable-fold-icon' src={showRevoke ? icFord : icUnFord} onClick={() => {
                        setRevoke(!showRevoke);
                    }}/>

                </div>
                {showRevoke && (
                    <div className='flex-col'>
                        {isCN() ? (
                            <div className='earn-claimable-item-desc'>
                                <em className='earn-claimable-item-clickable-desc' onClick={()=>{
                                    navigate('/approval', { state: { account: account, from: 'earn' }})
                                }}
                                >授权管理</em>是用来查看和取消授权的。定期检查并撤销未知授权可以提升账户的安全性。
                            </div>
                        ) : (
                            <div className='earn-claimable-item-desc'>
                                <em className='earn-claimable-item-clickable-desc' onClick={()=>{
                                    navigate('/approval', { state: { account: account, from: 'earn' }})
                                }}
                                >Approval Management</em>  is a tool for checking and revoking approvals. Regularly revoking unnecessary and unknown approvals can increase your safety significantly.
                            </div>
                        )}
                        <div className='flex-row align-center'>
                            <img src={icTips} className='earn-claimable-tip-icon'/>
                            <div className='earn-claimable-tip-content'>
                                {iLocal('Daily_Upper_40')}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className='flex-col' style={{height: '100%'}}>
            <div className='title-wrap'>
                <img src={titleLogo} className='title-logo' />
                <div style={{ '--ic-about-normal': 'url(' + aboutIcon + ')', '--ic-about-hover': 'url(' + aboutHoverIcon + ')'}} className='title-about' onClick={()=>{navigate('/about', {state: {account, from: 'earn'}})}}/>
            </div>
            <div className="token-detection-title flex-row align-center">
                <div className="back-img" style={{ '--ic-back-normal': 'url(' + backIcon + ')', '--ic-back-hover': 'url(' + backHoverIcon + ')'}} onClick={()=>{navigate('/home')}}/>
                <span className="detection-text">{iLocal('Earnings_Center')}</span>
            </div>

            <div className='earn-tab-wrap'>
                <div className='earn-tab-item' onClick={() => setAirdropTab(true)}>
                    <div className={airdropTab ? 'earn-tab-item-name-selected' : 'earn-tab-item-name'}>
                        {iLocal('Airdrops')}
                    </div>
                    <div className={airdropTab ? 'earn-tab-item-line-selected' : 'earn-tab-item-line'}/>
                </div>
                <div style={{ width: 42}} />
                <div className='earn-tab-item' onClick={() => setAirdropTab(false)}>
                    <div className={airdropTab ? 'earn-tab-item-name' : 'earn-tab-item-name-selected'}>
                        {iLocal('Dividends')}
                    </div>
                    <div className={airdropTab ? 'earn-tab-item-line' : 'earn-tab-item-line-selected'}/>
                </div>
            </div>
            {airdropTab ? (
                <div className='earn-scroll-div'>
                    <div className='earn-airdrops-desc'>
                        {iLocal('FOX_token_allows')}
                    </div>
                    <div className='earn-account-wrap'>
                        <img src={icAccount} className='earn-account-icon'/>
                        <div className='earn-account-address'>
                            {account ? account?.substr(0, 8) + '...' + account?.substr(-6) : iLocal('Not_connected')}
                        </div>
                        <div className='flex-full'/>
                        {!!account && (
                            <div className='earn-account-switch' style={{ '--ic-account-switch-normal': 'url(' + icAccountSwitch + ')', '--ic-account-switch-hover': 'url(' + icAccountSwitchHover + ')'}} onClick={()=>{navigate('/account', {state: {from: 'earn', isAirdropTab: airdropTab}})}}/>
                        )}
                    </div>

                    <div className='earn-claimable-wrap'>
                        <div className='earn-claimable-title-wrap'>
                            <div className='earn-claimable-title'>
                                {iLocal('Claimable')}
                            </div>
                            <div className='flex-full'/>
                            <div className='earn-claimable-number'>
                                {claimAmount}
                            </div>
                        </div>
                        <div className='earn-claimable-desc'>
                            {iLocal('Increase_your_airdrop')}
                        </div>
                        <div className='earn-claimable-line'/>
                        {detectionItem()}
                        <div className='earn-claimable-line'/>
                        {alertItem()}
                        <div className='earn-claimable-line'/>
                        {demoItem()}
                        <div className='earn-claimable-line'/>
                        {revokeItem()}
                    </div>

                    <div className='earn-claim-btn-wrap'>
                        <div className='earn-claim-btn' onClick={() => {

                        }}>
                            {iLocal('Claim_Airdrops')}
                        </div>
                    </div>
                    {isCN() ? (
                        <div className='earn-dividends-learnmore-desc'>
                            空投每半个月发放一次<br/><em className='earn-dividends-item-desc-clickable' onClick={() => {}}>了解详情</em>
                        </div>

                    ) : (
                        <div className='earn-dividends-learnmore-desc'>
                            Airdrops are distributed every half a month.<br/><em className='earn-dividends-item-desc-clickable' onClick={() => {}}>Learn More</em>
                        </div>
                    )}
                </div>
            ) : (
                <div className='earn-scroll-div' style={{marginTop: 0}}>
                    <div className='earn-account-wrap' style={{ marginTop: 8, marginBottom: 8 }}>
                        <img src={icAccount} className='earn-account-icon'/>
                        <div className='earn-account-address'>
                            {account ? account?.substr(0, 8) + '...' + account?.substr(-6) : iLocal('Not_connected')}
                        </div>
                        <div className='flex-full'/>
                        {!!account && (
                            <div className='earn-account-switch' style={{ '--ic-account-switch-normal': 'url(' + icAccountSwitch + ')', '--ic-account-switch-hover': 'url(' + icAccountSwitchHover + ')'}} onClick={()=>{navigate('/account', {state: {from: 'earn', isAirdropTab: airdropTab}})}}/>
                        )}
                    </div>
                    <div className='earn-dividends-item-wrap'>
                        <div className='earn-dividends-item-title-wrap'>
                            <div className='earn-dividends-item-title'>{iLocal('Current_Ad_Pool')}</div>
                            <div className='earn-dividends-item-amount'>${poolValue}</div>
                        </div>
                        <div className='earn-dividends-item-desc'>{iLocal('By_holding_FOX')}</div>
                    </div>
                    <div className='earn-dividends-item-wrap'>
                        <div className='earn-dividends-item-title-wrap'>
                            <div className='earn-dividends-item-title'>{iLocal('Lottery_Cost')}</div>
                            <div className='earn-dividends-item-amount'>100 FOX</div>
                        </div>
                        <div className='earn-dividends-item-desc'>{iLocal('There_no_limitation')}</div>
                    </div>
                    <div className='earn-dividends-item-wrap'>
                        <div className='earn-dividends-item-title-wrap'>
                            <div className='earn-dividends-item-title'>{iLocal('Ten_Thousand_FOX_Dividends')}</div>
                            <div className='earn-dividends-item-amount'>$10</div>
                        </div>
                        <div className='earn-dividends-item-desc'>{iLocal('Dividends_for_holding')}</div>
                    </div>
                    <div className='earn-dividends-item-wrap'>
                        <div className='earn-dividends-item-title-wrap'>
                            <div className='earn-dividends-item-title'>{iLocal('My_FOX_Tokens')}</div>
                            <div className='earn-dividends-item-amount'>{balance}</div>
                        </div>
                        {isCN() ? (
                            <div className='earn-dividends-item-desc'>
                                你可以通过<em className='earn-dividends-item-desc-clickable' onClick={() => setAirdropTab(true)}>空投</em>获取Fox代币
                            </div>
                        ) : (
                            <div className='earn-dividends-item-desc'>
                                You can collect FOX tokens from <em className='earn-dividends-item-desc-clickable' onClick={() => setAirdropTab(true)}>airdrops</em>
                            </div>
                        )}
                    </div>
                    <div className='earn-dividends-btn-wrap'>
                        <div className='earn-dividends-btn' onClick={() => {

                        }}>
                            {iLocal('Buy_lottery_to_dividends')}
                        </div>
                    </div>
                    {isCN() ? (
                        <div className='earn-dividends-learnmore-desc'>
                            抽奖系统是去中心化运作的.<br/><em className='earn-dividends-item-desc-clickable' onClick={() => {}}>了解详情</em>
                        </div>

                    ) : (
                        <div className='earn-dividends-learnmore-desc'>
                            The lottery system is operated in a decentralised way.<br/><em className='earn-dividends-item-desc-clickable' onClick={() => {}}>Learn More</em>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
export default Earn;
