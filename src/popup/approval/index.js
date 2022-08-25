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
import Lottie from "react-lottie";
import {LoadingJson} from "../../common/utils";
import {ethers} from "ethers";
import {BscId, EthereumId} from "../../background/RiskCenter";
import BigNumber from "bignumber.js";

function Approval() {
    const navigate = useNavigate();
    const { state: { account } } = useLocation();
    const [loading, setLoading] = useState(true);
    const [approvals, setApprovals] = useState([]);

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
            return amount;
        }
        try {
            let b = new BigNumber(amount);
            b = b.dp(2);
            return b.toString(10);
        } catch (e) {
            return amount;
        }
        vv.approved_amount == 'Unlimited' ? 'Unlimited' : new BigNumber()
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
                <div style={{ '--ic-about-normal': 'url(' + aboutIcon + ')', '--ic-about-hover': 'url(' + aboutHoverIcon + ')'}} className='title-about' onClick={()=>{navigate('/about', {state: {from: 'approval'}})}}/>
            </div>
            <div className="token-detection-title flex-row align-center">
                <div className="back-img" style={{ '--ic-back-normal': 'url(' + backIcon + ')', '--ic-back-hover': 'url(' + backHoverIcon + ')'}} onClick={()=>{navigate('/home')}}/>
                <span className="detection-text">Approvals Management</span>
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
                    <div className='approval-scanning flex-col'>Scanning...</div>
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
                                <div className='approval-top-type-value'>Tokens</div>
                            </div>
                            <div className='approval-top-type-wrap'>
                                <div className='approval-top-data-value'>{contracts}</div>
                                <div className='approval-top-type-value'>Contracts</div>
                            </div>
                            <div className='approval-top-type-wrap'>
                                <div className='approval-top-data-value'>{chains}</div>
                                <div className='approval-top-type-value'>Chains</div>
                            </div>
                        </div>
                    </div>
                    <div className='approval-list-wrap'>
                        <div className='approval-list-title'>List of Approved Tokens</div>
                        <div className='approval-list-title-desc'>Approving unknown dapp leads to security risks. Please check regularly!</div>
                        {approvals.map((v, i, a) => (
                            <div>
                                <div className='approval-list-line'/>
                                <div className='approval-list-item-title-wrap'>
                                    <div>
                                        <img src={`https://relayer.gopocket.finance/api/v1/getImage/${v.chain_id}/${v.token_address}`} className='approval-list-item-icon'/>
                                        <img src={tagImage(v.chain_id)} className='approval-list-item-tag'/>
                                    </div>
                                    <div className='approval-list-item-token-name'>{v.token_symbol}</div>
                                    <div className='approval-list-item-spender-amount'>{v.approved_list.length} Approval(s)</div>
                                </div>
                                {v.approved_list.map((vv, ii, aa) => (
                                    <div>
                                        <div className='approval-list-item-spender-name'>{vv.address_info?.tag ? vv.address_info.tag : vv.address_info?.contract_name ? vv.address_info.contract_name : 'unknown'}</div>
                                        <div className='approval-list-item-spender-wrap'>
                                            <div className='approval-list-item-spender-title'>Spender</div>
                                            <div className='approval-list-item-spender-content'>{vv.approved_contract.substring(0, 14) + '...' + vv.approved_contract.substring(vv.approved_contract.length-14)}</div>
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
                                        <div className='approval-list-item-spender-wrap'>
                                            <div className='approval-list-item-spender-title'>Allowance</div>
                                            <div className='approval-list-item-spender-content'>{amountFormat(vv.approved_amount)}</div>
                                            <img src={ic_about_hover} className='approval-list-item-spender-link' onClick={
                                                () => {
                                                    let url = `https://etherscan.io/address/${vv.approved_contract}`;
                                                    if (v.chain_id == BscId) {
                                                        url = `https://bscscan.com/address/${vv.approved_contract}`;
                                                    }
                                                    chrome.tabs.create({url});
                                                }
                                            }/>
                                        </div>
                                        <div className='approval-list-item-spender-wrap'>
                                            <div className='approval-list-item-spender-title'>Time</div>
                                            <div className='approval-list-item-spender-content'>{timeFormat(vv.approved_time)}</div>
                                        </div>
                                        {(ii < v.approved_list.length - 1) && (<div className='approval-list-line-16px'/>)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Approval;
