import riskCenter, {Task_TokenDetection} from './RiskCenter'
import {getCoingeckoInfo, getTokenInfo} from "../common/utils";
import {ethers} from "ethers";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.foxeye_extension_action === 'foxeye_sendTransaction') {
        const { chainId, params, args } = request;
        riskCenter.parseTransaction(chainId, params, args).then(result => sendResponse(result));
        return true;
    }

    if (request.foxeye_extension_action === 'foxeye_phishing_website') {
        const { url, args } = request;
        riskCenter.parsePhishingWebsite(url, args).then(result => sendResponse(result));
        return true;
    }

    if (request.foxeye_extension_action === 'foxeye_close_activetab') {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => tabs && tabs.length > 0 ? tabs[0].id : -1).then(tabId => tabId != -1 && chrome.tabs.remove(tabId));
        return true;
    }

    if (request.foxeye_extension_action === 'foxeye_get_token_info') {
        const { chainId, tokenAddress, account } = request;
        getTokenInfo(chainId, tokenAddress).then(result => {
            sendResponse(result);
            if (ethers.utils.isAddress(account)) {
                riskCenter.taskStat(account, Task_TokenDetection, tokenAddress);
            }
        });
        return true;
    }

    if (request.foxeye_extension_action === 'foxeye_get_coingecko_info') {
        const { chainId, tokenAddress } = request;
        getCoingeckoInfo(chainId, tokenAddress).then(result => sendResponse(result));
        return true;
    }

    if (request.foxeye_extension_action === 'foxeye_security_statistic') {
        riskCenter.parseSecurityStatistic().then(result => sendResponse(result));
        return true;
    }

    if (request.foxeye_extension_action === 'foxeye_fetch_approvals') {
        const { account } = request;
        riskCenter.fetchApprovals(account).then(result => sendResponse(result));
        return true;
    }

    return false;
});
