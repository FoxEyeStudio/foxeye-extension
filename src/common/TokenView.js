import React, { Component } from 'react';
import ic_attention  from '../images/ic_attention.png'
import ic_contract  from '../images/ic_contract.png'
import ic_lock  from '../images/ic_lock.png'
import ic_safe  from '../images/ic_safe.png'
import ic_warning  from '../images/ic_warning.png'
import icon_copy  from '../images/icon_copy.png'
const icon_empty = chrome.runtime.getURL('/images/icon_empty.png');
// import icon_empty  from '../images/icon_empty.png'
import webFavicon  from '../images/web_favicon.png'
import ic_eth_tag  from '../images/ic_eth_tag.png'
import ic_bsc_tag  from '../images/ic_bsc_tag.png'
import ic_okc_tag  from '../images/ic_okc_tag.png'
import ic_heco_tag  from '../images/ic_heco_tag.png'
import ic_polygon_tag  from '../images/ic_polygon_tag.png'
import ic_arb_tag  from '../images/ic_arb_tag.png'
import ic_avax_tag  from '../images/ic_avax_tag.png'
import ic_fantom_tag  from '../images/ic_fantom_tag.png'
import ic_other_tag  from '../images/ic_other_tag.png'
import ic_coingecko  from '../images/ic_coingecko.png'
import ic_link from '../images/ic_link.png';
import ic_link_hover from '../images/ic_link_hover.png';
import {postMessage} from "../proxy/ProxyMessage";

export default class TokenView extends Component {
    state = {
        coingeckoLink: '',
        tokenLogo: 'none',
    }

    componentDidMount() {
        const { token_info } = this.props;
        const tokenAddress = token_info.tokenAddress;
        const chainId = token_info.token_id;
        chrome.runtime.sendMessage({foxeye_extension_action: "foxeye_get_coingecko_info", chainId, tokenAddress}, result => {
            if (result) {
                this.setState(result);
            } else {
                this.setState({coingeckoLink: '', tokenLogo: ''});
            }
        });
    }

