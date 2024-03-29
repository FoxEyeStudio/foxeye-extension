import React, {useEffect, useState} from "react";
import '../../css/common.css'
import '../../css/approval.css'
import {useLocation, useNavigate} from "react-router-dom";
import titleLogo from "../../images/title_logo.png";
import aboutIcon from "../../images/ic_about.png";
import aboutHoverIcon from "../../images/ic_about_hover.png";
import backIcon from "../../images/ic_back.png";
import backHoverIcon from "../../images/ic_back_hover.png";
import ic_account from "../../images/ic_account.png";
import ic_eth_tag from "../../images/ic_eth_tag.png";
import ic_bsc_tag from "../../images/ic_bsc_tag.png";
import ic_about_website from "../../images/ic_about_website.png";
import ic_about_hover from "../../images/ic_about_hover.png";
import imgInactive from "../../images/img_inactive.png";
import Lottie from "react-lottie";
import {iLocal, LoadingJson} from "../../common/utils";
import {ethers} from "ethers";
import {BscId, EthereumId} from "../../background/RiskCenter";
import BigNumber from "bignumber.js";

function Approval() {
    const navigate = useNavigate();
    const { state: { account, from } } = useLocation();
    const [loading, setLoading] = useState(true);
    const [approvals, setApprovals] = useState([]);
    const [approvalPopup, setApprovalPopup] = useState(false);

    useEffect(() => {
        if (!ethers.utils.isAddress(account)) {
            setApprovals([]);
            setLoading(false);
            return;
        }
        chrome.runtime.sendMessage({ foxeye_extension_action: 'foxeye_fetch_approvals', account }, result => {
            if (result && result.length > 0) {
                setApprovals(result);
            } else {
                setApprovals([]);
            }
            setLoading(false);
        });
    }, []);

    const tagImage = chain_id => {
        chain_id = parseInt(chain_id);
        switch (chain_id) {
            case EthereumId: return ic_eth_tag;
            case BscId: return ic_bsc_tag;
        }
        return undefined;
    };

    const timeFormat = timestamp => {
        const d = new Date(timestamp * 1000);
        return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    };

    const amountFormat = amount => {
        if (amount == 'Unlimited') {
            return iLocal('Unlimited');
        }
        try {
            let b = new BigNumber(amount);
            b = b.dp(2);
            return b.toString(10);
        } catch (e) {
            return amount;
        }
    };

    const tokens = approvals.length;
    let contracts = 0;
    for (let i = 0; i < approvals.length; i++) {
        contracts += approvals[i].approved_list.length;
    }
    let chains = 0;
    if (approvals.find(item => item.chain_id == EthereumId)) {
        ++chains;
    }
    if (approvals.find(item => item.chain_id == BscId)) {
        ++chains;
    }
    return (
        <div className='flex-col' style={{height: '100%'}}>
            <div className='title-wrap'>
                <img src={titleLogo} className='title-logo' />
                <div style={{ '--ic-about-normal': 'url(' + aboutIcon + ')', '--ic-about-hover': 'url(' + aboutHoverIcon + ')'}} className='title-about' onClick={()=>{navigate('/about', {state: {from: 'approval', account}})}}/>
            </div>
            <div className="token-detection-title flex-row align-center">
                <div className="back-img" style={{ '--ic-back-normal': 'url(' + backIcon + ')', '--ic-back-hover': 'url(' + backHoverIcon + ')'}} onClick={()=>{
                    if (from == 'earn') {
                        navigate('/earn', {state: { account }})
                    } else {
                        navigate('/home')
                    }
                }}/>
                <span className="detection-text">{iLocal('Approvals_Management')}</span>
            </div>
            {loading && (
                <div className='approval-loading-wrap' style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: "relative"}}>
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
                    <div className='approval-scanning flex-col'>{iLocal('Scanning')}</div>
                </div>
            )}
            {!loading && ethers.utils.isAddress(account) && approvals.length > 0 && (
                <div className='approval-scroll-div'>
                    <div className='approval-top-wrap'>
                        <div className='approval-top-address-wrap'>
                            <img src={ic_account} className='approval-top-address-icon'/>
                            <div className='approval-top-address'>{account.substring(0, 8) + '...' + account.substring(account.length-6)}</div>
                        </div>
                        <div className='approval-top-data-wrap'>
                            <div className='approval-top-type-wrap'>
                                <div className='approval-top-data-value'>{tokens}</div>
                                <div className='approval-top-type-value'>{iLocal('Tokens')}</div>
                            </div>
                            <div className='approval-top-type-wrap'>
                                <div className='approval-top-data-value'>{contracts}</div>
                                <div className='approval-top-type-value'>{iLocal('Contracts')}</div>
                            </div>
                            <div className='approval-top-type-wrap'>
                                <div className='approval-top-data-value'>{chains}</div>
                                <div className='approval-top-type-value'>{iLocal('Chains')}</div>
                            </div>
                        </div>
                    </div>
                    <div className='approval-list-wrap'>
                        <div className='approval-list-title'>{iLocal('List_of_Approved_Tokens')}</div>
                        <div className='approval-list-title-desc'>{iLocal('List_of_Approved_Tokens_Desc')}</div>
                        {approvals.map((v, i, a) => (
                            <div key={'approvals-v-' + i}>
                                <div className='approval-list-line'/>
                                <div className='approval-list-item-title-wrap'>
                                    <div>
                                        <img src={`https://relayer.gopocket.finance/api/v1/getImage/${v.chain_id}/${v.token_address}`} className='approval-list-item-icon'/>
                                        <img src={tagImage(v.chain_id)} className='approval-list-item-tag'/>
                                    </div>
                                    <div className='approval-list-item-token-name'>{v.token_symbol}</div>
                                    <div className='approval-list-item-spender-amount'>{iLocal('Approval_Length', [v.approved_list.length])}</div>
                                </div>
                                {v.approved_list.map((vv, ii, aa) => (
                                    <div key={'approved_list-vv-' + ii}>
                                        <div className='approval-list-item-spender-name'>{vv.address_info?.tag ? vv.address_info.tag : vv.address_info?.contract_name ? vv.address_info.contract_name : iLocal('unknown')}</div>
                                        <div className='approval-list-item-spender-wrap'>
                                            <div className='approval-list-item-spender-title'>{iLocal('Contract')}</div>
                                            <div className='approval-list-item-spender-content'>{vv.approved_contract.substring(0, 12) + '...' + vv.approved_contract.substring(vv.approved_contract.length-10)}</div>
                                            <img src={ic_about_website} className='approval-list-item-spender-link' onClick={
                                                () => {
                                                    let url = `https://etherscan.io/address/${vv.approved_contract}`;
                                                    if (v.chain_id == BscId) {
                                                        url = `https://bscscan.com/address/${vv.approved_contract}`;
                                                    }
                                                    chrome.tabs.create({url});
                                                }
                                            }/>
                                        </div>
                                        <div className='approval-list-item-spender-wrap' style={{ marginBottom: 0 }}>
                                            <div className='approval-list-item-spender-title'>{iLocal('Limit')}</div>
                                            <div className='approval-list-item-spender-content'>{amountFormat(vv.approved_amount)}</div>
                                            <img src={ic_about_hover} className='approval-list-item-spender-link' onClick={
                                                () => {
                                                    setApprovalPopup(true);
                                                }
                                            }/>
                                        </div>
                                        <div className='approval-revoke-item-wrap'>
                                            <div className='approval-list-item-spender-wrap' style={{ marginTop: 10 }}>
                                                <div className='approval-list-item-spender-title'>{iLocal('Time')}</div>
                                                <div className='approval-list-item-spender-content'>{timeFormat(vv.approved_time)}</div>
                                            </div>
                                            <div className='approval-revoke-btn' onClick={async () => {
                                                const src = account;
                                                const token = v.token_address;
                                                const spender = vv.approved_contract;
                                                const chainId = v.chain_id;
                                                const logo = `https://relayer.gopocket.finance/api/v1/getImage/${v.chain_id}/${v.token_address}`;
                                                const symbol = v.token_symbol;
                                                const versionObj = await chrome.storage.local.get('app_version');
                                                const app_version = versionObj['app_version'];
                                                const json = {src, token, spender, chainId, logo, symbol, app_version};
                                                let jsonStr = JSON.stringify(json);
                                                const jsonEncode = btoa(jsonStr)
                                                const url = `https://foxeye.io?approval=${jsonEncode}`;
                                                chrome.tabs.create({url});
                                            }}>
                                                {iLocal('Revoke')}
                                            </div>
                                        </div>
                                        {(ii < v.approved_list.length - 1) && (<div className='approval-list-line-16px'/>)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {approvalPopup && (
                <div className='approval-popup-wrap'>
                    <div className='approval-popup-content-wrap'>
                        <div className='approval-popup-content-title'>{iLocal('Token_Approval_Limit')}</div>
                        <div className='approval-popup-content-content'>{iLocal('Token_Approval_Limit_desc')}</div>
                        <div className='approval-popup-content-ok' onClick={() => {
                            setApprovalPopup(false);
                        }}>OK</div>
                    </div>
                </div>
            )}
            {!loading && ethers.utils.isAddress(account) && approvals.length === 0 && (
                <div className='approval-inactive-wrap'>
                    <img className='approval-img-inactive' src={imgInactive} />
                    <div className='approval-inactive-text'>
                        {iLocal('No_contract_has_been_approved')}
                    </div>
                </div>
            )}
            {!account && (
                <div className='approval-inactive-wrap'>
                    <img className='approval-img-inactive' src={imgInactive} />
                    <div className='approval-inactive-text'>
                        {iLocal('Wallet_is_inactive_when_approval')}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Approval;
