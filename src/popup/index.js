import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter, Route, Routes, Navigate} from 'react-router-dom'
import Home from './home'
import Setting from './setting'
import Detection from './detection'
import About from "./about";
import Guide from "./guide";
import '../css/popup.css'
import '../css/common.css'

function Popup(props) {
    return (
        <div className='popup-base'>
            <HashRouter>
                <Routes>
                    <Route exact path="/home" element={<Home />} />
                    <Route exact path="/setting" element={<Setting />} />
                    <Route exact path="/detection" element={<Detection />} />
                    <Route exact path="/about" element={<About />} />
                    <Route exact path="/guide" element={<Guide />} />
                    <Route path="*" element={<Navigate to={props.initPage} />} />
                </Routes>
            </HashRouter>
        </div>
    )
}

chrome.storage.local.get('popup-guide-end', function(items){
    const guideEnd = items['popup-guide-end'];
    let initPage = '/guide'
    if (guideEnd) {
        initPage = '/home';
    }
    const root = ReactDOM.createRoot(document.getElementById('popup-root'))
    root.render(<Popup initPage={initPage}/>)
});

