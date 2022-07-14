import React, {useState} from "react";
import '../../css/detection.css'
import '../../css/common.css'
import backIcon from "../../../public/images/ic_back.png";
import backHoverIcon from "../../../public/images/ic_back_hover.png";
import searchIcon from "../../../public/images/ic_search.png";
import searchHoverIcon from "../../../public/images/ic_search_hover.png";
import detectionImg from "../../../public/images/img_detection.png";
import downIcon from "../../../public/images/ic_down.png";

import {useNavigate} from "react-router-dom";


function Detection() {
    const [inputValue, setInputValue] = useState('');
    const [chainSelector, setChainSelector] = useState(false);
    const navigate = useNavigate()
    const chainArray = ['Ethereum', 'BSC', 'Polygon', 'Arbitrum']
    const [currentChain, setCurrentChain] = useState(chainArray[0]);

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleSubmit = (event) => {
        alert('A name was submitted: ' + inputValue);
        event.preventDefault();
    }

    return (
        <div className='flex-col' onClick={() => {
            if (chainSelector) {
                setChainSelector(false);
            }
        }}>
            <div className="detection-wrap flex-col">
                <div className="token-detection-title flex-row align-center">
                    <div className="back-img" style={{ '--ic-back-normal': 'url(' + backIcon + ')', '--ic-back-hover': 'url(' + backHoverIcon + ')'}} onClick={()=>{navigate('/home')}}/>
                    <span className="detection-text">Token&nbsp;Detection</span>
                </div>
                <div className="search-wrap flex-row">
                    <div className="chain-wrap flex-row" onClick={() => {setChainSelector(true)}}>
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
                                placeholder='Enter&nbsp;token&nbsp;contract&nbsp;address'
                                className='edit-text'
                                type="text"
                                value={inputValue}
                                onChange={handleChange}
                            />
                        </form>
                        <div className="search-img" style={{ '--ic-search-normal': 'url(' + searchIcon + ')', '--ic-search-hover': 'url(' + searchHoverIcon + ')'}} onClick={handleSubmit}></div>
                    </div>
                </div>
                <iframe src="https://gopluslabs.io/token-security/56/0x27B880865395DA6cdA9C407E5eDFCc32184CF429" style={{width:600, height:600, overflowX: 'hidden', overflowY: 'auto'}}></iframe>
                <div className='security-no-info-wrap flex-col align-center'>
                    <img src={detectionImg} className='search-no-info-img'/>
                    <div className="search-no-info-text">Full&nbsp;security&nbsp;report&nbsp;for&nbsp;any&nbsp;token</div>
                </div>

                {
                    chainSelector && (
                        <div className="chain-select-wrap flex-col">
                            {
                                chainArray.map((chain, index) => {
                                    return (
                                        <div className='flex-col' key={'chain-' + index} onClick={() => {
                                            setCurrentChain(chain);
                                        }}>
                                            <div className="chain-select-item">{chain}</div>
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
