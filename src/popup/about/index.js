import React, {useEffect, useState} from "react";
import '../../css/common.css'
import '../../css/about.css'
import {useNavigate, useLocation} from "react-router-dom";
import titleLogo from "../../images/title_logo.png";
import backIcon from "../../images/ic_back.png";
import backHoverIcon from "../../images/ic_back_hover.png";
import aboutLogo from "../../images/img_about_logo.png"
import icAboutGuide from "../../images/ic_about_guide.png"
import icAboutWebsite from "../../images/ic_about_website.png"
import icArrow from "../../images/ic_arrow.png"

function About() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [version, setVersion] = useState('');

    function getVersion() {
        chrome.storage.local.get('app_version', function (result) {
            const version = result['app_version'];
            setVersion(version);
        });
    }

    useEffect(() => {
        getVersion();
    }, []);

    return (
        <div className='flex-col' style={{height: '100%'}}>
            <div className='title-wrap'>
                <img src={titleLogo} className='title-logo' />
            </div>
            <div className="token-detection-title flex-row align-center">
                <div className="back-img" style={{ '--ic-back-normal': 'url(' + backIcon + ')', '--ic-back-hover': 'url(' + backHoverIcon + ')'}} onClick={()=>{navigate('/' + state.from, { state })}}/>
                <span className="detection-text">About</span>
            </div>
            <img src={aboutLogo} className='about-logo-img'/>
            <div className='about-protector'>
                Metamask Protector
            </div>
            <div className='about-version-name'>
                {version}
            </div>
            <div className='flex-full'/>
            <div className='about-line'></div>
            <div className='about-item' onClick={() => {
                chrome.tabs.create({url: 'https://foxeye.io/'});
            }}>
                <img className='about-item-img' src={icAboutWebsite}/>
                <div className='about-item-title'>
                    Official website
                </div>
                <img className='about-item-arrow' src={icArrow}/>
            </div>
            <div className='about-line'></div>
            <div className='about-item' onClick={()=>{navigate('/guide', {state: {from: 'about', to: state.from}})}}>
                <img className='about-item-img' src={icAboutGuide}/>
                <div className='about-item-title'>
                    User Guide
                </div>
                <img className='about-item-arrow' src={icArrow}/>
            </div>
            <div className='about-line' style={{ marginBottom: 60 }}></div>
        </div>
    )
}

export default About;
