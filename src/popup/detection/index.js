import React, {useState} from "react";
import Lottie from 'react-lottie'
import '../../css/detection.css'
import '../../css/common.css'
import backIcon from "../../images/ic_back.png";
import backHoverIcon from "../../images/ic_back_hover.png";
import searchIcon from "../../images/ic_search.png";
import searchHoverIcon from "../../images/ic_search_hover.png";
import detectionImg from "../../images/img_detection.png";
import downIcon from "../../images/ic_down.png";

import {useLocation, useNavigate} from "react-router-dom";
import titleLogo from "../../images/title_logo.png";
import aboutIcon from "../../images/ic_about.png";
import aboutHoverIcon from "../../images/ic_about_hover.png";
import {iLocal, LoadingJson} from "../../common/utils";
import TokenView from "../../common/TokenView";
import '../../css/token.css'

function Detection() {
    const EthereumId = 1;
    const PolygonId = 137;
    const ArbitrumId = 42161;
    const BscId = 56;
    const AvalancheId = 43114;
    const HecoId = 128;
    const FtmId = 250;
    const OkcId = 66;

    const { state: { account, from } } = useLocation();
    const [inputValue, setInputValue] = useState('');
    const [chainSelector, setChainSelector] = useState(false);
    const navigate = useNavigate();
    const chainArray = ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Avalanche', 'Heco', 'Ftm', 'Okc'];
    const chainIdArray = [EthereumId, BscId, PolygonId, ArbitrumId, AvalancheId, HecoId, FtmId, OkcId];
    const [currentChain, setCurrentChain] = useState(chainArray[0]);
    const [tokenInfo, setTokenInfo] = useState();
    const [loading, setLoading] = useState(false);
    const [noFound, setNoFound] = useState(false);
    const [hoverChainSelector,setHoverChainSelector ] = useState(false);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!inputValue) {
            return;
        }
        setTokenInfo(undefined);
        setNoFound(false);
        setLoading(true);
        const tokenAddress = inputValue;
        let chainId = 1;
        chainArray.forEach((item, index) => {
            if (item === currentChain) {
                chainId = chainIdArray[index];
            }
        })
        chrome.runtime.sendMessage({foxeye_extension_action: "foxeye_get_token_info", chainId, tokenAddress, account}, result => {
            if (result && result[tokenAddress.toLowerCase()]) {
                setLoading(false);
                const tokenInfo = {...result[tokenAddress.toLowerCase()], tokenAddress, token_id: chainId}
                setTokenInfo(tokenInfo);
            } else {
                setLoading(false);
                setNoFound(true);
            }
        });  //send to background.js
    }

    return (
        <div className='flex-col' style={{height: '100%'}} onClick={() => {
            if (chainSelector) {
                setChainSelector(false);
                setHoverChainSelector(false);
            }
        }}>
            <div className='title-wrap'>
                <img src={titleLogo} className='title-logo' />
                <div style={{ '--ic-about-normal': 'url(' + aboutIcon + ')', '--ic-about-hover': 'url(' + aboutHoverIcon + ')'}} className='title-about' onClick={()=>{navigate('/about', {state: {from: 'detection'}})}}/>
            </div>
            <div className="detection-wrap flex-col flex-full" >
                <div className="token-detection-title flex-row align-center">
                    <div className="back-img" style={{ '--ic-back-normal': 'url(' + backIcon + ')', '--ic-back-hover': 'url(' + backHoverIcon + ')'}} onClick={()=>{
                        if (from == 'earn') {
                            navigate('/earn', {state: { account }})
                        } else {
                            navigate('/home')
                        }
                    }}/>
                    <span className="detection-text">{iLocal('Token_Detection')}</span>
                </div>
                <div className="search-wrap flex-row">
                    <div className={chainSelector ? "chain-wrap flex-row chain-wrap-active" : "chain-wrap flex-row"} onClick={() => {
                        setChainSelector(true);
                        setNoFound(false);
                    }}>
                        <div className="chain-inter flex-row flex-full justify-between align-center">
                            <div className="chain-text">{currentChain}</div>
                            <img
                                className="down-icon"
                                src={downIcon}
                            />
                        </div>
                    </div>

                    <div className="search-inpurt-wrap flex-row align-center justify-center" id='inputWrap'>
                        <form onSubmit={handleSubmit}>
                            <input
                                placeholder='Enter token contract address'
                                className='edit-text'
                                type="text"
                                value={inputValue}
                                onChange={handleChange}
                            />
                        </form>
                        <div className="search-img" style={{ '--ic-search-normal': 'url(' + searchIcon + ')', '--ic-search-hover': 'url(' + searchHoverIcon + ')'}} onClick={handleSubmit}></div>
                    </div>
                </div>
                {!tokenInfo && !loading && (
                    <div className='security-no-info-wrap flex-col align-center'>
                        <img src={detectionImg} className='search-no-info-img'/>
                        <div className="search-no-info-text">{iLocal('Full_security_report')}</div>
                    </div>
                )}

                {!!tokenInfo && !loading && (
                    <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: "relative"}}>
                        <div style={{width: '100%', height: 360, paddingLeft: 16, paddingRight: 16, overflowY: "auto", overflowX: 'hidden' }}>
                            <TokenView token_info={tokenInfo} />
                        </div>
                        <div className='token-view-border'>
                        </div>
                    </div>
                )}

                {loading && (
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

                {noFound && (
                    <div className='token-no-wrap'>
                        {iLocal('Token_not_found')}
                    </div>
                )}

                {
                    chainSelector && (
                        <div className="chain-select-wrap flex-col">
                            {
                                chainArray.map((chain, index) => {
                                    return (
                                        <div className='flex-col' key={'chain-' + index} onClick={() => {
                                            if (currentChain !== chain) {
                                                setTokenInfo(undefined);
                                                setCurrentChain(chain);
                                            }
                                        }} onMouseOver={() => {
                                            if (!hoverChainSelector) {
                                                setHoverChainSelector(true);
                                            }
                                        }}>
                                            <div className="chain-select-item" style={{color: !hoverChainSelector && currentChain === chain && '#027DD5'}}>{chain}</div>
                                            {index !== chainArray.length -1 && <div className="chain-select-item-line"></div>}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Detection;
