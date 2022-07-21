import React, { Component } from 'react';
import Lottie from 'react-lottie'
import {
    RiskType_ApproveEOA,
    RiskType_MaliciousAddress,
    RiskType_MaliciousContract,
    RiskType_PhishingWebsite,
    RiskType_SwapHighRiskToken,
    RiskType_SwapMediumRiskToken,
    RiskType_TransferToContract
} from "../background/RiskCenter";
import {postMessage} from "../proxy/ProxyMessage";
import TokenView from '../common/TokenView';
import backIcon from "../images/ic_back.png";
import backHoverIcon from "../images/ic_back_hover.png";
import {LoadingJson} from "../common/utils";


export default class AlertView extends Component {
    state = {
        showTokenView: false,
        tokenInfo: '',
        loading: false
    }

    clickCheckReport = () => {
        this.setState({ showTokenView: true, loading: !this.state.tokenInfo });

        let { address, chain_id} = this.props.info;
        chrome.runtime.sendMessage({foxeye_extension_action: "foxeye_get_token_info", chainId: chain_id, tokenAddress: address}, result => {
            if (result && result[address.toLowerCase()]) {
                const tokenInfo = {...result[address.toLowerCase()], tokenAddress: address, token_id: chain_id}
                this.setState({ tokenInfo, loading: false })
            }
        });
    }

    clickAbort = () => {
        this.props.hideContainer && this.props.hideContainer();
        postMessage({foxeye_extension_action: 'foxeye_alert_callback', action: 'abort'});
    }

    clickContinue = () => {
        this.props.hideContainer && this.props.hideContainer();
        postMessage({foxeye_extension_action: 'foxeye_alert_callback', action: 'continue'});
    }

    render() {
        if (this.props.toast) {
            return (
                <div className='foxeye-alert-toast'>
                    FoxEye starting...
                </div>
            )
        }
        const {type, address, symbol} = this.props.info;

        let picUrl = '';
        let title = '';
        let errorDesc = '';
        let bgColor = '#D73A4A';
        if (type === RiskType_PhishingWebsite) {
            picUrl = 'img_alert_phishing';
            title = 'Phishing Website';
            errorDesc = 'The website is blacklisted by FoxEye. Continuing browsing may cause asset loss.';
        } else if (type === RiskType_MaliciousContract) {
            picUrl = 'img_alert_malicious';
            title = 'Malicious Contract';
            errorDesc = 'This contract is a scam that will steal your funds. Any interaction should be avoided.';
        } else if (type === RiskType_MaliciousAddress) {
            picUrl = 'img_alert_malicious';
            title = 'Malicious Address';
            errorDesc = 'This address is marked as malicious address, interacting with it could cause potential loss or legal problem.';
        } else if (type === RiskType_TransferToContract) {
            // picUrl = '';
            // title = '';
            // errorDesc = '';
        } else if (type === RiskType_SwapHighRiskToken) {
            picUrl = 'img_alert_highrisk';
            title = 'High Risk Token';
            errorDesc = 'This token is marked as high-risk';
        } else if (type === RiskType_SwapMediumRiskToken) {
            picUrl = 'img_alert_midrisk';
            title = 'Mid Risk Token';
            errorDesc = 'This token is marked as mid-risk';
            bgColor = '#FFA354';
        } else if (type === RiskType_ApproveEOA) {
            picUrl = 'img_alert_wrong';
            title = 'Wrong Target';
            errorDesc = 'You are approving to an EOA(ordinary user account), which has no limitation on fund spending.';
        }

        let targetContent = '';
        if (!!symbol) {
            targetContent = symbol + ', ';
        }
        if (address) {
            targetContent += address;
        }

        return (
            <div className='foxeye-content-body'>
                <div className='modal-wrap'>
                    <div className='modal-top' style={{backgroundColor: bgColor}}>
                        <img src={chrome.runtime.getURL('/images/img_alert_logo.png')} className='foxeye-logo'/>
                        <img src={chrome.runtime.getURL('/images/' + picUrl +'.png')} className='alert-type-img'/>
                    </div>
                    <div className='modal-bottom'>
                        <div className='modal-title'>
                            {title}
                        </div>
                        <div className='address-and-host'>
                            {targetContent}
                        </div>
                        <div className='alert-desc'>
                            {errorDesc}
                        </div>
                        {(type === RiskType_SwapHighRiskToken || type === RiskType_SwapMediumRiskToken) && (
                            <div className='check-report' onClick={this.clickCheckReport}>
                                Check Report
                            </div>
                        )}
                        <div className={'foxeye-content-abort'} onClick={this.clickAbort}>
                            Abort
                        </div>
                        <div className='continue-btn' onClick={this.clickContinue}>
                            Continue
                        </div>
                    </div>
                    {this.state.showTokenView && (
                        <div style={{position: 'absolute', zIndex: 1, left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "white", borderRadius: 16, paddingBottom: 16, display: "flex", flexDirection: "column" }}>
                            <div className="foxeye-back-img" style={{ '--ic-back-normal': 'url(' + backIcon + ')', '--ic-back-hover': 'url(' + backHoverIcon + ')'}} onClick={()=>{
                                this.setState({ showTokenView: false });
                            }}/>

                            {this.state.tokenInfo && !this.state.loading && (
                                <div style={{width: '100%', height: '100%', overflowY: "auto", overflowX: 'hidden' }}>
                                    <TokenView token_info={this.state.tokenInfo} fromAlert={true}/>
                                </div>
                            )}

                            {this.state.loading && (
                                <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: "relative"}}>
                                    <Lottie options={{
                                        loop: true,
                                        autoplay: true,
                                        animationData: LoadingJson,
                                        rendererSettings: {
                                            preserveAspectRatio: 'xMidYMid slice'
                                        }
                                    }}
                                            height={48}
                                            width={48}
                                    />
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        )
    }
}
