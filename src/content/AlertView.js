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
import {iLocal, isCN, LoadingJson} from "../common/utils";
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
        if (window.location?.href?.includes('https://foxeye.io/risk-demo')) {
            this.clickAbort();
            return;
        }
        this.props.hideContainer && this.props.hideContainer();
        postMessage({foxeye_extension_action: 'foxeye_alert_callback', action: 'continue'});
    }

    amountFormat = num => {
        num = Number(num);
        const p = Math.floor(Math.log(num) / Math.LN10);
        if (Math.abs(p) > 10) {
            const n = num * (10 ** -p);
            if (p > 0) {
                return `${n}e+${p}`;
            } else {
                return `${n}e${p}`;
            }
        }
        if (p >= 0) {
            let length = 0;
            if (String(num).indexOf('.') !== -1) {
                const dotIndex = String(num).indexOf('.') + 1;   //小数点的位置
                length = String(num).length - dotIndex;  //小数的位数
            }
            let mon = num.toFixed(length)
            if (length > 5) {
                mon = num.toFixed(5)
            }
            const reg = /(\d)(?=(\d{3})+\.)/g
            return mon.replace(reg, ($0, $1) => $1 + ',')
        }
        return num;
    }

    render() {
        if (this.props.toast) {
            let imgUrl = this.props.success ? '/images/success.gif' : '/images/detecting.gif'
            if (isCN()) {
                imgUrl = this.props.success ? '/images/success_cn.gif' : '/images/detecting_cn.gif'
            }
            return (
                <img className='foxeye-alert-toast' src={chrome.runtime.getURL(imgUrl)} />
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
            title = iLocal('Phishing_Website');
            targetContent = url;
            errorDesc = iLocal('Phishing_Website_desc');
        } else if (type === RiskType_MaliciousContract) {
            picUrl = 'img_alert_malicious';
            title = iLocal('Malicious_Contract');
            errorDesc = iLocal('Malicious_Contract_desc');
        } else if (type === RiskType_MaliciousAddress) {
            picUrl = 'img_alert_malicious';
            title = iLocal('Malicious_Address');
            errorDesc = iLocal('Malicious_Address_desc');
        } else if (type === RiskType_TransferToContract) {
            // picUrl = '';
            // title = '';
            // errorDesc = '';
        } else if (type === RiskType_SwapHighRiskToken) {
            picUrl = 'img_alert_highrisk';
            title = iLocal('High_Risk_Token');
            errorDesc = iLocal('High_Risk_Token_Desc');
        } else if (type === RiskType_SwapMediumRiskToken) {
            picUrl = 'img_alert_midrisk';
            title = iLocal('Mid_Risk_Token');
            errorDesc = iLocal('Mid_Risk_Token_Desc');
            bgColor = '#FFA354';
        } else if (type === RiskType_ApproveEOA) {
            picUrl = 'img_alert_wrong';
            title = iLocal('Wrong_Target');
            errorDesc = iLocal('Wrong_Target_Desc');
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
                subTypeTag = iLocal('Approve');
                subTypeDesc = iLocal('Approve_Desc', [this.amountFormat(amount), name]);
            } else if (sub_type === Approve_ERC20_increaseAllowance) {
                subTypeTitleLeft = this.amountFormat(amount) + '\u00a0\u00a0\u00a0' + name;
                subTypeTitleLeftMaxWidth = 400;
                subTypeTitleRight = '';
                subTypeTag = iLocal('increaseAllowance');
                subTypeDesc = iLocal('increaseAllowance_Desc', [this.amountFormat(amount), name])
            } else if (sub_type === Approve_ERC721_approve) {
                subTypeTitleLeft = name
                subTypeTitleLeftMaxWidth = 300;
                subTypeTitleRight = '\u00a0\u00a0\u00a0' + token_id;
                subTypeTitleRightMaxWidth = 300;// no limit
                subTypeTag = iLocal('Approve');
                subTypeDesc = iLocal('Approve_Nft_Desc');
            } else if (sub_type === Approve_ERC721_setApprovalForAll) {
                subTypeTitleLeft = 'All NFTs in' + '\u00a0\u00a0\u00a0' + name;
                subTypeTitleLeftMaxWidth = 400;
                subTypeTitleRight = '';
                subTypeTag = iLocal('SetApproveForAll');
                subTypeDesc = iLocal('SetApproveForAll_Desc', [name]);
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
                                        {iLocal('Contract')}
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
                                        {iLocal('Check_Report')}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={'foxeye-content-abort'} onClick={this.clickAbort}>
                            {iLocal('Abort')}
                        </div>
                        <div className='continue-btn' onClick={this.clickContinue}>
                            {iLocal('Continue')}
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
