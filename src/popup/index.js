import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter, Route, Routes, Navigate} from 'react-router-dom'
import Home from './home'
import Setting from './setting'
import Detection from './detection'
import About from "./about";
import '../css/popup.css'
import '../css/common.css'

function Popup() {
    return (
        <div className='popup-base'>
            <HashRouter>
                <Routes>
                    <Route exact path="/home" element={<Home />} />
                    <Route exact path="/setting" element={<Setting />} />
                    <Route exact path="/detection" element={<Detection />} />
                    <Route exact path="/about" element={<About />} />
                    <Route path="*" element={<Navigate to='/home' />} />
                </Routes>
            </HashRouter>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('popup-root'))
root.render(<Popup />)
