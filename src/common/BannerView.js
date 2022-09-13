import React, { Component } from 'react';
import '../css/banner.css'

export default class BannerView extends Component {

    componentDidMount() {
        const { adList } = this.props;
        const adListLength = adList.length;
        if (adListLength === 1) {
            return;
        }

        let img_box = document.querySelector('.banner-img-box');
        let imgLength = adListLength + 2;
        let index = 0;
        let timer = null;
        let imgContainerW = 325;
        img_box.style.width = imgContainerW * imgLength + 'px'
        img_box.style.left = 0 + 'px';

        function swapImg() {
            img_box.style.left = -index * imgContainerW + 'px';
        }

        function swapFormat() {
            index++;
            if (index >= adListLength) {
                index = adListLength;
                img_box.style.transition = 'all, linear, 1.5s';
                img_box.style.left = -index * imgContainerW + 'px';
                setTimeout(function() {
                    index = 0;
                    img_box.style.transition = '';
                    swapImg();
                }, 1500)
            } else {
                img_box.style.transition = 'all, linear, 1.5s';
                swapImg();
            }
        }

        timer = setInterval(swapFormat, 3000)
    }

    goLink = url => {
        chrome.tabs.create({url});
    }

    render() {
        const { adList } = this.props;
        return (
            <div className="banner-container">
                {adList.length === 1 ? (
                    <img src={adList[0].img} className='ad-airdrop' onClick={() => this.goLink(adList[0].url)}/>
                ) : (
                    <ul className="banner-img-box">
                        <li><img src={adList[adList.length - 1].img} onClick={() => this.goLink(adList[adList.length - 1].url)}/></li>
                        {adList.map((item, index) => <li key={'adlist-item-' + index}><img src={item.img} className='ad-airdrop' onClick={() => this.goLink(item.url)}/></li>)}
                        <li><img src={adList[0].img} className='ad-airdrop' onClick={() => this.goLink(adList[0].url)}/></li>
                    </ul>
                )}

            </div>
        )
    }
}
