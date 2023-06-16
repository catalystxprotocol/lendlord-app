<template>
    <div class="profile_detail">
        <div class="profile_detail__collection">
            <div class="profile_detail__collection__img_box">
                <div v-if="loading" class="profile_detail__collection__img_box__loading"></div>
                <NftImage v-else :src="String(itemDetailInfo.collectionImg)"></NftImage>
            </div>
            <div class="profile_detail__collection__info">
                <div class="profile_detail__collection__info__subtitle">
                    {{ itemDetailInfo.collectionName }}
                </div>
                <div class="profile_detail__collection__info__title">
                    {{ itemDetailInfo.tokenId }}
                </div>
                <div class="profile_detail__collection__info__owner_info">
                    <div class="profile_detail__collection__info__owner_info__title"> Owner </div>
                    <div class="profile_detail__collection__info__owner_info__content">
                        {{ itemDetailInfo.owner }}
                    </div>
                </div>
                <div
                    v-if="itemDetailInfo.nftStatus == NftStatus.listedAndDeal"
                    class="profile_detail__collection__info__user_info"
                >
                    <div class="profile_detail__collection__info__user_info__user">
                        <div class="profile_detail__collection__info__user_info__user__title">
                            User
                        </div>
                        <div class="profile_detail__collection__info__user_info__user__content">
                            {{ itemDetailInfo.user }}
                        </div>
                    </div>
                    <div class="profile_detail__collection__info__user_info__rent_after">
                        <div class="profile_detail__collection__info__user_info__rent_after__title">
                            Available for rent after
                        </div>
                        <div
                            class="profile_detail__collection__info__user_info__rent_after__content"
                        >
                            {{ itemDetailInfo.rentAfter }}
                        </div>
                    </div>
                </div>
                <div class="profile_detail__collection__info__card">
                    <div class="profile_detail__collection__info__card__title">
                        <div
                            v-if="itemDetailInfo.nftStatus == NftStatus.listed"
                            class="profile_detail__collection__info__card__title__icon_box"
                        >
                            <i class="iconfont icon-shijian"></i>
                        </div>
                        <div
                            v-if="itemDetailInfo.nftStatus == NftStatus.listed"
                            class="profile_detail__collection__info__card__title__text"
                        >
                            Available until
                            <span class="profile_detail__collection__info__card__title__text__bold">
                                {{ itemDetailInfo.availableUntil }}
                            </span>
                            at
                            <span class="profile_detail__collection__info__card__title__text__bold">
                                {{ itemDetailInfo.availableUntilMin }}
                            </span>
                        </div>
                        <div v-else class="profile_detail__collection__info__card__title__title">
                            Rental Information
                        </div>
                    </div>
                    <div class="profile_detail__collection__info__card__bottom">
                        <div class="profile_detail__collection__info__card__bottom__price">
                            <div
                                class="profile_detail__collection__info__card__bottom__price__title"
                            >
                                Current Price
                            </div>
                            <div
                                class="profile_detail__collection__info__card__bottom__price__content"
                            >
                                <div
                                    class="profile_detail__collection__info__card__bottom__price__content__icon_box"
                                >
                                    <div
                                        v-if="loading"
                                        class="profile_detail__collection__info__card__bottom__price__content__icon_box__loading"
                                    ></div>
                                    <img
                                        v-else
                                        :src="itemDetailInfo.priceIcon"
                                        alt=""
                                        class="profile_detail__collection__info__card__bottom__price__content__icon_box__img"
                                    />
                                </div>
                                <div
                                    class="profile_detail__collection__info__card__bottom__price__content__count"
                                >
                                    {{ itemDetailInfo.price }}
                                </div>
                                <div
                                    class="profile_detail__collection__info__card__bottom__price__content__unit"
                                >
                                    {{ itemDetailInfo.priceUnit }}
                                </div>
                            </div>
                        </div>
                        <div class="profile_detail__collection__info__card__bottom__period">
                            <div
                                class="profile_detail__collection__info__card__bottom__period__title"
                            >
                                Rent Period
                            </div>
                            <div
                                class="profile_detail__collection__info__card__bottom__period__content"
                            >
                                <div
                                    class="profile_detail__collection__info__card__bottom__period__content__count"
                                >
                                    {{ itemDetailInfo.rentPeriod }}
                                </div>
                                <div
                                    class="profile_detail__collection__info__card__bottom__period__content__unit"
                                >
                                    {{ itemDetailInfo.rentPeriodUnit }}
                                </div>
                            </div>
                        </div>
                        <div class="profile_detail__collection__info__card__bottom__btn_box">
                            <MyButton
                                v-if="loading"
                                button-text="--"
                                :disable="true"
                                :is-ghost-button="false"
                            ></MyButton>
                            <MyButton
                                v-else
                                :button-text="
                                    itemDetailInfo.nftStatus == NftStatus.idelOwner
                                        ? 'Lend'
                                        : 'Rent'
                                "
                                :disable="
                                    itemDetailInfo.nftStatus == NftStatus.listedAndDeal ||
                                    itemDetailInfo.nftStatus == NftStatus.idle
                                "
                                :is-ghost-button="false"
                                @callback="btnCallback"
                            ></MyButton>
                        </div>
                        <div class="profile_detail__collection__info__card__bottom__line"></div>
                    </div>
                </div>
                <div class="profile_detail__collection__info__item_activity">
                    <div class="profile_detail__collection__info__item_activity__title_box">
                        <div
                            class="profile_detail__collection__info__item_activity__title_box__title"
                        >
                            Item Activity
                        </div>
                        <div
                            class="profile_detail__collection__info__item_activity__title_box__fold_box"
                            @click="toggleExpansion"
                        >
                            <i v-if="isExpansion" class="iconfont icon-shouqi"></i>
                            <i v-else class="iconfont icon-zhankai1"></i>
                        </div>
                    </div>
                    <div
                        v-show="isExpansion"
                        class="profile_detail__collection__info__item_activity__bottom"
                    >
                        <div
                            class="profile_detail__collection__info__item_activity__bottom__search_box"
                        >
                            <BaseDropdown
                                :options="itemActivityOptions"
                                :status="selectStatus"
                                @on-selected-change="selectedChange"
                            ></BaseDropdown>
                        </div>
                        <ItemActivityTable
                            :table-data="tableData"
                            :total-page="Number(totalPage)"
                            :current-page="Number(currentPage)"
                            :table-loading="Boolean(tableDataLoading)"
                            :column="column"
                            @load-data="rollTrigger"
                        ></ItemActivityTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import NftImage from '@/components/NftImage.vue';
    import MyButton from '@/components/MyButton.vue';
    import { useItemDetailsModule } from '@/views/itemDetails/composable';
    import ItemActivityTable from '@/views/itemDetails/components/ItemActivityTable.vue';

    const {
        itemActivityOptions,
        totalPage,
        currentPage,
        tableData,
        isExpansion,
        toggleExpansion,
        itemDetailInfo,
        loading,
        selectedChange,
        column,
        tableDataLoading,
        btnCallback,
        selectStatus,
        rollTrigger,
        NftStatus
    } = useItemDetailsModule();
