import {AesEncrypt, SWITCH_ALERT_ID} from "../common/utils";

export const RiskType_Safe = 0;
export const RiskType_PhishingWebsite = 1;

export const RiskType_MaliciousContract = 2; // to
export const RiskType_MaliciousAddress = 3; // erc20 transfer to
export const RiskType_ApproveEOA = 4;// erc20 approve to
export const RiskType_TransferToContract = 5;// erc20 transfer to
export const RiskType_SwapHighRiskToken = 6; // buy token on uniswap-like dex
export const RiskType_SwapMediumRiskToken = 7; // buy token on uniswap-like dex
export const RiskType_ApproveNormal = 8; // approve analysis

export const Approve_ERC20_approve = 1;
export const Approve_ERC20_increaseAllowance = 2;
export const Approve_ERC721_approve = 3;
export const Approve_ERC721_setApprovalForAll = 4;

export const Task_TokenDetection = 1;
export const Task_RiskAlert = 2;
export const Task_ExperienceDemo = 3;
export const Task_Approvals = 4;

export const EthereumId = 1;
export const PolygonId = 137;
export const ArbitrumId = 42161;
export const BscId = 56;
export const AvalancheId = 43114;
export const HecoId = 128;
export const FtmId = 250;
export const OkcId = 66;

// export const app_version = 105;

// const api_host = 'http://localhost:6699/v1/';
const api_host = 'https://api.foxeye.io/v1/';
const phishing_website_url = 'https://api.gopluslabs.io/api/v1/phishing_site?url=';
const security_statistic_url = 'http://open-api.gopluslabs.io/api/v1/public/statistic/count?types=TOKEN,DAPP,WEBSITE';

const tag = 'RiskCenter: ';

const g_websites = {

};

class RiskCenter {
    /*
    * method: "eth_sendTransaction"
    * params: Array(1)
    * 0:
    * data: "0x095ea7b3000000000000000000000000d33bd0b0d4abc1c82d46595aa73bdb5e464f0c4600000000000000000000000000000000000000000000000000000000000003e8"
    * from: ""
    * gas: undefined
    * gasPrice: undefined
    * maxFeePerGas: "0x6cbaa11ac"
    * maxPriorityFeePerGas: "0x3B9ACA00"
    * to: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    * */
    // malicious_contract_off, token_safety_off, target_correctness_off
    async parseTransaction(chain_id, transaction, args) {
        console.log(tag, chain_id, transaction);
        const versionObj = await chrome.storage.local.get('app_version');
        const app_version = versionObj['app_version'];
        try {
            const { data, to, from } = transaction;
            const { malicious_contract_off, token_safety_off, target_correctness_off, approve_reminder_off } = args || {};
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    chain_id, data, to, from, app_version, malicious_contract_off, token_safety_off, target_correctness_off, approve_reminder_off
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive'
                },
            };
            const url = `${api_host}parse_tx`;
            let result = await fetch(url, options).then(ret => ret.json()).catch(err => {
                return undefined;
            });
            if (result && result.status == '1') {
                return result.result;
            }
        } catch (e) {
            console.log(tag, chain_id, transaction, e);
        }
        return {
            type: RiskType_Safe
        }
    }

    async parsePhishingWebsite(url, args) {
        const domain = this.getDomain(url);
        console.log(tag, domain, url);
        if (!url?.startsWith('http')) {
            return { url, type: RiskType_Safe };
        }
        if (domain && g_websites[domain]) {
            const { timestamp, type } = g_websites[domain];
            if (timestamp && Date.now() - timestamp < 1 * 60 * 1000) {
                return { url, type }
            }
        }
        const { phishing_website_off } = args || {};
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            }
        };
        const fetch_url = `${phishing_website_url}${url}`;
        let result = await fetch(fetch_url, options).then(ret => ret.json()).catch(err => {
            return undefined;
        });
        const res = {
            url,
            type: RiskType_Safe
        };
        if (result && result.code == 1) {
            if (result['result']['phishing_site'] == 1) {
                res['type'] = RiskType_PhishingWebsite;
            }
            g_websites[domain] = {
                timestamp: Date.now(), type: res['type']
            };
        }
        return res;
    }

    getDomain(_url) {
        let domain;
        try {
            const url = new URL(_url);
            domain = url.hostname;
            if (domain.startsWith('www.')) {
                domain = domain.substr(4);
            } else if (domain.startsWith('m.')) {
                domain = domain.substr(2);
            } else if (domain.startsWith('app.')) {
                domain = domain.substr(4);
            }
        } catch (e) {
        }
        return domain;
    }

    async parseSecurityStatistic() {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            }
        };
        let result = await fetch(security_statistic_url, options).then(ret => ret.json()).catch(err => {
            return undefined;
        });

        if (result && result.code == 1) {
            return result.result;
        }
        return undefined;
    }

    approvalsUrl(chain_id, account) {
        return `https://api.gopluslabs.io/api/v2/token_approval_security/${chain_id}?addresses=${account}`;
    }

    async fetchApprovals(account) {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            }
        };
        let eth_result = await fetch(this.approvalsUrl(EthereumId, account), options).then(ret => ret.json()).catch(err => {
            return undefined;
        });
        let bsc_result = await fetch(this.approvalsUrl(BscId, account), options).then(ret => ret.json()).catch(err => {
            return undefined;
        });
        let result = [];
        if (eth_result && (eth_result.code == 1 || eth_result.code == 2) && eth_result.result && eth_result.result.length > 0) {
            result.push(...eth_result.result);
        }
        if (bsc_result && (bsc_result.code == 1 || bsc_result.code == 2) && bsc_result.result && bsc_result.result.length > 0) {
            result.push(...bsc_result.result);
        }
        return result;
    }

    async taskStat(address, type, _content) {
        try {
            const versionObj = await chrome.storage.local.get('app_version');
            const app_version = versionObj['app_version'];
            let data = JSON.stringify({
                address, type, _content
            });
            data = AesEncrypt(data);
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    data, app_version
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive'
                },
            };
            const url = `${api_host}stat`;
            let result = await fetch(url, options).then(ret => ret.json()).catch(err => {
                return undefined;
            });
            console.log(tag, 'taskStat', result);
        } catch (e) {
            console.log(tag, 'taskStat', e);
        }
    }
}

const riskCenter = new RiskCenter();
export default riskCenter;
