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
import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
import ScrollBar from '@better-scroll/scroll-bar'
import {iLocal} from "./utils";

export default class TokenView extends Component {
    state = {
        coingeckoLink: '',
        tokenLogo: 'none',
    }

    componentDidMount() {
        const { token_info } = this.props;
        const tokenAddress = token_info.tokenAddress;
        const chainId = token_info.token_id;
        // chrome.runtime.sendMessage({foxeye_extension_action: "foxeye_get_coingecko_info", chainId, tokenAddress}, result => {
        //     if (result) {
        //         this.setState(result);
        //     } else {
        //         this.setState({coingeckoLink: '', tokenLogo: ''});
        //     }
        // });
        this.setState({tokenLogo: `https://relayer.gopocket.finance/api/v1/getImage/${chainId}/${tokenAddress}`});

        if (this.props.fromAlert) {
            BScroll.use(MouseWheel)
            BScroll.use(ScrollBar)
            let bs = new BScroll('.foxeye-base-scroll', {
                mouseWheel: {
                    speed: 20,
                    invert: false,
                    easeTime: 300,
                    dampingFactor: 0
                },
                scrollY: true,
                scrollbar: true,
                click: true
            })
        }
    }

    copyToClipboard = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy);
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
            <div style={{width: '100%', height: '100%'}} className="foxeye-base-scroll">
                <div className="foxeye-token-base-result-cover">
                    {!this.props.fromAlert && (
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
                    )}
                    {!this.props.fromAlert && (
                        <div className='foxeye-token-base-token-banner-line' />
                    )}
                    <div className="foxeye-token-base-result foxeye-token-base-content">
                        <div className="foxeye-token-base-security-detection">
                            <div className="foxeye-token-base-title">{iLocal('Security_Detection')}</div>
                            <div className="foxeye-token-base-items-num foxeye-token-base-flex foxeye-token-base-items-center foxeye-token-base-flex-full">
                                <img className="foxeye-token-base-icon-attention" src={ic_attention} style={{marginRight: 5}}/>
                                {this.red_items_count > 1 ? (
                                    <span className="foxeye-token-base-item-title">{iLocal('risky_items', [this.red_items_count])}</span>
                                ) : (
                                    <span className="foxeye-token-base-item-title">{iLocal('risky_item', [this.red_items_count])}</span>
                                )}

                                <img className="foxeye-token-base-icon-warning foxeye-token-base-security-warning" src={ ic_warning } />
                                {this.orange_items_count > 1 ? (
                                    <span className="foxeye-token-base-item-title">{iLocal('attention_items', [this.orange_items_count])}</span>
                                ) : (
                                    <span className="foxeye-token-base-item-title">{iLocal('attention_item', [this.orange_items_count])}</span>
                                )}
                            </div>
                        </div>
                        <div className="foxeye-token-base-other-detection">
                            <div className="foxeye-token-base-contract-security">
                                <div className="foxeye-token-base-title">{iLocal('Contract_Security')}</div>
                                {this.is_open_source == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Contract_source_code_verified')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('contract_is_open_source')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_open_source == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-attention" src={ic_attention}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Contract_source_code_not_verified')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('contract_has_not_been_verified')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_proxy == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-is-proxy foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Proxy_contract')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('contract_is_Admin_Upgradeability')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_proxy == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-no-proxy foxeye-token-base-flex" >
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('No_proxy')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('no_proxy_in_contract')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_mintable == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-mint-function foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Mint_function')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('contain_additional_issuance_functions')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_mintable == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-no-mint-function foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('No_mint_function')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Mint_function_is_transparent')}
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
                                                            className="foxeye-token-base-item-title foxeye-token-base-address-title">{iLocal('Owner_Address')}： <span
                                                            className="foxeye-token-base-text-green-500" style={{lineBreak: "anywhere"}}>{this.owner_address}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="foxeye-token-base-item-title foxeye-token-base-address-title" style={{lineBreak: "anywhere"}}>{iLocal('Owner_Address')}：
                                                            {this.owner_address}</div>
                                                    )}

                                                    <div onClick={() => {this.copyToClipboard(this.owner_address)}}
                                                         data-title="copied"
                                                         className="foxeye-token-base-ic-copy foxeye-token-base-ml-2-5 foxeye-token-base-mt-1 foxeye-token-base-inline-block">
                                                        <img className="foxeye-token-base-ic-copy-img"
                                                             src={icon_copy} />
                                                    </div>
                                                </div>

                                                <div className="foxeye-token-base-item-desc">
                                                    {iLocal('owner_address_can_modify')}
                                                </div>
                                            </div>
                                        </div>

                                        {this.can_take_back_ownership == 1 && (
                                            <div className="foxeye-token-base-detect-item foxeye-token-base-retrievable-ownership foxeye-token-base-flex">
                                                <img className="foxeye-token-base-icon-warning" src={ic_warning} />
                                                <div>
                                                    <div className="foxeye-token-base-item-title">
                                                        {iLocal('Functions_with_retrievable_ownership')}
                                                    </div>
                                                    <div className="foxeye-token-base-item-desc">
                                                        {iLocal('regain_ownership_even')}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {this.can_take_back_ownership == 0 && (
                                            <div className="foxeye-token-base-detect-item foxeye-token-base-no-retrievable-ownership foxeye-token-base-flex">
                                                <img className="foxeye-token-base-icon-safe" src={ic_safe} />
                                                <div>
                                                    <div className="foxeye-token-base-item-title">
                                                        {iLocal('No_found_retrieves_ownership')}
                                                    </div>
                                                    <div className="foxeye-token-base-item-desc">
                                                        {iLocal('regain_ownership_even')}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {this.owner_change_balance == 1 && (
                                            <div className="foxeye-token-base-detect-item foxeye-token-base-owner-can-change-balance foxeye-token-base-flex">
                                                <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                                <div>
                                                    <div className="foxeye-token-base-item-title">{iLocal('Owner_can_change_balance')}</div>
                                                    <div className="foxeye-token-base-item-desc">
                                                        {iLocal('has_authority_to_modify')}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {this.owner_change_balance == 0 && (
                                            <div className="foxeye-token-base-detect-item foxeye-token-base-owner-cant-change-balance foxeye-token-base-flex">
                                                <img className="foxeye-token-base-icon-safe" src={ic_safe} />
                                                <div>
                                                    <div className="foxeye-token-base-item-title">{iLocal('Owner_cann_not_change_balance')}</div>
                                                    <div className="foxeye-token-base-item-desc">
                                                        {iLocal('not_found_to_have_authority_to_modify')}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="foxeye-token-base-flex foxeye-token-base-detect-item">
                                            {this.creator_address && this.creator_address.substr(0, 27) == '0x0000000000000000000000000' && (
                                                <div
                                                    className="foxeye-token-base-item-title">{iLocal('Creator_Address')}: <span
                                                    className="foxeye-token-base-text-green-500" style={{lineBreak: "anywhere"}}>{this.creator_address}</span>
                                                </div>
                                            )}

                                            {this.creator_address && this.creator_address.substr(0, 27) != '0x0000000000000000000000000' && (
                                                <div className="foxeye-token-base-item-title">{iLocal('Creator_Address')}: <span style={{lineBreak: "anywhere"}}>{this.creator_address}</span>
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
                                <div className="foxeye-token-base-title">{iLocal('Transcation_Security')}</div>
                                {(this.buy_tax || this.sell_tax) ? (
                                    <div className="foxeye-token-base-tax">
                                        <div className="foxeye-token-base-flex foxeye-token-base-flex-full" >
                                            {(this.buy_tax * 100).toFixed(2) < 10 && (
                                                <div className="foxeye-token-base-item-title">{iLocal('Buy_Tax')}:&nbsp;<span
                                                    className="foxeye-token-base-buy-tax foxeye-token-base-text-green-500">{(this.buy_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}

                                            {(this.buy_tax * 100).toFixed(2) >= 10 && (this.buy_tax * 100).toFixed(2) < 50 && (
                                                <div
                                                    className="foxeye-token-base-item-title">{iLocal('Buy_Tax')}:&nbsp;<span
                                                    className="foxeye-token-base-buy-tax foxeye-token-base-text-orange">{(this.buy_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}

                                            {(this.buy_tax * 100).toFixed(2) >= 50 && (
                                                <div className="foxeye-token-base-item-title">{iLocal('Buy_Tax')}:&nbsp;<span
                                                    className="foxeye-token-base-buy-tax foxeye-token-base-text-red">{(this.buy_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}

                                            {(this.sell_tax * 100).toFixed(2) < 10 && (
                                                <div className="foxeye-token-base-item-title foxeye-token-base-sell-tax-title">{iLocal('Sell_Tax')}:&nbsp;<span
                                                    className="foxeye-token-base-sell-tax foxeye-token-base-text-green-500">{(this.sell_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}

                                            {(this.sell_tax * 100).toFixed(2) >= 10 && (this.sell_tax * 100).toFixed(2) < 50 && (
                                                <div className="foxeye-token-base-item-title foxeye-token-base-sell-tax-title">{iLocal('Sell_Tax')}:&nbsp;<span
                                                    className="foxeye-token-base-sell-tax foxeye-token-base-text-orange">{(this.sell_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}

                                            {(this.sell_tax * 100).toFixed(2) >= 50 && (
                                                <div className="foxeye-token-base-item-title foxeye-token-base-sell-tax-title">{iLocal('Sell_Tax')}:&nbsp;<span
                                                    className="foxeye-token-base-sell-tax foxeye-token-base-text-red">{(this.sell_tax * 100).toFixed(2)}%</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="foxeye-token-base-item-desc">
                                            {iLocal('Above_may_be_considered')}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="foxeye-token-base-tax foxeye-token-base-tax-empty foxeye-token-base-flex foxeye-token-base-justify-center foxeye-token-base-items-center">
                                        <img className="foxeye-token-base-icon-empty-small" src={icon_empty} />
                                        <span>{iLocal('No_items')}</span>
                                    </div>
                                )}
                            </div>

                            <div className="foxeye-token-base-honeypot-risk">
                                <div className="foxeye-token-base-title">{iLocal('Honeypot_Risk')}</div>

                                {this.is_honeypot == 1 && (
                                    <div className="foxeye-token-base-detect-item honeypot foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-attention" src={ic_attention}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('May_token_is_honeypot')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('May_token_is_honeypot_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_honeypot == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-honeypot foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('appear_to_be_honeypot')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('appear_to_be_honeypot_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.transfer_pausable == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('can_suspend_trading')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('can_suspend_trading_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.transfer_pausable == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('No_codes_suspend_trading')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('No_codes_suspend_trading_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.cannot_sell_all == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Holders_cannot_sell_tokens')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Holders_cannot_sell_tokens_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.cannot_sell_all == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Holders_can_sell_token')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Holders_can_sell_token_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.trading_cooldown == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Trading_cooldown_function')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Trading_cooldown_function_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.trading_cooldown == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('No_trading_cooldown_function')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('No_trading_cooldown_function_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_anti_whale == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-anti-whale foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Anti_whale')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Anti_whale_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_anti_whale == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-pausable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">
                                                {iLocal('No_anti_whale')}
                                            </div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('No_anti_whale_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.slippage_modifiable == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-slippage-modifiable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Tax_can_be_modified')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Tax_can_be_modified_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.slippage_modifiable == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-slippage-not-modifiable foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Tax_cannot_be_modified')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Tax_cannot_be_modified_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_blacklisted == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-black-listed foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Blacklist_function')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Blacklist_function_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_blacklisted == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-black-listed foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('No_blacklist')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('No_blacklist_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_whitelisted == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-white-listed foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Whitelist_function')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Whitelist_function_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_whitelisted == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-white-listed foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('No_whitelist')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('No_whitelist_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {this.is_in_dex == 1 && (
                                <div className="foxeye-token-base-liquidity">
                                    <div className="foxeye-token-base-title">{iLocal('Liquidity')}</div>
                                    <div className="foxeye-token-base-dex">
                                        <div className="foxeye-token-base-flex foxeye-token-base-flex-col foxeye-token-base-mb-1">
                                            {this.dex_names.map((name, index) => (
                                                <div className="foxeye-token-base-dex-item" key={'dex_name-' + index} >
                                                    {this.dex_index == index && (
                                                        <div  className="foxeye-token-base-dex-item-inner foxeye-token-base-active">
                                                            {iLocal('Dex')}{index +1}: {name}
                                                        </div>
                                                    )}
                                                    {this.dex_index != index && (
                                                        <div  className="foxeye-token-base-dex-item-inner">
                                                            {iLocal('Dex')}{index +1}: {name}
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
                                                            {iLocal('Pool')}{index +1}：{item['pair'].substr(0, 4)}...{item['pair'].substr(-4)}
                                                        </div>

                                                        <div className="foxeye-token-base-dex-liquidity">{iLocal('Liquidity')}：${
                                                            parseFloat(item['liquidity']).toFixed(2)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="foxeye-token-base-dex-detail foxeye-token-base-dex-empty foxeye-token-base-flex foxeye-token-base-justify-center foxeye-token-base-items-center">
                                                <img className="foxeye-token-base-icon-empty-small" src={icon_empty}/>
                                                <span>{iLocal('No_items')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {(this.holders || this.lp_holders) && (
                                <div className="foxeye-token-base-info-security">
                                    <div className="foxeye-token-base-title">{iLocal('Info_Security')}</div>

                                    <div className="foxeye-token-base-holders-block">
                                        <div className="foxeye-token-base-item-title holders-info">{iLocal('Holders_Info')}</div>
                                        {this.holders ? (
                                            <div>
                                                <div className="foxeye-token-base-item-title foxeye-token-base-flex foxeye-token-base-flex-col foxeye-token-base-mt-1">
                                                    {this.holder_count > 1 ? (
                                                        <span>{iLocal('Holders_addressed', [this.holder_count])}</span>
                                                    ) : (
                                                        <span>{iLocal('Holders_address', [this.holder_count])}</span>
                                                    )}
                                                    <span className="foxeye-token-base-total-supply">{iLocal('Total_Supply')}：{this.total_supply}</span>
                                                </div>

                                                <div className="foxeye-token-base-top10-holders">
                                                    <div className="foxeye-token-base-item-title foxeye-token-base-top-10-title">{iLocal('Top10_Holders')}</div>
                                                    <div className="foxeye-token-base-rank-chart foxeye-token-base-flex foxeye-token-base-justify-between">
                                                        <div className="rank">
                                                            {this.holders.map((item, index) => (
                                                                <div key={item.address}>
                                                                    <div className="foxeye-token-base-rank-item foxeye-token-base-flex foxeye-token-base-items-center">
                                                                        <span>{index +1}.&nbsp;</span>
                                                                        {!!item.is_contract && (
                                                                            <div className="foxeye-token-base-tooltip">
                                                                                <img className="foxeye-token-base-ic-contract" src={ic_contract}/>
                                                                                <span className="foxeye-token-base-tooltip-text">{iLocal('Contract')}</span>
                                                                            </div>
                                                                        )}

                                                                        {!!item.is_locked && (
                                                                            <div className="foxeye-token-base-tooltip">
                                                                                <img className="foxeye-token-base-ic-lock" src={ic_lock}/>
                                                                                <span className="foxeye-token-base-tooltip-text foxeye-token-base-locked-address">{iLocal('Locked_Address')}</span>
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
                                                                                    <span>{iLocal('Public_Tag', [item.tag])}</span><br/>
                                                                                    <span>{iLocal('Address')}： {item.address}</span>
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
                                                                                            <span className="foxeye-token-base-flex foxeye-token-base-flex-col "><span>{iLocal('Start_or_Update_Time')}</span> <span>{
                                                                                                detail.opt_time.substr(0, 19).replace('T', ' ')
                                                                                            }(UTC)</span>
                                                                                            </span>
                                                                                                <span
                                                                                                    className="foxeye-token-base-mt-1  foxeye-token-base-flex foxeye-token-base-flex-col "><span>{iLocal('End_Time')}</span> <span>{
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
                                                                <div className="foxeye-token-base-holding-title"><span className="foxeye-token-base-font-bold">{iLocal('Owner_s_Holdings')}</span> {
                                                                    parseFloat(this.owner_balance)
                                                                    .toFixed(2)
                                                                }</div>
                                                                <div className="foxeye-token-base-holding-desc">{iLocal('Percent')}:
                                                                    {(this.owner_percent * 100).toFixed(2)}%
                                                                </div>
                                                            </div>
                                                            <div className="foxeye-token-base-mt-2 foxeye-token-base-flex foxeye-token-base-flex-col">
                                                                <div className="foxeye-token-base-holding-title"><span className="foxeye-token-base-font-bold">{iLocal('Creator_s_Holdings')}</span> {
                                                                    parseFloat(this.creator_balance)
                                                                    .toFixed(2)
                                                                }</div>
                                                                <div className="foxeye-token-base-holding-desc ">{iLocal('Percent')}:
                                                                    {(this.creator_percent * 100).toFixed(2)}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                        <div className="foxeye-token-base-chart">
                                                            <div className="foxeye-token-base-item-title foxeye-token-base-chart-title">{iLocal('Top10_Holders')}</div>
                                                            {this.holders_percent >= 50 ? (
                                                                <div className="foxeye-token-base-pie-chart foxeye-token-base-convex">
                                                                    <div className="foxeye-token-base-before"
                                                                         style={{transform: 'translate(-50%, -50%) rotate(' + this.holders_percent / 100 + 'turn)'}}></div>
                                                                    <div className="foxeye-token-base-percent">{iLocal('Top10')}<br/>{
                                                                        this.holders_percent
                                                                            .toFixed(2)
                                                                    }%</div>
                                                                </div>
                                                            ) : (
                                                                <div className="foxeye-token-base-pie-chart">
                                                                    <div className="foxeye-token-base-before"
                                                                         style={{transform: 'translate(-50%, -50%) rotate(' + this.holders_percent / 100 + 'turn)'}}></div>
                                                                    <div className="foxeye-token-base-percent">{iLocal('Top10')}<br/>{
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
                                                <span>{iLocal('No_items')}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="foxeye-token-base-lp-holders-block">
                                        <div className="foxeye-token-base-item-title foxeye-token-base-holders-info foxeye-token-base-lp-holders">{iLocal('LP_Holders_Info')}</div>

                                        {(this.lp_holders && this.lp_holder_count > 0) ? (
                                            <div>
                                                <div className="foxeye-token-base-item-title foxeye-token-base-flex foxeye-token-base-flex-col foxeye-token-base-mt-1">
                                                    {this.lp_holder_count > 1 ? (
                                                        <span>{iLocal('LP_Holders_addresses', [this.lp_holder_count])}</span>
                                                    ) : (
                                                        <span>{iLocal('LP_Holders_address', [this.lp_holder_count])}</span>
                                                    )} <span className="foxeye-token-base-total-supply">{iLocal('Total_Supply')}：{this.lp_total_supply}</span>
                                                </div>

                                                <div className="foxeye-token-base-top10-holders">
                                                    <div className="foxeye-token-base-item-title foxeye-token-base-top-10-title">{iLocal('Top10_LP_Holders')}</div>
                                                    <div className="foxeye-token-base-rank-chart foxeye-token-base-flex foxeye-token-base-justify-between">
                                                        <div className="foxeye-token-base-rank">
                                                            {this.lp_holders.map((item, index) => (
                                                                <div key={item.address}>
                                                                    <div className="foxeye-token-base-rank-item foxeye-token-base-flex foxeye-token-base-items-center">
                                                                        <span>{index +1}.&nbsp;</span>
                                                                        {!!item.is_contract && (
                                                                            <div className="foxeye-token-base-tooltip">
                                                                                <img className="foxeye-token-base-ic-contract" src={ic_contract}/>
                                                                                <span className="foxeye-token-base-tooltip-text">{iLocal('Contract')}</span>
                                                                            </div>
                                                                        )}
                                                                        {!!item.is_locked && (
                                                                            <div className="foxeye-token-base-tooltip">
                                                                                <img className="foxeye-token-base-ic-lock" src={ic_lock}/>
                                                                                <span
                                                                                    className="foxeye-token-base-tooltip-text foxeye-token-base-locked-address">{iLocal('Locked_Address')}</span>
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
                                                                            <span>{iLocal('Public_Tag', [item.tag])}</span><br/>
                                                                            <span>{iLocal('Address')}： {item.address}</span>
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
                                                                            <div className="foxeye-token-base-item-title-detail">{iLocal('Locked_Details')}</div>
                                                                            {item.locked_detail.map((detail, idx) => {
                                                                                if (idx < 3) {
                                                                                    return (
                                                                                        <div key={'detail-2-' + idx}>
                                                                                            <div
                                                                                                className="foxeye-token-base-detail-title foxeye-token-base-mt-2 foxeye-token-base-whitespace-nowrap">No{idx +1}:
                                                                                                {parseFloat(detail.amount).toFixed(2)} {this.token_name}</div>
                                                                                            <div
                                                                                                className="foxeye-token-base-detail-intro foxeye-token-base-flex foxeye-token-base-flex-col  foxeye-token-base-mt-1">
                                                                                                <span className="foxeye-token-base-flex foxeye-token-base-flex-col "><span>{iLocal('Start_or_Update_Time')}</span> <span>{detail.opt_time.substr(0, 19).replace('T', ' ')}(UTC)</span></span>
                                                                                                <span className="foxeye-token-base-mt-1  foxeye-token-base-foxeye-token-base-flex foxeye-token-base-flex-col "><span>{iLocal('End_Time')}</span> <span>{detail.end_time.substr(0, 19).replace('T', ' ')}(UTC)</span></span>
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
                                                            <div className="foxeye-token-base-item-title foxeye-token-base-chart-title">{iLocal('Top10_LP_Holders')}</div>
                                                            {this.lp_holders_percent >= 50 ? (
                                                                <div className="foxeye-token-base-pie-chart foxeye-token-base-convex">
                                                                    <div className="foxeye-token-base-before"
                                                                         style={{transform: 'translate(-50%, -50%) rotate(' + this.lp_holders_percent / 100 + 'turn)'}}>

                                                                    </div>
                                                                    <div className="foxeye-token-base-percent">{iLocal('Top10')}<br/>{this.lp_holders_percent.toFixed(2)}%
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="foxeye-token-base-pie-chart">
                                                                    <div className="foxeye-token-base-before" style={{transform: 'translate(-50%, -50%) rotate(' + this.lp_holders_percent / 100 + 'turn)'}}></div>
                                                                    <div className="foxeye-token-base-percent">{iLocal('Top10')}<br/>{this.lp_holders_percent.toFixed(2)}%</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="foxeye-token-base-holders-empty foxeye-token-base-flex foxeye-token-base-flex-col foxeye-token-base-items-center">
                                                <img className="foxeye-token-base-icon-empty-big" src={icon_empty}/>
                                                <span>{iLocal('No_items')}</span>
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
                                            <div className="foxeye-token-base-item-title">{iLocal('True_token')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('True_token_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_true_token == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-fake-token foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-attention" src={ic_attention}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Fake_token')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Fake_token_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_verifiable_team == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-verifiable-team foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Verifiable_team')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Verifiable_team_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_verifiable_team == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-verifiable-team foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-warning" src={ic_warning}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Team_information_in_doubt')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Team_information_in_doubt_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_airdrop_scam == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-airdrop-scam foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-attention" src={ic_attention}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Airdrop_scam')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('Airdrop_scam_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.is_airdrop_scam == 0 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-not-airdrop-scam foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('No_airdrop_scam')}</div>
                                            <div className="foxeye-token-base-item-desc">
                                                {iLocal('No_airdrop_scam_desc')}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.trust_list == 1 && (
                                    <div className="foxeye-token-base-detect-item foxeye-token-base-trust-list foxeye-token-base-flex">
                                        <img className="foxeye-token-base-icon-safe" src={ic_safe}/>
                                        <div>
                                            <div className="foxeye-token-base-item-title">{iLocal('Trusted_Token')}</div>
                                            <div className="foxeye-token-base-item-desc">{iLocal('Trusted_Token_desc')}</div>
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