</script>

<style lang="less" scoped>
    .profile_detail {
        width: 1200px;
        margin: 0 auto;

        &__collection {
            display: flex;
            width: 100%;
            padding-top: 48px;

            &__img_box {
                width: 460px;
                height: 460px;
                overflow: hidden;
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 16px 20px 0 var(--bj-box-shadow-third);

                &__loading {
                    width: 100%;
                    height: 100%;
                    background: var(--bj-background-color-fifth);
                }

                .image_wrap {
                    width: 100%;
                    height: 100%;
                }
            }

            &__info {
                width: 700px;
                margin-left: 36px;

                &__subtitle {
                    color: var(--bj-text-normal);
                    font-weight: 400;
                    font-size: 18px;
                    font-family: Inter-Regular, Inter;
                    line-height: 28px;
                    white-space: normal;
                    word-break: break-all;
                }

                &__title {
                    .sub_title_font;

                    margin-top: 16px;
                    white-space: normal;
                    word-break: break-all;
                }

                &__owner_info {
                    display: flex;
                    margin-top: 12px;

                    &__title {
                        .small_text_font;
                    }

                    &__content {
                        .small_text_font_bold;

                        margin-left: 12px;
                    }
                }

                &__user_info {
                    display: flex;
                    margin-top: 12px;

                    &__rent_after {
                        margin-left: 80px;
                    }

                    &__user,
                    &__rent_after {
                        display: flex;

                        &__title {
                            .small_text_font;
                        }

                        &__content {
                            .small_text_font_bold;

                            margin-left: 12px;
                        }
                    }
                }

                &__card {
                    width: 100%;
                    margin-top: 20px;
                    overflow: hidden;
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 16px 20px 0 var(--bj-box-shadow-card);

                    &__title {
                        display: flex;
                        align-items: center;
                        height: 48px;
                        padding-left: 16px;
                        border-bottom: 1px solid var(--bj-border-color);

                        &__icon_box {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 24px;
                            height: 24px;
                            margin-right: 8px;
                            background: var(--bj-background-color-fourth);
                            border-radius: 50%;

                            .iconfont {
                                font-size: 16px;
                            }
                        }

                        &__text {
                            .small_text_font;

                            &__bold {
                                .small_text_font_bold;
                            }
                        }

                        &__title {
                            .text_font_bold;
                        }
                    }

                    &__bottom {
                        display: flex;
                        flex-wrap: wrap;
                        box-sizing: border-box;
                        padding: 19px 0 16px;

                        &__price,
                        &__period {
                            flex-shrink: 0;
                            box-sizing: border-box;
                            width: 50%;
                            padding-left: 16px;

                            &__title {
                                color: var(--bj-text-normal);
                                font-weight: 400;
                                font-size: 14px;
                                line-height: 18px;
                            }

                            &__content {
                                display: flex;
                                align-items: center;
                                margin-top: 8px;

                                &__icon_box {
                                    width: 24px;
                                    height: 24px;
                                    margin-right: 8px;

                                    &__loading {
                                        width: 24px;
                                        height: 24px;
                                        background: #f2f0ec;
                                        border-radius: 50%;
                                    }

                                    &__img {
                                        width: 100%;
                                        height: 100%;
                                    }
                                }

                                &__count {
                                    .text_font_bold;
                                }

                                &__unit {
                                    margin-left: 4px;
                                    color: var(--bj-text-normal);
                                    font-weight: 400;
                                    font-size: 14px;
                                    line-height: 18px;
                                }
                            }
                        }

                        &__btn_box {
                            width: 200px;
                            height: 32px;
                            margin: 20px 0 0 16px;
                            border-radius: 8px;

                            .my_button {
                                height: 100%;
                            }
                        }
                    }
                }

                &__item_activity {
                    width: 100%;
                    margin-top: 24px;
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 16px 20px 0 var(--bj-box-shadow-card);
                    // 取消双击选中
                    -moz-user-select: none;
                    -ms-user-select: none;
                    -webkit-user-select: none;
                    user-select: none;

                    &__title_box {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        height: 48px;
                        padding: 0 16px;

                        &__title {
                            .text_font_bold;
                        }

                        &__fold_box {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-sizing: border-box;
                            width: 28px;
                            height: 28px;
                            background: var(--bj-background-color-third);
                            border: 1px solid var(--bj-border-color);
                            border-radius: 8px;
                            cursor: pointer;
                        }

                        &__fold_box:hover {
                            border: 1px solid var(--bj-primary-color);
                        }
                    }

                    &__bottom {
                        width: 100%;
                        padding-bottom: 20px;
                        border-top: 1px solid var(--bj-border-color);

                        &__search_box {
                            display: flex;
                            align-items: center;
                            box-sizing: border-box;
                            height: 54px;
                            padding: 0 16px;

                            .el-dropdown {
                                height: 32px;

                                ::v-deep(.dropdown_container) {
                                    display: flex;
                                    align-items: center;
                                }

                                ::v-deep(.dropdown_container__text) {
                                    font-size: 14px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
