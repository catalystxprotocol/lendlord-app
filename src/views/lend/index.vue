<template>
    <div class="lend">
        <div class="lend__top">
            <div class="lend__top__iconfont_wrap" @click="goBack">
                <i class="iconfont icon-zhankai"></i>
            </div>
            <h2 class="lend__top__title">List for lend</h2>
        </div>
        <div class="lend__content">
            <div class="lend__content__left">
                <div class="lend__content__left__set_wrap">
                    <div class="lend__content__left__set_wrap__unit_wrap">
                        <div class="lend__content__left__set_wrap__unit_wrap__title"
                            >Set unit price</div
                        >
                        <div
                            class="lend__content__left__set_wrap__unit_wrap__content"
                            :class="{
                                margin_top_none: showUnitPriceTip && !lendLoading
                            }"
                        >
                            <div
                                class="lend__content__left__set_wrap__unit_wrap__content__token_dropdown"
                            >
                                <div
                                    v-if="lendLoading"
                                    class="lend__content__left__set_wrap__unit_wrap__content__token_dropdown__skeleton"
                                >
                                    <MySkeleton
                                        class="lend__content__left__set_wrap__unit_wrap__content__token_dropdown__skeleton__bg"
                                    />
                                    <MySkeleton
                                        :animated="false"
                                        class="lend__content__left__set_wrap__unit_wrap__content__token_dropdown__skeleton__img"
                                    />
                                </div>
                                <TokenDropdown
                                    v-else
                                    :status="currentTokenId"
                                    :options="tokenOptions"
                                    @on-selected-change="onSelectedToken"
                                />
                            </div>
                            <div
                                class="lend__content__left__set_wrap__unit_wrap__content__input_wrap"
                            >
                                <MySkeleton
                                    v-if="lendLoading"
                                    class="lend__content__left__set_wrap__unit_wrap__content__input_wrap__skeleton"
                                />
                                <LendInput v-else v-model:input="unitPriceInput" placeholder="0" />
                            </div>
                        </div>
                        <TextTip
                            v-show="showUnitPriceTip && !lendLoading"
                            class="lend__content__left__set_wrap__unit_wrap__tip"
                            text="The maximum number cannot exceed 10 digits"
                        />
                    </div>
                    <div class="lend__content__left__set_wrap__rental_wrap">
                        <div class="lend__content__left__set_wrap__rental_wrap__title"
                            >Set min rental peiro</div
                        >
                        <div
                            class="lend__content__left__set_wrap__rental_wrap__content"
                            :class="{
                                margin_top_none: showMinRentalPeirodTip && !lendLoading
                            }"
                        >
                            <MySkeleton
                                v-if="lendLoading"
                                class="lend__content__left__set_wrap__rental_wrap__content__skeleton"
                            />
                            <LendInput
                                v-else
                                v-model:input="minRentalPeirodInput"
                                placeholder="1"
                            />
                        </div>
                        <TextTip
                            v-show="showMinRentalPeirodTip && !lendLoading"
                            class="lend__content__left__set_wrap__rental_wrap__tip"
                            :text="`The maximum rental period cannot exceed ${maxRentPeirod} days`"
                        />
                    </div>
                    <div class="lend__content__left__set_wrap__rent_wrap">
                        <div class="lend__content__left__set_wrap__rent_wrap__title"
                            >Available to rent until</div
                        >
                        <div class="lend__content__left__set_wrap__rent_wrap__content">
                            <MySkeleton
                                v-if="lendLoading"
                                class="lend__content__left__set_wrap__rent_wrap__content__skeleton"
                            />
                            <DateTimePicker
                                v-else
                                v-model:date="rentUntilDate"
                                :current-time="currentTime"
                            />
                        </div>
                    </div>
                    <div class="lend__content__left__set_wrap__tips_wrap">
                        <div class="lend__content__left__set_wrap__tips_wrap__title"
                            >* <span>Tips</span></div
                        >
                        <div class="lend__content__left__set_wrap__tips_wrap__content">
                            {{
                                !lendLoading
                                    ? `Upon posting your NFT rental information, you will receive a vNFT, which
                            acts as the only proof of ownership for retrieving the original NFT.
                            Make sure to keep it secure. During the rental period, the original NFT
                            will not be available for retrieval. However, you can retrieve it once
                            the rental period expires.`
                                    : DEFAULT_DISPLAY_TEXT
                            }}
                        </div>
                    </div>
                </div>
                <div class="lend__content__left__summary_wrap">
                    <div class="lend__content__left__summary_wrap__title">Summary</div>
                    <ul class="lend__content__left__summary_wrap__content">
                        <li
                            v-show="showDateConfilctTip && !lendLoading"
                            class="lend__content__left__summary_wrap__content__tip_wrap"
                        >
                            <TextTip
                                text="If the min rental peirod and rent until time conflict, rent until time
                            shall prevail"
                            />
                        </li>
                        <li class="lend__content__left__summary_wrap__content__item">
                            <span class="lend__content__left__summary_wrap__content__item__label"
                                >Listing Price</span
                            >
                            <span class="lend__content__left__summary_wrap__content__item__value">
                                <span>{{
                                    !lendLoading ? displayPrice : DEFAULT_DISPLAY_TEXT
                                }}</span>
                                <span
                                    class="lend__content__left__summary_wrap__content__item__value__unit"
                                    >{{ !lendLoading ? currrentTokenInfo.symbol : '' }}</span
                                >
                            </span>
                        </li>
                        <li class="lend__content__left__summary_wrap__content__item">
                            <span class="lend__content__left__summary_wrap__content__item__label">
                                Service Fee
                            </span>
                            <span class="lend__content__left__summary_wrap__content__item__value">
                                <span>{{
                                    !lendLoading
                                        ? toPercentage(nftInfo.serviceFee)
                                        : DEFAULT_DISPLAY_TEXT
                                }}</span>
                            </span>
                        </li>
                        <li class="lend__content__left__summary_wrap__content__item">
                            <span class="lend__content__left__summary_wrap__content__item__label"
                                >Rental Peirod</span
                            >
                            <span class="lend__content__left__summary_wrap__content__item__value">
                                <span>{{
                                    !lendLoading ? displayRentalPeirod : DEFAULT_DISPLAY_TEXT
                                }}</span>
                                <span
                                    class="lend__content__left__summary_wrap__content__item__value__unit"
                                    >{{ !lendLoading ? displayRentalPeirodUnit : '' }}</span
                                >
                            </span>
                        </li>
                        <li class="lend__content__left__summary_wrap__content__item">
                            <span class="lend__content__left__summary_wrap__content__item__label"
                                >Available for rent to</span
                            >
                            <span class="lend__content__left__summary_wrap__content__item__value">
                                <span>{{
                                    !lendLoading ? disPlayRentUntilDate : DEFAULT_DISPLAY_TEXT
                                }}</span>
                            </span>
                        </li>
                        <li class="lend__content__left__summary_wrap__content__item">
                            <span
                                class="lend__content__left__summary_wrap__content__item__label largeLabel"
                                >Potential earnings</span
                            >
                            <span class="lend__content__left__summary_wrap__content__item__value">
                                <span>{{
                                    !lendLoading ? earningsPrice : DEFAULT_DISPLAY_TEXT
                                }}</span>
                                <span
                                    class="lend__content__left__summary_wrap__content__item__value__unit"
                                    >{{
                                        !lendLoading ? `${currrentTokenInfo.symbol} / Day` : ''
                                    }}</span
                                >
                            </span>
                        </li>
                        <li class="lend__content__left__summary_wrap__content__button">
                            <MyButton
                                :button-text="buttonText"
                                :is-ghost-button="false"
                                :disable="lendLoading"
                                @callback="lendFn"
                            />
                        </li>
                    </ul>
                </div>
            </div>
            <div class="lend__content__right">
                <div class="lend__content__right__image">
                    <MySkeleton v-if="lendLoading" class="lend__content__right__image__skeleton" />
                    <NftImage
                        v-else
                        class="lend__content__right__image__nft_image"
                        :src="nftInfo.nftIamge"
                    />
                </div>
                <div class="lend__content__right__content">
                    <div class="lend__content__right__content__token_id">{{
                        !lendLoading ? nftInfo.tokenId : DEFAULT_DISPLAY_TEXT
                    }}</div>
                    <div class="lend__content__right__content__collection_name">{{
                        !lendLoading ? nftInfo.collectionName : DEFAULT_DISPLAY_TEXT
                    }}</div>
                    <div class="lend__content__right__content__unit_price_wrap">
                        <div class="lend__content__right__content__unit_price_wrap__img">
                            <MySkeleton
                                v-if="lendLoading"
                                class="lend__content__right__content__unit_price_wrap__img__skeleton"
                            />
                            <img v-else :src="currrentTokenInfo.imgUrl" alt="" />
                        </div>
                        <span class="lend__content__right__content__unit_price_wrap__price">{{
                            !lendLoading ? displayPrice : DEFAULT_DISPLAY_TEXT
                        }}</span>
                        <span class="lend__content__right__content__unit_price_wrap__symbol">{{
                            !lendLoading ? currrentTokenInfo.symbol : ''
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <WalletSwitchPopover
        :show="showWalletSwitchPopover"
        :net-work="currentChainName"
        @cancel="closeWalletSwitchPopover"
        @switch="switchChain"
    ></WalletSwitchPopover>
    <WalletLoading :show="showLoadingPopover"></WalletLoading>
</template>

<script setup lang="ts">
    import DateTimePicker from './components/DateTimePicker.vue';
    import LendInput from './components/LendInput.vue';
    import TextTip from './components/TextTip.vue';
    import WalletSwitchPopover from '@/components/WalletSwitchPopover.vue';

    import { DEFAULT_DISPLAY_TEXT } from '@/constants';
    import { toPercentage } from '@/utils/calculate';
    import { useLend } from './composable';
    import WalletLoading from '@/components/WalletLoading.vue';

    const {
        goBack,
        lendLoading,
        showUnitPriceTip,
        currentTokenId,
        tokenOptions,
        onSelectedToken,
        unitPriceInput,
        showMinRentalPeirodTip,
        minRentalPeirodInput,
        rentUntilDate,
        currentTime,
        showDateConfilctTip,
        displayPrice,
        currrentTokenInfo,
        maxRentPeirod,
        displayRentalPeirod,
        displayRentalPeirodUnit,
        disPlayRentUntilDate,
        earningsPrice,
        buttonText,
        nftInfo,
        lendFn,
        showWalletSwitchPopover,
        closeWalletSwitchPopover,
        currentChainName,
        switchChain,
        showLoadingPopover
    } = useLend();
</script>

<style lang="less" scoped>
    .lend {
        max-width: 1200px;
        margin: 0 auto;
        padding: 36px 10px 176px;

        &__top {
            display: flex;
            align-items: center;
            margin-bottom: 24px;

            &__iconfont_wrap {
                padding-right: 12px;
                .cursor_pointer;

                .iconfont {
                    display: inline-block;
                    color: var(--bj-primary-color);
                    font-size: 12px;
                    transform: translateY(-1px) rotate(90deg);
                }
            }

            &__title {
                .sub_title_font;

                margin-bottom: 0;
            }
        }

        &__content {
            display: flex;

            &__left {
                width: 512px;
                margin-right: 60px;

                &__set_wrap {
                    .card_container;

                    margin-bottom: 24px;
                    padding: 16px 16px 24px;

                    &__unit_wrap {
                        &__title {
                            .text_font_bold;
                        }

                        &__content {
                            display: flex;
                            height: 40px;
                            margin: 12px 0 32px;

                            &__token_dropdown {
                                width: 124px;

                                &__skeleton {
                                    position: relative;
                                    width: 100%;
                                    height: 100%;
                                    border-radius: var(--border-radius-normal);

                                    &__bg {
                                        width: 100%;
                                        height: 100%;
                                        // background-color: var(--bj-background-color-third);
                                        border-radius: var(--border-radius-normal);
                                    }

                                    &__img {
                                        position: absolute;
                                        top: 6px;
                                        left: 8px;
                                        z-index: 1;
                                        width: 28px;
                                        height: 28px;
                                        // background: #f2f0ec;
                                        border-radius: 50%;
                                    }
                                }
                            }

                            &__input_wrap {
                                flex: 1;
                                margin-left: 8px;

                                &__skeleton {
                                    width: 100%;
                                    height: 100%;
                                    // background-color: var(--bj-background-color-third);
                                    border-radius: var(--border-radius-normal);
                                }
                            }
                        }

                        .margin_top_none {
                            margin-bottom: 0;
                        }

                        &__tip {
                            margin: 8px 0 24px;
                        }
                    }

                    &__rental_wrap {
                        &__title {
                            .text_font_bold;
                        }

                        &__content {
                            margin: 12px 0 32px;

                            &__skeleton {
                                width: 100%;
                                height: 40px;
                                // background-color: var(--bj-background-color-third);
                                border-radius: var(--border-radius-normal);
                            }
                        }

                        .margin_top_none {
                            margin-bottom: 0;
                        }

                        &__tip {
                            margin: 8px 0 24px;
                        }
                    }

                    &__rent_wrap {
                        &__title {
                            .text_font_bold;
                        }

                        &__content {
                            height: 40px;
                            margin: 12px 0 32px;

                            &__skeleton {
                                width: 100%;
                                height: 100%;
                                // background: var(--bj-background-color-third);
                                border-radius: var(--border-radius-normal);
                            }
                        }
                    }

                    &__tips_wrap {
                        &__title {
                            .text_font_bold;
                        }

                        &__content {
                            margin-top: 10px;
                            line-height: 22px;
                            .small_text_font;
                        }
                    }
                }

                &__summary_wrap {
                    .card_container;

                    &__title {
                        .text_font_bold;

                        padding: 10px 16px;
                        border-bottom: 1px solid var(--bj-border-color);
                    }

                    &__content {
                        padding: 8px 16px 24px;

                        &__tip_wrap {
                            margin: 7px 0 4px;
                        }

                        &__item {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            height: 28px;
                            margin-top: 12px;

                            &__label {
                                .small_text_font;

                                line-height: 22px;
                            }

                            .largeLabel {
                                .text_font;
                            }

                            &__value {
                                .text_font_bold;

                                display: flex;
                                align-items: center;

                                &__unit {
                                    .small_text_font;

                                    margin-left: 4px;
                                }
                            }
                        }

                        &__button {
                            margin-top: 16px;
                        }
                    }
                }
            }

            &__right {
                .card_container;

                align-self: baseline;
                width: 600px;

                &__image {
                    width: 100%;
                    height: 600px;

                    &__skeleton {
                        width: 100%;
                        height: 100%;
                        border-radius: 16px 16px 0 0;
                    }

                    &__nft_image {
                        width: 100%;
                        height: 100%;
                        border-radius: var(--border-radius-second) var(--border-radius-second) 0 0;
                    }
                }

                &__content {
                    padding: 24px;

                    &__token_id {
                        .sub_title_font;

                        margin-bottom: 8px;
                        word-break: break-word;
                    }

                    &__collection_name {
                        .text_font;

                        margin-bottom: 24px;
                        word-break: break-word;
                    }

                    &__unit_price_wrap {
                        display: flex;
                        align-items: center;
                        height: 34px;

                        &__img {
                            width: 24px;
                            height: 24px;

                            &__skeleton {
                                width: 100%;
                                height: 100%;
                                // background: #f2f0ec;
                                border-radius: 50%;
                            }

                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        &__price {
                            .sub_title_font;

                            margin: 0 8px;
                        }

                        &__symbol {
                            .text_font;

                            line-height: 27px;
                        }
                    }
                }
            }
        }
    }
</style>
