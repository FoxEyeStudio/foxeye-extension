import React, {useEffect, useState} from "react";
import '../../css/common.css'
import '../../css/about.css'
import {useNavigate, useLocation} from "react-router-dom";
import titleLogo from "../../../public/images/title_logo.png";
import aboutIcon from "../../../public/images/ic_about.png";
import aboutHoverIcon from "../../../public/images/ic_about_hover.png";
import backIcon from "../../../public/images/ic_back.png";
import backHoverIcon from "../../../public/images/ic_back_hover.png";
import aboutLogo from "../../../public/images/img_about_logo.png"

function About() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [version, setVersion] = useState('');

    function getVersion() {
        var url = chrome.runtime.getURL('manifest.json');
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var manifest = JSON.parse(xhr.response);
            var version = manifest.version;
            setVersion(version);
            // do something here
        };
        xhr.open('GET', url, true);
        xhr.send();
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
                <div className="back-img" style={{ '--ic-back-normal': 'url(' + backIcon + ')', '--ic-back-hover': 'url(' + backHoverIcon + ')'}} onClick={()=>{navigate('/' + state.from)}}/>
                <span className="detection-text">About</span>
            </div>
            <img src={aboutLogo} className='about-logo-img'/>
            <div className='about-version-name'>
                {version}
            </div>
            <div className='flex-full'/>
            <div className='flex-col align-center'>
                <div className='about-protector'>
                    Metamask Protector
                </div>
                <div className='about-link' onClick={() => {
                    chrome.tabs.create({url: 'https://foxeye.io/'});
                }}>
                    FoxEye.io
                </div>
            </div>
        </div>
    )
}

export default About;
