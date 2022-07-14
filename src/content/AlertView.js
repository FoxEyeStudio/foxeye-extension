import React, { Component } from 'react';

export default class AlertView extends Component {

    render() {
        return (
            <div className='foxeye-content-body'>
                <div className='modal-wrap'>
                    <div className='modal-top'>
                        <img src={chrome.runtime.getURL('/images/img_modal_logo.png')} className='foxeye-logo'/>
                        <img src={chrome.runtime.getURL('/images/img_modal_phishing.png')} className='alert-type-img'/>
                    </div>
                    <div className='modal-bottom'>
                        <div className='modal-title'>
                            Phishing Website
                        </div>
                        <div className='address-and-host'>
                            www.w2dslhdashp.io
                        </div>
                        <div className='alert-desc'>
                            The website is blacklisted by FoxEye. Continuing browsing may cause asset loss.
                        </div>
                        <div className={'foxeye-content-abort'}>
                            Abort
                        </div>
                        <div className='continue-btn'>
                            Continue
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
