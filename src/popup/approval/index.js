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
import Lottie from "react-lottie";
import {LoadingJson} from "../../common/utils";
import {ethers} from "ethers";
import {BscId, EthereumId} from "../../background/RiskCenter";

function Approval() {
    const navigate = useNavigate();
    const { state: { account } } = useLocation();
    const [loading, setLoading] = useState(true);
    const [approvals, setApprovals] = useState([]);

    useEffect(() => {
        if (!ethers.utils.isAddress(account)) {
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
                <div className='flex-col' style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: "relative"}}>
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
            {!loading && ethers.utils.isAddress(account) && (
                <div className='approval-scroll-div'>
                    <div className='approval-top-wrap'>
                        <div className='approval-top-address-wrap'>
                            <img src={ic_account} className='approval-top-address-icon'/>
                            <div className='approval-top-address'>{account.substring(0, 6) + '...' + account.substring(account.length-4)}</div>
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
                </div>
            )}
        </div>
    );
}

export default Approval;
