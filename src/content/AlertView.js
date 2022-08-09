import React, { Component } from 'react';
import Lottie from 'react-lottie'
import {
    RiskType_ApproveEOA,
    RiskType_MaliciousAddress,
    RiskType_MaliciousContract,
    RiskType_PhishingWebsite,
    RiskType_SwapHighRiskToken,
    RiskType_SwapMediumRiskToken,
    RiskType_TransferToContract,
    RiskType_ApproveNormal,
    Approve_ERC20_approve,
    Approve_ERC20_increaseAllowance,
    Approve_ERC721_approve,
    Approve_ERC721_setApprovalForAll
} from "../background/RiskCenter";
import {postMessage} from "../proxy/ProxyMessage";
import TokenView from '../common/TokenView';
import backIcon from "../images/ic_back.png";
import backHoverIcon from "../images/ic_back_hover.png";
import icArrowTop from "../images/ic_arrow_top.png";
import icArrowBottom from "../images/ic_arrow_bottom.png";
import {LoadingJson} from "../common/utils";
import {number} from "prop-types";

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

    amountFormat = num => {
        if (num > 1000000000) {
            const p = Math.floor(Math.log(num) / Math.LN10);
            const n = num * (10 ** -p);
            if (p > 0) {
                return `${n}e+${p}`;
            } else {
                return `${n}e${p}`;
            }
        }
        const mon = num.toFixed(2)
        const reg = /(\d)(?=(\d{3})+\.)/g
        return mon.replace(reg, ($0, $1) => $1 + ',')
    }

    render() {
        if (this.props.toast) {
            return (
                <div className='foxeye-alert-toast'>
                    FoxEye starting...
                </div>
            )
        }
        const {type, address, symbol, url, sub_type, name, token_id, amount} = this.props.info;
        let picUrl = '';
        let title = '';
        let errorDesc = '';
        let bgColor = '#D73A4A';
        let targetContent = '';
        let subTypeDesign = false;
        if (type === RiskType_PhishingWebsite) {
            picUrl = 'img_alert_phishing';
            title = 'Phishing Website';
            targetContent = url;
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
        } else if (type === RiskType_ApproveNormal) {
            bgColor = '#FFA354';
            subTypeDesign = true;
            if (sub_type == Approve_ERC20_approve ) {
                picUrl = 'img_alert_token_approve';
            } else if (sub_type == Approve_ERC20_increaseAllowance ) {
                picUrl = 'img_alert_token_approve';
            } else if (sub_type == Approve_ERC721_approve ) {
                picUrl = 'img_alert_nft_approve';
            } else if (sub_type == Approve_ERC721_setApprovalForAll ) {
                picUrl = 'img_alert_nft_approve';
            }
        }

        let subTypeTitleLeft = '';
        let subTypeTitleRight = '';
        let subTypeTitleLeftMaxWidth = 0;
        let subTypeTitleRightMaxWidth = 0;
        let subTypeTag = '';
        let subTypeContractAddress = '';
        let subTypeDesc = '';

        if (type !== RiskType_ApproveNormal) {
            if (!!symbol) {
                targetContent = symbol + ', ';
            }
            if (address) {
                targetContent += address.substr(0, 8) + '...' + address.substr(-6);
            }
        } else {
            subTypeContractAddress = address.substr(0, 8) + '...' + address.substr(-6);;
            if (sub_type === Approve_ERC20_approve) {
                subTypeTitleLeft = this.amountFormat(amount) + '\u00a0\u00a0\u00a0' + name;
                subTypeTitleLeftMaxWidth = 400;
                subTypeTitleRight = '';
                subTypeTag = 'Approve';
                subTypeDesc = 'After approval, this address can spend approved ' + this.amountFormat(amount) + '\u00a0' + name + ', if you’re not sure please abort.'
            } else if (sub_type === Approve_ERC20_increaseAllowance) {
                subTypeTitleLeft = this.amountFormat(amount) + '\u00a0\u00a0\u00a0' + name;
                subTypeTitleLeftMaxWidth = 400;
                subTypeTitleRight = '';
                subTypeTag = 'increaseAllowance';
                subTypeDesc = 'After approval, this address can spend approved ' + this.amountFormat(amount) + '\u00a0' + name + ', if you’re not sure please abort.'
            } else if (sub_type === Approve_ERC721_approve) {
                subTypeTitleLeft = name
                subTypeTitleLeftMaxWidth = 300;
                subTypeTitleRight = '\u00a0\u00a0\u00a0' + token_id;
                subTypeTitleRightMaxWidth = 120;
                subTypeTag = 'Approve';
                subTypeDesc = 'After approval, this address can transfer the NFT, if you\'re not sure please abort.'
            } else if (sub_type === Approve_ERC721_setApprovalForAll) {
                subTypeTitleLeft = 'All NFTs in' + '\u00a0\u00a0\u00a0' + name;
                subTypeTitleLeftMaxWidth = 400;
                subTypeTitleRight = '';
                subTypeTag = 'SetApproveForAll';
                subTypeDesc = 'After approval, this address can transfer all of your NFTs in ' + name +' collection, if you are not sure please abort.';
            }
        }

        return (
            <div className='foxeye-content-body'>
                <div className='modal-wrap'>
                    <div className='modal-top' style={{backgroundColor: bgColor}}>
                        <img src={chrome.runtime.getURL('/images/img_alert_logo.png')} className='foxeye-logo'/>
                        <img src={chrome.runtime.getURL('/images/' + picUrl +'.png')} className='alert-type-img'/>
                    </div>
                    <div className='modal-bottom'>
                        {subTypeDesign ? (
                            <div className='approve-wrap'>
                                <div className='foxeye-subtype-top-wrap'>
                                    <div className='foxeye-subtype-top-ellipsis' style={{ maxWidth: subTypeTitleLeftMaxWidth }}>
                                        {subTypeTitleLeft}
                                    </div>
                                    <div className='foxeye-subtype-top-ellipsis'  style={{ maxWidth: subTypeTitleRightMaxWidth }}>
                                        {subTypeTitleRight}
                                    </div>
                                </div>
                                <img className='foxeye-subtype-arrow-top' src={icArrowTop}/>
                                <div className='foxeye-subtype-type-text'>
                                    {subTypeTag}
                                </div>
                                <img className='foxeye-subtype-arrow-bottom' src={icArrowBottom}/>
                                <div className='foxeye-subtype-contract-wrap'>
                                    <div className='foxeye-subtype-contract'>
                                        Contract
                                    </div>
                                    <div className='foxeye-subtype-contract-address'>
                                        {subTypeContractAddress}
                                    </div>
                                </div>
                                <div className='foxeye-subtype-desc'>
                                    {subTypeDesc}
                                </div>
                            </div>
                        ) : (
                            <div className='no-approve-wrap'>
                                <div className='modal-title' style={{color: type === RiskType_SwapMediumRiskToken && '#F6851B' }}>
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
                                <div style={{width: '100%', height: '100%', overflowY: "hidden", overflowX: 'hidden' }}>
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