    copyToClipboard = (textToCopy) => {
        if (this.props.fromAlert) {
            postMessage({foxeye_extension_action: 'foxeye_write_clipboard',textToCopy: textToCopy})
            return;
        }
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            const tab = tabs[0];
            chrome.tabs.sendMessage(tab.id, {foxeye_extension_action: "foxeye_write_clipboard", textToCopy: textToCopy}, undefined); //send to content.js
        });
    }

    linkTo = url => {
        if (this.props.fromAlert) {
            window.open(url, '_blank' // <- This is what makes it open in a new window.
            );
            return;
        }
        chrome.tabs.create({url});
    }

    parseTokenInfo = token_info => {
        this.dex_names = [];
        this.dex = [];
        this.red_items_count = 0;
        this.orange_items_count = 0;
        this.dex_index = 0;
        this.holders = [];
        this.holders_percent = 0;
        this.lp_holders =[];
        this.lp_holders_percent = 0;
        this.is_in_dex = token_info.is_in_dex
        this.is_mintable = token_info.is_mintable
        this.is_open_source = token_info.is_open_source
        this.is_proxy = token_info.is_proxy
        this.buy_tax = token_info.buy_tax
        this.can_take_back_ownership = token_info.can_take_back_ownership
        this.creator_address = token_info.creator_address
        this.creator_balance = token_info.creator_balance
        this.creator_percent = token_info.creator_percent
        this.holder_count = token_info.holder_count
        this.holders = token_info.holders
        this.is_anti_whale = token_info.is_anti_whale
        this.is_blacklisted = token_info.is_blacklisted
        this.is_honeypot = token_info.is_honeypot
        this.is_whitelisted = token_info.is_whitelisted
        this.lp_holder_count = token_info.lp_holder_count
        this.lp_holders = token_info.lp_holders
        this.lp_total_supply = parseFloat(token_info.lp_total_supply).toFixed(2).toLocaleString('en-US')
        this.owner_address = token_info.owner_address
        this.owner_balance = token_info.owner_balance
        this.owner_change_balance = token_info.owner_change_balance
        this.owner_percent = token_info.owner_percent
        this.sell_tax = token_info.sell_tax
        this.slippage_modifiable = token_info.slippage_modifiable
        this.total_supply = parseFloat(token_info.total_supply).toFixed(2).toLocaleString('en-US')
        this.transfer_pausable = token_info.transfer_pausable
        this.cannot_sell_all = token_info.cannot_sell_all
        this.trading_cooldown = token_info.trading_cooldown
        this.is_true_token = token_info.is_true_token
        this.is_verifiable_team = token_info.is_verifiable_team
        this.is_airdrop_scam = token_info.is_airdrop_scam
        this.trust_list = token_info.trust_list
        if (token_info.dex) {
            token_info.dex.forEach(item => {
                // init dex_names
                if (!this.dex_name) {
                    this.dex_name = item.name
                }
                if (this.dex_names.indexOf(item.name) === -1) {
                    this.dex_names.push(item.name)
                }

                // recombination dexs
                if (!this.dex[item.name]) {
                    this.dex[item.name] = []
                }

                this.dex[item.name].push(item)
            })
        }
        this.holders && this.holders.forEach(holder => {
            this.holders_percent += holder.percent * 100
        })
        this.lp_holders && this.lp_holders.forEach(holder => {
            this.lp_holders_percent += holder.percent * 100
        })
        if (this.lp_holders) {
            if (this.lp_holders[0].locked_detail) {

                console.log(this.lp_holders[0].locked_detail)
            }
        }
        if (this.is_open_source == 0) {
            this.red_items_count += 1
        }
        if (this.is_proxy == 1) {
            this.orange_items_count += 1
        }
        if (this.is_mintable == 1) {
            this.orange_items_count += 1
        }
        if (this.cannot_sell_all == 1) {
            this.orange_items_count += 1
        }
        if (this.can_take_back_ownership == 1) {
            this.orange_items_count += 1
        }
        if (this.buy_tax * 100 >= 10 && this.buy_tax * 100 < 50) {
            this.orange_items_count += 1
        }
        if (this.buy_tax * 100 >= 50) {
            this.red_items_count += 1
        }
        if (this.sell_tax * 100 >= 10 && this.sell_tax * 100 < 50) {
            this.orange_items_count += 1
        }
        if (this.sell_tax * 100 >= 50) {
            this.red_items_count += 1
        }
        if (this.is_honeypot == 1) {
            this.red_items_count += 1
        }
        if (this.transfer_pausable == 1) {
            this.orange_items_count += 1
        }
        if (this.is_anti_whale == 1) {
            this.orange_items_count += 1
        }
        if (this.slippage_modifiable == 1) {
            this.orange_items_count += 1
        }
        if (this.is_blacklisted == 1) {
            this.orange_items_count += 1
        }
        if (this.is_whitelisted == 1) {
            this.orange_items_count += 1
        }
        if (this.is_true_token == 0) {
            this.red_items_count += 1
        }
        if (this.is_verifiable_team == 0) {
            this.orange_items_count += 1
        }
        if (this.is_airdrop_scam == 1) {
            this.red_items_count += 1
        }
        this.token_name = token_info.token_symbol;
        this.token_address = token_info.tokenAddress;
        this.token_id = token_info.token_id;
    }

    render() {
        const { token_info } = this.props;
        this.parseTokenInfo(token_info);

        let icTag = ic_other_tag;
        if (this.token_id == 1) {
            icTag = ic_eth_tag
        } else if (this.token_id == 56) {
            icTag = ic_bsc_tag;
        } else if (this.token_id == 66) {
            icTag = ic_okc_tag;
        } else if (this.token_id == 128) {
            icTag = ic_heco_tag;
        } else if (this.token_id == 137) {
            icTag = ic_polygon_tag;
        } else if (this.token_id == 42161) {
            icTag = ic_arb_tag;
        } else if (this.token_id == 43114) {
            icTag = ic_avax_tag;
        } else if (this.token_id == 250) {
            icTag = ic_fantom_tag;
        }

        return (
            <div style={{width: '100%', height: '100%'}}>
                <div className="foxeye-token-base-result-cover">
                    <div className='foxeye-token-base-token-banner'>
                        <div className='foxeye-token-base-token-banner-logo-and-tag'>
                            {this.state.tokenLogo == 'none' ? (
                                <img className='foxeye-token-base-token-banner-logo'/>
                            ) : (
                                <img className='foxeye-token-base-token-banner-logo' src={this.state.tokenLogo || webFavicon}/>
                            )}
                            <img src={icTag} className='foxeye-token-base-token-banner-tag'/>
                        </div>
                        <div className='foxeye-token-base-flex-col foxeye-token-base-flex-full' style={{marginLeft: 20}}>
                            <div className='foxeye-token-base-flex-row foxeye-token-base-justify-between foxeye-token-base-align-center foxeye-token-base-flex-full'>
                                <div className='foxeye-token-base-token-banner-token-name'>
                                    {this.token_name}
                                </div>
                                {!!this.state.coingeckoLink && (
                                    <div className='foxeye-token-base-flex-row foxeye-token-base-align-center foxeye-token-base-token-link' onClick={() => {
                                        this.linkTo(this.state.coingeckoLink);
                                    }}>
                                        <img src={ic_coingecko} className='foxeye-token-base-token-banner-coingecko'/>
                                        <div className='foxeye-token-base-token-banner-coingecko-name'>
                                            CoinGecko
                                        </div>
                                        <div className='foxeye-token-base-token-banner-link-icon' style={{ '--ic-link-normal': 'url(' + ic_link + ')', '--ic-link-hover': 'url(' + ic_link_hover + ')'}}/>
                                    </div>
                                )}
                            </div>

                            <div className='foxeye-token-base-token-banner-address'>
                                {this.token_address.substr(0, 14)}...{this.token_address.substr(-14)}
                            </div>
                        </div>
                    </div>
                    <div className='foxeye-token-base-token-banner-line' />
                    <div className="foxeye-token-base-result foxeye-token-base-content">
                        <div className="foxeye-token-base-security-detection">
                            <div className="foxeye-token-base-title">Security Detection </div>
                            <div className="foxeye-token-base-items-num foxeye-token-base-flex foxeye-token-base-items-center foxeye-token-base-flex-full">
                                <img className="foxeye-token-base-icon-attention" src={ic_attention} style={{marginRight: 5}}/>
                                {this.red_items_count > 1 ? (
                                    <span className="foxeye-token-base-item-title">{this.red_items_count} risky items</span>
                                ) : (
                                    <span className="foxeye-token-base-item-title">{this.red_items_count} risky item</span>
                                )}

                                <img className="foxeye-token-base-icon-warning foxeye-token-base-security-warning" src={ ic_warning } />
                                {this.orange_items_count > 1 ? (
                                    <span className="foxeye-token-base-item-title">{this.orange_items_count} attention items</span>
                                ) : (
                                    <span className="foxeye-token-base-item-title">{this.orange_items_count} attention item</span>
                                )}
                            </div>
                        </div>
                        <div className="foxeye-token-base-other-detection">
                            <div className="foxeye-token-base-contract-security">
                                <div className="foxeye-token-base-title">Contract Security</div>
                                {this.is_open_source == 1 && (
                                    <div className="foxeye-token-base-detect-item flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Contract source code verified</div>
                                            <div className="foxeye-token-base-item-desc">This token contract is open source.
                                                You can check the contract code for details. Unsourced token contracts are likely to have malicious functions to defraud their users of their assets.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_open_source == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-attention" src={ic_attention}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Contract source code not verified</div>
                                            <div className="foxeye-token-base-item-desc">This token contract has not been verified. We cannot check the contract code for details. Unsourced token contracts are likely to have malicious functions to defraud users of their assets.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_proxy == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-is-proxy foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Proxy contract</div>
                                            <div className="foxeye-token-base-item-desc">This contract is an Admin Upgradeability Proxy.
                                                The proxy contract means the contract owner can modify the function of
                                                the token and could possibly effect the price.There is possibly a way
                                                for the team to Rug or Scam. Please confirm the details with the project
                                                team before buying.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_proxy == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-no-proxy foxeye-token-base-flex" >
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">No proxy</div>
                                            <div className="foxeye-token-base-item-desc">There is no proxy in the contract. The proxy
                                                contract means contract owner can modify the function of the token and
                                                possibly effect the price.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_mintable == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-mint-function foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Mint function</div>
                                            <div className="foxeye-token-base-item-desc">The contract may contain additional issuance
                                                functions, which could maybe generate a large number of tokens,
                                                resulting in significant fluctuations in token prices. It is recommended
                                                to confirm with the project team whether it complies with the token
                                                issuance instructions.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_mintable == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-no-mint-function foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">No mint function</div>
                                            <div className="foxeye-token-base-item-desc">Mint function is transparent or non-existent.
                                                Hidden mint functions may increase the amount of tokens in circulation
                                                and effect the price of the token.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!!this.owner_address && (
                                    <div className="foxeye-token-base-owner-address">
                                        <div className="foxeye-token-base-detect-item foxeye-token-base-first-item foxeye-token-base-flex" >
                                            {(this.owner_address == '0x0000000000000000000000000000000000000000' || this.owner_address == '0x000000000000000000000000000000000000dEaD') && (
                                                <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                            )}

                                            <div>
                                                <div className="foxeye-token-base-flex">
                                                    {(this.owner_address == '0x0000000000000000000000000000000000000000' || this.owner_address == '0x000000000000000000000000000000000000dEaD') ? (
                                                        <div
                                                            className="foxeye-token-base-item-title foxeye-token-base-address-title">Owner Address： <span
                                                            className="foxeye-token-base-text-green-500">{this.owner_address}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="foxeye-token-base-item-title foxeye-token-base-address-title">Owner Address：
                                                            {this.owner_address}</div>
                                                    )}

                                                    <div onClick={() => {this.copyToClipboard(this.owner_address)}}
                                                         data-title="copied"
                                                         className="foxeye-token-base-ic-copy foxeye-token-base-ml-2-5 foxeye-token-base-mt-1 foxeye-token-base-inline-block">
                                                        <img className="foxeye-token-base-ic-copy-img"
                                                             src={icon_copy} />
                                                    </div>
                                                </div>

                                                <div className="foxeye-token-base-item-desc">The owner address can modify the parameters
                                                    of the token contract. If it is a EOA address, the project party can
                                                    modify the parameters at will, resulting in token risk.
                                                </div>
                                            </div>
                                        </div>

                                        {this.can_take_back_ownership == 1 && (
                                            <div className="foxeye-token-base-detect-item foxeye-token-base-retrievable-ownership foxeye-token-base-flex">
                                                <img className="foxeye-token-base-icon-warning" src={ic_warning} />
                                                <div>
                                                    <div className="foxeye-token-base-item-title">Functions with retrievable
                                                        ownership
                                                    </div>
                                                    <div className="foxeye-token-base-item-desc">If this function exists, it is
                                                        possible for the project owner to regain ownership even
                                                        after relinquishing it.
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {this.can_take_back_ownership == 0 && (
                                            <div className="foxeye-token-base-detect-item foxeye-token-base-no-retrievable-ownership foxeye-token-base-flex">
                                                <img className="foxeye-token-base-icon-safe" src={ic_safe} />
                                                <div>
                                                    <div className="foxeye-token-base-item-title">No function found that retrieves
                                                        ownership
                                                    </div>
                                                    <div className="foxeye-token-base-item-desc">If this function exists, it is
                                                        possible for the project owner to regain ownership even
                                                        after relinquishing it.
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {this.owner_change_balance == 1 && (
                                            <div className="foxeye-token-base-detect-item foxeye-token-base-owner-can-change-balance foxeye-token-base-flex">
                                                <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                                <div>
                                                    <div className="foxeye-token-base-item-title">Owner can change balance</div>
                                                    <div className="foxeye-token-base-item-desc">The contract owner has the authority to
                                                        modify the balance of tokens at other addresses, which may
                                                        result in a loss of assets.
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {this.owner_change_balance == 0 && (
                                            <div className="foxeye-token-base-detect-item foxeye-token-base-owner-cant-change-balance foxeye-token-base-flex">
                                                <img className="foxeye-token-base-icon-safe" src={ic_safe} />
                                                <div>
                                                    <div className="foxeye-token-base-item-title">Owner cann't change balance</div>
                                                    <div className="foxeye-token-base-item-desc">The contract owner is not found to
                                                        have the authority to modify the balance of tokens at other
                                                        addresses.
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="foxeye-token-base-flex foxeye-token-base-detect-item">
                                            {this.creator_address.substr(0, 27) == '0x0000000000000000000000000' && (
                                                <div
                                                    className="foxeye-token-base-item-title">Creator Address: <span
                                                    className="foxeye-token-base-text-green-500">{this.creator_address}</span>
                                                </div>
                                            )}

                                            {this.creator_address && this.creator_address.substr(0, 27) != '0x0000000000000000000000000' && (
                                                <div className="foxeye-token-base-item-title">Creator
                                                    Address: <span>{this.creator_address}</span>
                                                </div>
                                            )}
                                            <div onClick={() => {this.copyToClipboard(this.creator_address)}} data-title="copied" className="foxeye-token-base-ic-copy ml-2-5 mt-1.5 inline-block">
                                                <img className="foxeye-token-base-ic-copy-img" src={icon_copy} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="foxeye-token-base-transaction-security">
                                <div className="foxeye-token-base-title">Transcation Security</div>
                                {(this.buy_tax || this.sell_tax) ? (
                                    <div className="foxeye-token-base-tax">
                                        <div className="foxeye-token-base-flex foxeye-token-base-flex-full" >
                                            {(this.buy_tax * 100).toFixed(2) < 10 && (
                                                <div className="foxeye-token-base-item-title">Buy Tax:&nbsp;<span
                                                    className="foxeye-token-base-buy-tax foxeye-token-base-text-green-500">{(this.buy_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}

                                            {(this.buy_tax * 100).toFixed(2) >= 10 && (this.buy_tax * 100).toFixed(2) < 50 && (
                                                <div
                                                    className="foxeye-token-base-item-title">Buy Tax:&nbsp;<span
                                                    className="foxeye-token-base-buy-tax foxeye-token-base-text-orange">{(this.buy_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}

                                            {(this.buy_tax * 100).toFixed(2) >= 50 && (
                                                <div className="foxeye-token-base-item-title">Buy Tax:&nbsp;<span
                                                    className="foxeye-token-base-buy-tax foxeye-token-base-text-red">{(this.buy_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}

                                            {(this.sell_tax * 100).toFixed(2) < 10 && (
                                                <div className="foxeye-token-base-item-title foxeye-token-base-sell-tax-title">Sell Tax:&nbsp;<span
                                                    className="foxeye-token-base-sell-tax foxeye-token-base-text-green-500">{(this.sell_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}

                                            {(this.sell_tax * 100).toFixed(2) >= 10 && (this.sell_tax * 100).toFixed(2) < 50 && (
                                                <div className="foxeye-token-base-item-title foxeye-token-base-sell-tax-title">Sell Tax:&nbsp;<span
                                                    className="foxeye-token-base-sell-tax foxeye-token-base-text-orange">{(this.sell_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}

                                            {(this.sell_tax * 100).toFixed(2) >= 50 && (
                                                <div className="foxeye-token-base-item-title foxeye-token-base-sell-tax-title">Sell Tax:&nbsp;<span
                                                    className="foxeye-token-base-sell-tax foxeye-token-base-text-red">{(this.sell_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="foxeye-token-base-item-desc">Above 10% may be considered a high tax rate. More
                                            than 50% tax rate means may not be tradable.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="foxeye-token-base-tax foxeye-token-base-tax-empty foxeye-token-base-flex foxeye-token-base-justify-center foxeye-token-base-items-center">
                                        <img className="foxeye-token-base-icon-empty-small" src={icon_empty} />
                                        <span>No items</span>
                                    </div>
                                )}
                            </div>

                            <div className="foxeye-token-base-honeypot-risk">
                                <div className="foxeye-token-base-title">Honeypot Risk</div>

                                {this.is_honeypot == 1 && (
                                    <div className="foxeye-token-base-detect-item honeypot foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-attention" src={ic_attention}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">May the token is a honeypot</div>
                                            <div className="foxeye-token-base-item-desc">This token contract has a code that states that
                                                it cannot be sold. Maybe this is a honeypot.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_honeypot == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-honeypot foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">This does not appear to be a honeypot.</div>
                                            <div className="foxeye-token-base-item-desc">We are not aware of any code that prevents the
                                                sale of tokens.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.transfer_pausable == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Functions that can suspend trading</div>
                                            <div className="foxeye-token-base-item-desc">If a suspendable code is included, the token
                                                maybe neither be bought nor sold (honeypot risk).
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.transfer_pausable == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">No codes found to suspend trading</div>
                                            <div className="foxeye-token-base-item-desc">If a suspendable code is included, the token
                                                maybe neither be bought nor sold (honeypot risk).
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.cannot_sell_all == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Holders cannot sell all of the tokens</div>
                                            <div className="foxeye-token-base-item-desc">Holders cannot sell all of the tokens and can
                                                only sell up to the percentage specified in the contract.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.cannot_sell_all == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Holders can sell all of the token</div>
                                            <div className="foxeye-token-base-item-desc">Holders can sell all of the token.Some token
                                                contracts will have a maximum sell ratio.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.trading_cooldown == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Trading cooldown function</div>
                                            <div className="foxeye-token-base-item-desc">The token contract has the trading cooldown
                                                function. Within a certain time or block after buying, the user will not
                                                be able to sell the token.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.trading_cooldown == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">No trading cooldown function</div>
                                            <div className="foxeye-token-base-item-desc">The token contract has no trading cooldown
                                                function.If there is a trading cooldown function, the user will not be
                                                able to sell the token within a certain time or block after buying.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_anti_whale == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-anti-whale foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Anti_whale(Limited number of transactions)</div>
                                            <div className="foxeye-token-base-item-desc">The number of token transactions is limited. The
                                                number of scam token transactions may be limited (honeypot risk).
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_anti_whale == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">No anti_whale(Unlimited number of
                                                transactions)
                                            </div>
                                            <div className="foxeye-token-base-item-desc">There is no limit to the number of token
                                                transactions. The number of scam token transactions may be limited
                                                (honeypot risk).
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.slippage_modifiable == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-slippage-modifiable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Tax can be modified</div>
                                            <div className="foxeye-token-base-item-desc">The contract owner may contain the authority to
                                                modify the transaction tax. If the transaction tax is increased to more
                                                than 49%, the tokens will not be able to be traded (honeypot risk).
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.slippage_modifiable == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-slippage-not-modifiable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Tax cannot be modified</div>
                                            <div className="foxeye-token-base-item-desc">The contract owner may not contain the authority
                                                to modify the transaction tax. If the transaction tax is increased to
                                                more than 49%, the tokens will not be able to be traded (honeypot risk).
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_blacklisted == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-black-listed foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Blacklist function</div>
                                            <div className="foxeye-token-base-item-desc">The blacklist function is included. Some
                                                addresses may not be able to trade normally (honeypot risk).
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_blacklisted == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-black-listed foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">No blacklist</div>
                                            <div className="foxeye-token-base-item-desc">The blacklist function is not included. If there
                                                is a blacklist, some addresses may not be able to trade normally
                                                (honeypot risk).
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_whitelisted == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-white-listed foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Whitelist function</div>
                                            <div className="foxeye-token-base-item-desc">The whitelist function is included. Some
                                                addresses may not be able to trade normally (honeypot risk).
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_whitelisted == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-white-listed foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">No whitelist</div>
                                            <div className="foxeye-token-base-item-desc">The whitelist function is not included. If there
                                                is a whitelist, some addresses may not be able to trade normally
                                                (honeypot risk).
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {this.is_in_dex == 1 && (
                                <div className="foxeye-token-base-liquidity">
                                    <div className="foxeye-token-base-title">Liquidity</div>
                                    <div className="foxeye-token-base-dex">
                                        <div className="foxeye-token-base-flex foxeye-token-base-flex-col foxeye-token-base-mb-1">
                                            {this.dex_names.map((name, index) => (
                                                <div className="foxeye-token-base-dex-item" key={'dex_name-' + index} >
                                                    {this.dex_index == index && (
                                                        <div  className="foxeye-token-base-dex-item-inner foxeye-token-base-active">
                                                            Dex{index +1}: {name}
                                                        </div>
                                                    )}
                                                    {this.dex_index != index && (
                                                        <div  className="foxeye-token-base-dex-item-inner">
                                                            Dex{index +1}: {name}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {(this.dex[this.dex_name] && this.dex[this.dex_name].length > 0) ? (
                                            <div>
                                                {this.dex[this.dex_name].map((item, index) => (
                                                    <div className="foxeye-token-base-dex-detail foxeye-token-base-flex" key={'dex-detail-' + index}>
                                                        <div className='foxeye-token-base-token-link' onClick={() => {
                                                            let linkUrl = 'https://etherscan.io/token/';
                                                            if (this.token_id == 1) {
                                                                linkUrl = 'https://etherscan.io/token/';
                                                            } else if (this.token_id == 56) {
                                                                linkUrl = 'https://bscscan.com/token/';
                                                            } else if (this.token_id == 66) {
                                                                linkUrl = 'https://www.oklink.com/en/okc/address/';
                                                            } else if (this.token_id == 128) {
                                                                linkUrl = 'https://hecoinfo.com/token/';
                                                            } else if (this.token_id == 137) {
                                                                linkUrl = 'https://polygonscan.com/token/';
                                                            } else if (this.token_id == 42161) {
                                                                linkUrl = 'https://arbiscan.io/token/';
                                                            } else if (this.token_id == 43114) {
                                                                linkUrl = 'https://snowtrace.io/token/';
                                                            } else if (this.token_id == 250) {
                                                                linkUrl = 'https://ftmscan.com/token/';
                                                            }
                                                            this.linkTo(linkUrl + item.pair);
                                                        }}>
                                                            Pool{index +1}：{item['pair'].substr(0, 4)}...{item['pair'].substr(-4)}
                                                        </div>

                                                        <div className="foxeye-token-base-dex-liquidity">Liquidity：${
                                                            parseFloat(item['liquidity']).toFixed(2)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="foxeye-token-base-dex-detail foxeye-token-base-dex-empty foxeye-token-base-flex foxeye-token-base-justify-center foxeye-token-base-items-center">
                                                <img className="foxeye-token-base-icon-empty-small" src={icon_empty}/>
                                                <span>No items</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {(this.holders || this.lp_holders) && (
                                <div className="foxeye-token-base-info-security">
                                    <div className="foxeye-token-base-title">Info Security</div>

                                    <div className="foxeye-token-base-holders-block">
                                        <div className="foxeye-token-base-item-title holders-info">Holders Info</div>
                                        {this.holders ? (
                                            <div>
                                                <div className="foxeye-token-base-item-title foxeye-token-base-flex foxeye-token-base-flex-col foxeye-token-base-mt-1">
                                                    {this.holder_count > 1 ? (
                                                        <span>Holders：{this.holder_count} addresses</span>
                                                    ) : (
                                                        <span>Holders：{this.holder_count} address</span>
                                                    )}
                                                    <span className="foxeye-token-base-total-supply">Total Supply：{this.total_supply}</span>
                                                </div>

                                                <div className="foxeye-token-base-top10-holders">
                                                    <div className="foxeye-token-base-item-title foxeye-token-base-top-10-title">Top10 Holders</div>
                                                    <div className="foxeye-token-base-rank-chart foxeye-token-base-flex foxeye-token-base-justify-between">
                                                        <div className="rank">
                                                            {this.holders.map((item, index) => (
                                                                <div key={item.address}>
                                                                    <div className="foxeye-token-base-rank-item foxeye-token-base-flex foxeye-token-base-items-center">
                                                                        <span>{index +1}.&nbsp;</span>
                                                                        {!!item.is_contract && (
                                                                            <div className="foxeye-token-base-tooltip">
                                                                                <img className="foxeye-token-base-ic-contract" src={ic_contract}/>
                                                                                <span className="foxeye-token-base-tooltip-text">Contract</span>
                                                                            </div>
                                                                        )}

                                                                        {!!item.is_locked && (
                                                                            <div className="foxeye-token-base-tooltip">
                                                                                <img className="foxeye-token-base-ic-lock" src={ic_lock}/>
                                                                                <span className="foxeye-token-base-tooltip-text foxeye-token-base-locked-address">Locked Address</span>
                                                                            </div>
                                                                        )}

                                                                        {!!item.tag ? (
                                                                            <div className="foxeye-token-base-tooltip">
                                                                                <div className="foxeye-token-base-rank-addr">
                                                                                    <div className='foxeye-token-base-token-link' onClick={() => {
                                                                                        let linkUrl = 'https://etherscan.io/address/';
                                                                                        if (this.token_id == 1) {
                                                                                            linkUrl = 'hhttps://etherscan.io/address/';
                                                                                        } else if (this.token_id == 56) {
                                                                                            linkUrl = 'https://bscscan.com/address/';
                                                                                        } else if (this.token_id == 66) {
                                                                                            linkUrl = 'https://www.oklink.com/en/okc/address/';
                                                                                        } else if (this.token_id == 128) {
                                                                                            linkUrl = 'https://hecoinfo.com/address/';
                                                                                        } else if (this.token_id == 137) {
                                                                                            linkUrl = 'https://polygonscan.com/address/';
                                                                                        } else if (this.token_id == 42161) {
                                                                                            linkUrl = 'https://arbiscan.io/address/';
                                                                                        } else if (this.token_id == 43114) {
                                                                                            linkUrl = 'https://snowtrace.io/address/';
                                                                                        } else if (this.token_id == 250) {
                                                                                            linkUrl = 'https://ftmscan.com/token/';
                                                                                        }
                                                                                        this.linkTo(linkUrl + item.address);
                                                                                    }}>
                                                                                        {item.tag}
                                                                                    </div>
                                                                                </div>
                                                                                <span className="foxeye-token-base-tooltip-text foxeye-token-base-tag">
                                                                                    <span>Public Tag：{item.tag}</span><br/>
                                                                                    <span>Address： {item.address}</span>
                                                                                </span>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="foxeye-token-base-rank-addr">
                                                                                <div className='foxeye-token-base-token-link' onClick={() => {
                                                                                    let linkUrl = 'https://etherscan.io/address/';
                                                                                    if (this.token_id == 1) {
                                                                                        linkUrl = 'https://etherscan.io/address/';
                                                                                    } else if (this.token_id == 56) {
                                                                                        linkUrl = 'https://bscscan.com/address/';
                                                                                    } else if (this.token_id == 66) {
                                                                                        linkUrl = 'https://www.oklink.com/en/okc/address/';
                                                                                    } else if (this.token_id == 128) {
                                                                                        linkUrl = 'https://hecoinfo.com/address/';
                                                                                    } else if (this.token_id == 137) {
                                                                                        linkUrl = 'https://polygonscan.com/address/';
                                                                                    } else if (this.token_id == 42161) {
                                                                                        linkUrl = 'https://arbiscan.io/address/';
                                                                                    } else if (this.token_id == 43114) {
                                                                                        linkUrl = 'https://snowtrace.io/address/';
                                                                                    } else if (this.token_id == 250) {
                                                                                        linkUrl = 'https://ftmscan.com/token/';
                                                                                    }
                                                                                    this.linkTo(linkUrl + item.address);
                                                                                }}>
                                                                                    {item.address.substr(0, 4) + '...' + item.address.substr(-4)}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div className="foxeye-token-base-flex-grow"></div>
                                                                        <div
                                                                            className="foxeye-token-base-rank-percent">{(item.percent * 100).toFixed(2)}%
                                                                        </div>
                                                                    </div>
                                                                    {!!item.locked_detail && (
                                                                        <div className="foxeye-token-base-locked-details">
                                                                            <div className="foxeye-token-base-item-title-detail">Locked Details</div>
                                                                            {item.locked_detail.map((detail, idx) => {
                                                                                if (idx < 3) {
                                                                                    return (
                                                                                        <div key={'detail-' + index}>
                                                                                            <div className="foxeye-token-base-detail-title foxeye-token-base-mt-2 foxeye-token-base-whitespace-nowrap">
                                                                                                No{idx +1}:
                                                                                                {parseFloat(detail.amount).toFixed(2)} {this.token_name}</div>
                                                                                            <div className="foxeye-token-base-detail-intro foxeye-token-base-flex foxeye-token-base-flex-col foxeye-token-base-mt-1">
                                                                                            <span className="foxeye-token-base-flex foxeye-token-base-flex-col "><span>Start/Update Time:</span> <span>{
                                                                                                detail.opt_time.substr(0, 19).replace('T', ' ')
                                                                                            }(UTC)</span>
                                                                                            </span>
                                                                                                <span
                                                                                                    className="foxeye-token-base-mt-1  foxeye-token-base-flex foxeye-token-base-flex-col "><span>End Time:</span> <span>{
                                                                                                    detail
                                                                                                        .end_time.substr(0, 19).replace('T', ' ')
                                                                                                }(UTC)</span>
                                                                                            </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            })}
                                                                        </div>

                                                                    )}
                                                                </div>
                                                            ))}

                                                            <div className="foxeye-token-base-owners-holding foxeye-token-base-mt-5">
                                                            <div className="foxeye-token-base-flex foxeye-token-base-flex-col">
                                                                <div className="foxeye-token-base-holding-title"><span className="foxeye-token-base-font-bold">Owner's Holdings:</span> {
                                                                    parseFloat(this.owner_balance)
                                                                    .toFixed(2)
                                                                }</div>
                                                                <div className="foxeye-token-base-holding-desc">Percent:
                                                                    {(this.owner_percent * 100).toFixed(2)}%
                                                                </div>
                                                            </div>
                                                            <div className="foxeye-token-base-mt-2 foxeye-token-base-flex foxeye-token-base-flex-col">
                                                                <div className="foxeye-token-base-holding-title"><span className="foxeye-token-base-font-bold">Creator's Holdings:</span> {
                                                                    parseFloat(this.creator_balance)
                                                                    .toFixed(2)
                                                                }</div>
                                                                <div className="foxeye-token-base-holding-desc ">Percent:
                                                                    {(this.creator_percent * 100).toFixed(2)}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                        <div className="foxeye-token-base-chart">
                                                            <div className="foxeye-token-base-item-title foxeye-token-base-chart-title">Top10 Holders</div>
                                                            {this.holders_percent >= 50 ? (
                                                                <div className="foxeye-token-base-pie-chart foxeye-token-base-convex">
                                                                    <div className="foxeye-token-base-before"
                                                                         style={{transform: 'translate(-50%, -50%) rotate(' + this.holders_percent / 100 + 'turn)'}}></div>
                                                                    <div className="foxeye-token-base-percent">Top10<br/>{
                                                                        this.holders_percent
                                                                            .toFixed(2)
                                                                    }%</div>
                                                                </div>
                                                            ) : (
                                                                <div className="foxeye-token-base-pie-chart">
                                                                    <div className="foxeye-token-base-before"
                                                                         style={{transform: 'translate(-50%, -50%) rotate(' + this.holders_percent / 100 + 'turn)'}}></div>
                                                                    <div className="foxeye-token-base-percent">Top10<br/>{
                                                                        this.holders_percent
                                                                            .toFixed(2)
                                                                    }%</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        ) : (
                                            <div className="foxeye-token-base-holders-empty foxeye-token-base-flex foxeye-token-base-flex-col foxeye-token-base-items-center">
                                                <img className="foxeye-token-base-icon-empty-big" src={icon_empty}/>
                                                <span>No items</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="foxeye-token-base-lp-holders-block">
                                        <div className="foxeye-token-base-item-title foxeye-token-base-holders-info foxeye-token-base-lp-holders">LP Holders Info</div>

                                        {(this.lp_holders && this.lp_holder_count > 0) ? (
                                            <div>
                                                <div className="foxeye-token-base-item-title foxeye-token-base-flex foxeye-token-base-flex-col foxeye-token-base-mt-1">
                                                    {this.lp_holder_count > 1 ? (
                                                        <span>LP Holders：{this.lp_holder_count} addresses</span>
                                                    ) : (
                                                        <span>LP Holders：{this.lp_holder_count} address</span>
                                                    )} <span className="foxeye-token-base-total-supply">Total Supply：{this.lp_total_supply}</span>
                                                </div>

                                                <div className="foxeye-token-base-top10-holders">
                                                    <div className="foxeye-token-base-item-title foxeye-token-base-top-10-title">Top10 LP Holders</div>
                                                    <div className="foxeye-token-base-rank-chart foxeye-token-base-flex foxeye-token-base-justify-between">
                                                        <div className="foxeye-token-base-rank">
                                                            {this.lp_holders.map((item, index) => (
                                                                <div key={item.address}>
                                                                    <div className="foxeye-token-base-rank-item foxeye-token-base-flex foxeye-token-base-items-center">
                                                                        <span>{index +1}.&nbsp;</span>
                                                                        {!!item.is_contract && (
                                                                            <div className="foxeye-token-base-tooltip">
                                                                                <img className="foxeye-token-base-ic-contract" src={ic_contract}/>
                                                                                <span className="foxeye-token-base-tooltip-text">Contract</span>
                                                                            </div>
                                                                        )}
                                                                        {!!item.is_locked && (
                                                                            <div className="foxeye-token-base-tooltip">
                                                                                <img className="foxeye-token-base-ic-lock" src={ic_lock}/>
                                                                                <span
                                                                                    className="foxeye-token-base-tooltip-text foxeye-token-base-locked-address">Locked Address</span>
                                                                            </div>
                                                                        )}

                                                                        {!!item.tag ? (
                                                                            <div className="foxeye-token-base-tooltip">
                                                                                <div className="foxeye-token-base-rank-addr">
                                                                                    <div className='foxeye-token-base-token-link' onClick={() => {
                                                                                        let linkUrl = 'https://etherscan.io/address/';
                                                                                        if (this.token_id == 1) {
                                                                                            linkUrl = 'https://etherscan.io/address/';
                                                                                        } else if (this.token_id == 56) {
                                                                                            linkUrl = 'https://bscscan.com/address/';
                                                                                        } else if (this.token_id == 66) {
                                                                                            linkUrl = 'https://www.oklink.com/en/okc/address/';
                                                                                        } else if (this.token_id == 128) {
                                                                                            linkUrl = 'https://hecoinfo.com/address/';
                                                                                        } else if (this.token_id == 137) {
                                                                                            linkUrl = 'https://polygonscan.com/address/';
                                                                                        } else if (this.token_id == 42161) {
                                                                                            linkUrl = 'https://arbiscan.io/address/';
                                                                                        } else if (this.token_id == 43114) {
                                                                                            linkUrl = 'https://snowtrace.io/address/';
                                                                                        } else if (this.token_id == 250) {
                                                                                            linkUrl = 'https://ftmscan.com/token/';
                                                                                        }
                                                                                        this.linkTo(linkUrl + item.address);
                                                                                    }}>
                                                                                        {item.tag}
                                                                                    </div>
                                                                                </div>
                                                                                <span className="foxeye-token-base-tooltip-text foxeye-token-base-tag">
                                                                            <span>Public Tag：{item.tag}</span><br/>
                                                                            <span>Address： {item.address}</span>
                                                                        </span>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="foxeye-token-base-rank-addr">
                                                                                <div className='foxeye-token-base-token-link' onClick={() => {
                                                                                    let linkUrl = 'https://etherscan.io/address/';
                                                                                    if (this.token_id == 1) {
                                                                                        linkUrl = 'https://etherscan.io/address/';
                                                                                    } else if (this.token_id == 56) {
                                                                                        linkUrl = 'https://bscscan.com/address/';
                                                                                    } else if (this.token_id == 66) {
                                                                                        linkUrl = 'https://www.oklink.com/en/okc/address/';
                                                                                    } else if (this.token_id == 128) {
                                                                                        linkUrl = 'https://hecoinfo.com/address/';
                                                                                    } else if (this.token_id == 137) {
                                                                                        linkUrl = 'https://polygonscan.com/address/';
                                                                                    } else if (this.token_id == 42161) {
                                                                                        linkUrl = 'https://arbiscan.io/address/';
                                                                                    } else if (this.token_id == 43114) {
                                                                                        linkUrl = 'https://snowtrace.io/address/';
                                                                                    } else if (this.token_id == 250) {
                                                                                        linkUrl = 'https://ftmscan.com/token/';
                                                                                    }
                                                                                    this.linkTo(linkUrl + item.address);
                                                                                }}>
                                                                                    {item.address.substr(0, 4) + '...' + item.address.substr(-4)}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div className="foxeye-token-base-flex-grow"></div>
                                                                        <div
                                                                            className="foxeye-token-base-rank-percent">{(item.percent * 100).toFixed(2)}%
                                                                        </div>
                                                                    </div>
                                                                    {!!item.locked_detail && (
                                                                        <div className="foxeye-token-base-locked-details">
                                                                            <div className="foxeye-token-base-item-title-detail">Locked Details</div>
                                                                            {item.locked_detail.map((detail, idx) => {
                                                                                if (idx < 3) {
                                                                                    return (
                                                                                        <div key={'detail-2-' + idx}>
                                                                                            <div
                                                                                                className="foxeye-token-base-detail-title foxeye-token-base-mt-2 foxeye-token-base-whitespace-nowrap">No{idx +1}:
                                                                                                {parseFloat(detail.amount).toFixed(2)} {token_name}</div>
                                                                                            <div
                                                                                                className="foxeye-token-base-detail-intro foxeye-token-base-flex foxeye-token-base-flex-col  foxeye-token-base-mt-1">
                                                                                                <span className="foxeye-token-base-flex foxeye-token-base-flex-col "><span>Start/Update Time:</span> <span>{detail.opt_time.substr(0, 19).replace('T', ' ')}(UTC)</span></span>
                                                                                                <span className="foxeye-token-base-mt-1  foxeye-token-base-foxeye-token-base-flex foxeye-token-base-flex-col "><span>End Time:</span> <span>{detail.end_time.substr(0, 19).replace('T', ' ')}(UTC)</span></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="foxeye-token-base-chart">
                                                            <div className="foxeye-token-base-item-title foxeye-token-base-chart-title">Top10 LP Holders</div>
                                                            {this.lp_holders_percent >= 50 ? (
                                                                <div className="foxeye-token-base-pie-chart foxeye-token-base-convex">
                                                                    <div className="foxeye-token-base-before"
                                                                         style={{transform: 'translate(-50%, -50%) rotate(' + this.lp_holders_percent / 100 + 'turn)'}}>

                                                                    </div>
                                                                    <div className="foxeye-token-base-percent">Top10<br/>{this.lp_holders_percent.toFixed(2)}%
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="foxeye-token-base-pie-chart">
                                                                    <div className="foxeye-token-base-before" style={{transform: 'translate(-50%, -50%) rotate(' + this.lp_holders_percent / 100 + 'turn)'}}></div>
                                                                    <div className="foxeye-token-base-percent">Top10<br/>{this.lp_holders_percent.toFixed(2)}%</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="foxeye-token-base-holders-empty foxeye-token-base-flex foxeye-token-base-flex-col foxeye-token-base-items-center">
                                                <img className="foxeye-token-base-icon-empty-big" src={icon_empty}/>
                                                <span>No items</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="foxeye-token-base-last-detection">
                                {this.is_true_token == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-first-item foxeye-token-base-true-token foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">True token</div>
                                            <div className="foxeye-token-base-item-desc">This token is issued by its declared team. Some scams
                                                will create a well-known token with the same name to defraud their users of
                                                their assets.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_true_token == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-fake-token foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-attention" src={ic_attention}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Fake token</div>
                                            <div className="foxeye-token-base-item-desc">This token is not issued by its declared team. Some scams
                                                will create a well-known token with the same name to defraud their users of
                                                their assets.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_verifiable_team == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-verifiable-team foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Verifiable team</div>
                                            <div className="foxeye-token-base-item-desc">The team information is verifiable. Some scam teams will
                                                have fake information on the team in order to attract users to invest.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_verifiable_team == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-verifiable-team foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Team information in doubt</div>
                                            <div className="foxeye-token-base-item-desc">The team information is in doubt or fake. Please confirm
                                                the credibility of team information to the project team.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_airdrop_scam == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-airdrop-scam foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-attention" src={ic_attention}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Airdrop scam</div>
                                            <div className="foxeye-token-base-item-desc">You may lose your assets if giving approval to the
                                                website of this token.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_airdrop_scam == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-airdrop-scam foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">No airdrop scam</div>
                                            <div className="foxeye-token-base-item-desc">This is not an airdrop scam. Many scams attract users
                                                through airdrops.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.trust_list == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-trust-list foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">Trusted Token</div>
                                            <div className="foxeye-token-base-item-desc">This token is a famous and trustworthy one.</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
