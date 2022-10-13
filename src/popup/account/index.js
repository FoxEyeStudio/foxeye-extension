import React, {useEffect, useState} from "react";
import '../../css/common.css'
import '../../css/account.css'
import titleLogo from "../../images/title_logo.png";
import aboutIcon from "../../images/ic_about.png";
import aboutHoverIcon from "../../images/ic_about_hover.png";
import {useLocation, useNavigate} from "react-router-dom";
import backIcon from "../../images/ic_back.png";
import backHoverIcon from "../../images/ic_back_hover.png";
import imgCheckboxDefault from "../../images/img_checkbox_default.png";
import imgCheckboxSelected from "../../images/img_checkbox_selected.png";
import {iLocal, STORAGE_RECENT_ACCOUTS, STORAGE_SELECTED_ACCOUT} from "../../common/utils";

function Account() {
    const navigate = useNavigate()
    const [accountList, setAccountList] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState();
    const { state } = useLocation();

    useEffect(() => {
        chrome.storage.local.get(STORAGE_RECENT_ACCOUTS, function (result) {
            let accountData;
            if (result && result[STORAGE_RECENT_ACCOUTS]) {
                accountData = result[STORAGE_RECENT_ACCOUTS];
            }
            if (accountData) {
                const accounts = accountData.split(',');
                const accountArray = [];
                for (let i = accounts.length - 1 ; i >= 0; i--) {
                    if (accountArray.indexOf(accounts[i].toLowerCase()) === -1) {
                        accountArray.push(accounts[i].toLowerCase());
                    }
                }
                chrome.storage.local.get(STORAGE_SELECTED_ACCOUT, function (selResult) {
                    setAccountList(accountArray);
                    if (selResult && selResult[STORAGE_SELECTED_ACCOUT]) {
                        setSelectedAccount(selResult[STORAGE_SELECTED_ACCOUT]);
                    } else {
                        setSelectedAccount(accountArray[0]);
                    }
                })
            }
        });
    }, []);

    const getAccountItem = item => {
        const checkboxImg = item === selectedAccount ? imgCheckboxSelected : imgCheckboxDefault;
        return (
            <div className='recent-account-item-base' key={item}>
                <div className='recent-account-item-wrap' onClick={() => {
                    setSelectedAccount(item);
                    chrome.storage.local.set({ [STORAGE_SELECTED_ACCOUT]: item });
                }}>
                    <img className='recent-account-item-checkbox' src={checkboxImg}/>
                    <div className='recent-account-item-address'>
                        {item.substr(0, 2) + item.toUpperCase().substr(2, 14) + '...' + item.toUpperCase().substr(-12)}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-col' style={{height: '100%'}}>
            <div className='title-wrap'>
                <img src={titleLogo} className='title-logo' />
                <div style={{ '--ic-about-normal': 'url(' + aboutIcon + ')', '--ic-about-hover': 'url(' + aboutHoverIcon + ')'}} className='title-about' onClick={()=>{navigate('/about', {state: {from: 'account', to: state?.from}})}}/>
            </div>
            <div className="token-detection-title flex-row align-center">
                <div className="back-img" style={{ '--ic-back-normal': 'url(' + backIcon + ')', '--ic-back-hover': 'url(' + backHoverIcon + ')'}} onClick={()=>{
                    if (state) {
                        const stateNext = state.to || state.from;
                        if (stateNext === 'account') {
                            navigate('/home')
                        } else {
                            navigate('/' + stateNext, {state: { account: selectedAccount }})
                        }
                    } else {
                        navigate('/home')
                    }

                    if (state && state.to) {

                    } else if (state && state.from && state.from){

                    }
                }}/>
                <span className="detection-text">{iLocal('Recent_Accounts')}</span>
            </div>
            <div className='recent-account-desc'>
                {iLocal('Recent_Accounts_Desc')}
            </div>

            <div className='recent-account-scroll-div'>
                {accountList.map(item => getAccountItem(item))}
            </div>
        </div>
    )
}

export default Account;
