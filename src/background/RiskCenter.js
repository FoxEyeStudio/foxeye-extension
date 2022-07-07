

export const RiskType_PhishingWebsite = 1;
export const RiskType_MaliciousContract = 2; // to
export const RiskType_MaliciousAddress = 3; // erc20 transfer to
export const RiskType_ApproveEOA = 4;// erc20 approve to
export const RiskType_TransferToContract = 5;// erc20 transfer to
export const RiskType_SwapHighRiskToken = 6; // buy token on uniswap-like dex
export const RiskType_SwapMediumRiskToken = 7; // buy token on uniswap-like dex

let instance = null;
class RiskCenter {
    static get = () => {
        if (!instance) {
            instance = new RiskCenter();
        }
        return instance;
    }


}


export default RiskCenter;
