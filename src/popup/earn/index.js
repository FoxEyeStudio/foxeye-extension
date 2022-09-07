import React from "react";
import '../../css/common.css'
import '../../css/setting.css'
import titleLogo from "../../images/title_logo.png";
import aboutIcon from "../../images/ic_about.png";
import aboutHoverIcon from "../../images/ic_about_hover.png";
import {useNavigate} from "react-router-dom";
import backIcon from "../../images/ic_back.png";
import backHoverIcon from "../../images/ic_back_hover.png";

function Earn() {
    const navigate = useNavigate()

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
        </div>
    )
}

export default Earn;
