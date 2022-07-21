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

export const PhishingWebsites = 'phishing-websites-switch';
export const MaliciousContract = 'malicious-contract-switch';
export const TokenSafety = 'token-safety-switch';
export const TargetCorrectness = 'target-correctness-switch';

export const SWITCH_ALERT_ID = [PhishingWebsites, MaliciousContract, TokenSafety, TargetCorrectness];

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
        const url = 'https://api.coingecko.com/api/v3/coins/' + chainName + '/contract/' + tokenAddress

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
