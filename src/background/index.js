import riskCenter, {RiskType_PhishingWebsite, Task_RiskAlert, Task_TokenDetection} from './RiskCenter'
import {getCoingeckoInfo, getTokenInfo} from "../common/utils";
import {ethers} from "ethers";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.foxeye_extension_action === 'foxeye_sendTransaction') {
        const { chainId, params, args } = request;
        riskCenter.parseTransaction(chainId, params, args).then(result => sendResponse(result));
        return true;
    }

    if (request.foxeye_extension_action === 'foxeye_phishing_website') {
        const { url, args, account } = request;
        riskCenter.parsePhishingWebsite(url, args).then(result => {
            sendResponse(result);
            if (ethers.utils.isAddress(account)) {
                if (result.type == RiskType_PhishingWebsite) {
                    const _content = riskCenter.getDomain(url);
                    riskCenter.taskStat(account, Task_RiskAlert, _content);
                }
            }
        });
        return true;
    }

    if (request.foxeye_extension_action === 'foxeye_taskstat') {
        const { account, type, content } = request;
        if (ethers.utils.isAddress(account)) {
            riskCenter.taskStat(account, type, content).then(result => sendResponse(result));
        } else {
            sendResponse(undefined);
        }
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
            let success = false;
            try {
                success = result.code == 1 && result.result[tokenAddress.toLowerCase()];
            } catch (e) {
            }
            if (ethers.utils.isAddress(account) && success) {
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

    if (request.foxeye_extension_action === 'foxeye_get_airdrop_amount') {
        const { account } = request;
        riskCenter.getAirdropAmount(account).then(result => sendResponse(result));
        return true;
    }

    if (request.foxeye_extension_action === 'foxeye_get_banner_ad_config') {
        riskCenter.getBannerAdConfig().then(result => sendResponse(result));
        return true;
    }

    return false;
});
