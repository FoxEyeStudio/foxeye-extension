import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import Home from './home'
import Setting from './setting'
import Detection from './detection'
import titleLogo from "../../public/images/title_logo.png";
import aboutIcon from "../../public/images/ic_about.png";
import aboutHoverIcon from "../../public/images/ic_about_hover.png";
import '../css/popup.css'
import '../css/common.css'

function Popup() {
    return (
        <div className='popup-base'>
            <div className='title-wrap'>
                <img src={titleLogo} className='title-logo' />
                <div style={{ '--ic-about-normal': 'url(' + aboutIcon + ')', '--ic-about-hover': 'url(' + aboutHoverIcon + ')'}} className='title-about'/>
            </div>
            <HashRouter>
                <Routes>
                    <Route exact path="/home" element={<Home />} />
                    <Route exact path="/setting" element={<Setting />} />
                    <Route exact path="/detection" element={<Detection />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </HashRouter>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Popup />)
