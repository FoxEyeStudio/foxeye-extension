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
import icFord from '../../images/ic_fold.png'
import icTips from '../../images/ic_earnings_tips.png'
import icUnFord from '../../images/ic_unfold.png'

function Earn() {
    const navigate = useNavigate()
    const { state: { account } } = useLocation();
    const [showDetection, setShowDetection] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showDemo, setShowDemo] = useState(false);
    const [airdropTab, setAirdropTab] = useState(true);
    const [claimAmount, setCliamAmount] = useState(0);

    const formatNumber = num => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    useEffect(() => {
        chrome.runtime.sendMessage({foxeye_extension_action: "foxeye_get_airdrop_amount", account}, result => {
            if(result) {
                if (result.address?.toUpperCase() === account?.toUpperCase()) {
                    if (result.amount) {
                        setCliamAmount(formatNumber(result.amount))
                    }
                }
            }
        });
    }, []);

    const detectionItem = () => {
        return (
            <div className='earn-claimable-item-wrap'>
                <div className='earn-claimable-item-title-wrap'>
                    <img className='earn-claimable-item-icon' src={icEarningsDetection}/>
                    <div className='earn-claimable-title-text'>
                        Token Detection
                    </div>
                    <div className='flex-full'/>
                    <div className='earn-claimable-per-action'>
                        5 per action
                    </div>
                    <img className='earn-claimable-fold-icon' src={showDetection ? icFord : icUnFord} onClick={() => {
                        setShowDetection(!showDetection);
                    }}/>

                </div>
                {showDetection && (
                    <div className='flex-col'>
                        <div className='earn-claimable-item-desc'>
                            Use<em className='earn-claimable-item-clickable-desc' onClick={() => {}}> token detection</em> feature to get a safety report of any token.
                        </div>
                        <div className='flex-row align-center'>
                            <img src={icTips} className='earn-claimable-tip-icon'/>
                            <div className='earn-claimable-tip-content'>
                                Daily Upper Limit: 10 tokens
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
                        Risk Alert
                    </div>
                    <div className='flex-full'/>
                    <div className='earn-claimable-per-action'>
                        20 per action
                    </div>
                    <img className='earn-claimable-fold-icon' src={showAlert ? icFord : icUnFord} onClick={() => {
                        setShowAlert(!showAlert);
                    }}/>

                </div>
                {showAlert && (
                    <div className='flex-col'>
                        <div className='earn-claimable-item-desc'>
                            Risk alerts are triggered automatically while using FoxEye. Once triggered you'll get airdrop bouns.
                        </div>
                        <div className='flex-row align-center'>
                            <img src={icTips} className='earn-claimable-tip-icon'/>
                            <div className='earn-claimable-tip-content'>
                                Daily Upper Limit: 60 tokens
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const demoItem = () => {
        return (
            <div className='earn-claimable-item-wrap'>
                <div className='earn-claimable-item-title-wrap'>
                    <img className='earn-claimable-item-icon' src={icEarningsDemo}/>
                    <div className='earn-claimable-title-text'>
                        Experience Risk Demo
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
                        <div className='earn-claimable-item-desc'>
                            <em className='earn-claimable-item-clickable-desc' onClick={() => {}}>Risk Demo</em> is a demo for risk alerts. When you haven't met any risk alert yet, you can experience risk demo to see how FoxEye will behave when encountering risks.
                        </div>
                        <div className='flex-row align-center'>
                            <img src={icTips} className='earn-claimable-tip-icon'/>
                            <div className='earn-claimable-tip-content'>
                                This is a one-time task.
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
                <div style={{ '--ic-about-normal': 'url(' + aboutIcon + ')', '--ic-about-hover': 'url(' + aboutHoverIcon + ')'}} className='title-about' onClick={()=>{navigate('/about', {state: {from: 'earn'}})}}/>
            </div>
            <div className="token-detection-title flex-row align-center">
                <div className="back-img" style={{ '--ic-back-normal': 'url(' + backIcon + ')', '--ic-back-hover': 'url(' + backHoverIcon + ')'}} onClick={()=>{navigate('/home')}}/>
                <span className="detection-text">Earnings Center</span>
            </div>

            <div className='earn-tab-wrap'>
                <div className='earn-tab-item' onClick={() => setAirdropTab(true)}>
                    <div className={airdropTab ? 'earn-tab-item-name-selected' : 'earn-tab-item-name'}>
                        Airdrops
                    </div>
                    <div className={airdropTab ? 'earn-tab-item-line-selected' : 'earn-tab-item-line'}/>
                </div>
                <div style={{ width: 42}} />
                <div className='earn-tab-item' onClick={() => setAirdropTab(false)}>
                    <div className={airdropTab ? 'earn-tab-item-name' : 'earn-tab-item-name-selected'}>
                        Dividends
                    </div>
                    <div className={airdropTab ? 'earn-tab-item-line' : 'earn-tab-item-line-selected'}/>
                </div>
            </div>
            {airdropTab ? (
                <div className='earn-scroll-div'>
                    <div className='earn-airdrops-desc'>
                        $FOX token allows you to gain dividends from FoxEye Ad Pool.
                    </div>
                    <div className='earn-airdrops-qualification-wrap'>
                        <div className='earn-qualification-title-wrap'>
                            <div className='earn-qualification-title'>
                                Airdrop Qualification
                            </div>
                            <div className='earn-qualification-detail'>
                                Details
                            </div>
                        </div>
                        <div className='earn-account-wrap'>
                            <img src={icAccount} className='earn-account-icon'/>
                            <div className='earn-account-address'>
                                {account.substr(0, 8) + '...' + account.substr(-6)}
                            </div>
                            <div className='flex-full'/>
                            <div className='earn-eligible-icon' />
                            <div className='earn-eligible-text'>
                                Eligible
                            </div>
                        </div>
                        <div className='earn-eligible-desc'>
                            $FOX token will be distributed among eligible FoxEye users.
                        </div>
                    </div>

                    <div className='earn-claimable-wrap'>
                        <div className='earn-claimable-title-wrap'>
                            <div className='earn-claimable-title'>
                                Claimable
                            </div>
                            <div className='flex-full'/>
                            <div className='earn-claimable-number'>
                                {claimAmount}
                            </div>
                        </div>
                        <div className='earn-claimable-desc'>
                            Increase your airdrop amount by completing the following tasks.
                        </div>
                        <div className='earn-claimable-line'/>
                        {detectionItem()}
                        <div className='earn-claimable-line'/>
                        {alertItem()}
                        <div className='earn-claimable-line'/>
                        {demoItem()}
                    </div>

                    <div className='earn-claim-btn-wrap'>
                        <div className='earn-claim-btn' onClick={() => {

                        }}>
                            Claim Airdrops
                        </div>
                    </div>
                </div>
            ) : (
                <div className='earn-scroll-div' style={{marginTop: 0}}>
                    <div className='earn-dividends-item-wrap'>
                        <div className='earn-dividends-item-title-wrap'>
                            <div className='earn-dividends-item-title'>Current Ad Pool</div>
                            <div className='earn-dividends-item-amount'>$5,644</div>
                        </div>
                        <div className='earn-dividends-item-desc'>By holding $FOX, you can buy lotteries to get dividends from Ad Pool.</div>
                    </div>
                    <div className='earn-dividends-item-wrap'>
                        <div className='earn-dividends-item-title-wrap'>
                            <div className='earn-dividends-item-title'>Lottery Cost</div>
                            <div className='earn-dividends-item-amount'>100 FOX</div>
                        </div>
                        <div className='earn-dividends-item-desc'>There's no limitation for one account on how many lotteries he can buy or win.</div>
                    </div>
                    <div className='earn-dividends-item-wrap'>
                        <div className='earn-dividends-item-title-wrap'>
                            <div className='earn-dividends-item-title'>10K FOX Dividends</div>
                            <div className='earn-dividends-item-amount'>$10</div>
                        </div>
                        <div className='earn-dividends-item-desc'>Dividends for holding every 10K $FOX token if you win a lottery.</div>
                    </div>
                    <div className='earn-dividends-item-wrap'>
                        <div className='earn-dividends-item-title-wrap'>
                            <div className='earn-dividends-item-title'>My FOX Tokens</div>
                            <div className='earn-dividends-item-amount'>0</div>
                        </div>
                        <div className='earn-dividends-item-desc'>
                            You can collect FOX tokens from <em className='earn-dividends-item-desc-clickable' onClick={() => setAirdropTab(true)}>airdrops</em>
                        </div>
                    </div>
                    <div className='earn-dividends-btn-wrap'>
                        <div className='earn-dividends-btn' onClick={() => {

                        }}>
                            Buy a lottery to win dividends
                        </div>
                    </div>
                    <div className='earn-dividends-learnmore-desc'>
                        The lottery system is operated in a decentralised way.&emsp;<em className='earn-dividends-item-desc-clickable' onClick={() => setAirdropTab(true)}>Learn More</em>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Earn;
