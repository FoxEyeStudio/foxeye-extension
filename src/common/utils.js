import {RiskType_Safe} from "../background/RiskCenter";
import ic_other_tag from "../images/ic_other_tag.png";
import ic_eth_tag from "../images/ic_eth_tag.png";
import ic_bsc_tag from "../images/ic_bsc_tag.png";
import ic_okc_tag from "../images/ic_okc_tag.png";
import ic_heco_tag from "../images/ic_heco_tag.png";
import ic_polygon_tag from "../images/ic_polygon_tag.png";
import ic_arb_tag from "../images/ic_arb_tag.png";
import ic_avax_tag from "../images/ic_avax_tag.png";
import ic_fantom_tag from "../images/ic_fantom_tag.png";
import CryptoJS from "crypto-js";

export const PhishingWebsites = 'phishing-websites-switch';
export const MaliciousContract = 'malicious-contract-switch';
export const TokenSafety = 'token-safety-switch';
export const TargetCorrectness = 'target-correctness-switch';
export const ApproveReminder = 'approve-reminder-switch';

export const SWITCH_ALERT_ID = [PhishingWebsites, MaliciousContract, TokenSafety, TargetCorrectness, ApproveReminder];

export const STORAGE_INTERCEPTED_AMOUNT = 'storage-intercepted-amount';

export const STORAGE_SECURITY_STATISTIC_AMOUNT = 'storage-security-statistic';

export const STORAGE_RECENT_ACCOUTS = 'storage-recent-accouts';

export const STORAGE_SELECTED_ACCOUT = 'storage-selected-accout';

export async function getTokenInfo(chainId, tokenAddress) {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
        };
        const url = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${tokenAddress}`;

        let result = await fetch(url, options).then(ret => ret.json()).catch(err => {
            return undefined;
        });
        if (result && result.code == '1') {
            return result.result;
        }
    } catch (e) {
    }
    return undefined;
}

export async function getCoingeckoInfo(chainId, tokenAddress) {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            },
        };
        let chainName = 'ethereum';
        if (chainId == 1) {
            chainName = 'ethereum';
        } else if (chainId == 56) {
            chainName = 'binance-smart-chain';
        } else if (chainId == 66) {
            chainName = 'okex-chain';
        } else if (chainId == 128) {
            chainName = 'huobi-token';
        } else if (chainId == 137) {
            chainName = 'polygon-pos';
        } else if (chainId == 42161) {
            chainName = 'arbitrum-one';
        } else if (chainId == 43114) {
            chainName = 'avalanche';
        } else if (chainId == 250) {
            chainName = 'fantom';
        }
        const url = 'https://api.coingecko.com/api/v3/coins/' + chainName + '/contract/' + tokenAddress.toLowerCase()

        let result = await fetch(url, options).then(ret => ret.json()).catch(err => {
            return undefined;
        });
        if (result) {
            let info = {coingeckoLink: '', tokenLogo: ''};
            if (result.id) {
                info = {...info, coingeckoLink: 'https://www.coingecko.com/en/coins/' + result.id}
            }
            if (result.image) {
                if (result.image['large']) {
                    info = { ...info, tokenLogo: result.image['large']};
                } else  if (result.image['thumb']) {
                    info = { ...info, tokenLogo: result.image['thumb']};
                } else if (result.image['small']) {
                    info = { ...info, tokenLogo: result.image['small']};
                }
            }
            return info;
        }
    } catch (e) {
    }
    return undefined;
}

export const LoadingJson = {"v":"5.7.11","fr":25,"ip":21,"op":45,"w":70,"h":70,"nm":"test","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"waiting","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":8.808,"s":[100]},{"t":11.345703125,"s":[100]}],"ix":11},"r":{"a":1,"k":[{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":12.615,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":32.923,"s":[360]},{"t":51.9619140625,"s":[1020]}],"ix":10},"p":{"a":0,"k":[35,35,0],"ix":2,"l":2},"a":{"a":0,"k":[0.828,-1.117,0],"ix":1,"l":2},"s":{"a":0,"k":[23.3,23.3,100],"ix":6,"l":2}},"ao":0,"shapes":[{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[247.375,247.375],"ix":2},"p":{"a":0,"k":[0,0],"ix":3},"nm":"椭圆路径 1","mn":"ADBE Vector Shape - Ellipse","hd":false},{"ty":"st","c":{"a":0,"k":[0.007843137255,0.490196078431,0.835294117647,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":20,"ix":5},"lc":1,"lj":1,"ml":4,"bm":0,"nm":"描边 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[0.828,-1.117],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"变换"}],"nm":"椭圆 1","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.667],"y":[0.714]},"o":{"x":[0.333],"y":[0]},"t":12.615,"s":[0]},{"i":{"x":[0.667],"y":[1]},"o":{"x":[0.333],"y":[-0.268]},"t":32.923,"s":[89.6]},{"t":51.9619140625,"s":[0]}],"ix":1},"e":{"a":1,"k":[{"i":{"x":[0.833],"y":[1]},"o":{"x":[0.333],"y":[0]},"t":12.615,"s":[100]},{"t":32.9228515625,"s":[100]}],"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":2,"nm":"修剪路径 1","mn":"ADBE Vector Filter - Trim","hd":false}],"ip":0,"op":125,"st":0,"bm":0}],"markers":[]};

const configKey = '';

export const AesDecrypt = (text, key = configKey) => {
    var content = CryptoJS.AES.decrypt(text, key);
    return content.toString(CryptoJS.enc.Utf8);
};

export const AesEncrypt = (text, key = configKey) => {
    var content = CryptoJS.AES.encrypt(text, key);
    return content.toString();
}
