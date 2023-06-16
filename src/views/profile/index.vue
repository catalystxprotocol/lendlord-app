<template>
    <div class="profile">
        <div class="profile__address_info">
            <div class="profile__address_info__content">
                <div class="profile__address_info__content__img">
                    <img src="@/assets/image/head.png" alt="user_image" />
                </div>
                <div class="profile__address_info__content__address">{{
                    formatAddress(nftQueryData.address)
                }}</div>
                <MyCopy :copy-text="nftQueryData.address" />
                <div
                    v-show="globalStore.isConnect && globalStore.account === nftQueryData.address"
                    class="profile__address_info__content__login_out"
                    @click="loginOut"
                >
                    <i class="iconfont icon-tuichu"></i>
                </div>
            </div>
        </div>
        <div class="profile__info_wrap">
            <div class="profile__info_wrap__content">
                <el-tabs v-model="activeName" class="slef_tabs" @tab-click="handleClick">
                    <el-tab-pane name="item">
                        <template #label>
                            <div>
                                <span>Item</span>
                                <span class="item_number">({{ formatBigNumber(nftTotal) }})</span>
                            </div>
                        </template>
                        <div class="profile__info_wrap__content__items">
                            <div class="profile__info_wrap__content__items__dropdown_wrap">
                                <BaseDropdown
                                    class="profile__info_wrap__content__items__dropdown_wrap__status"
                                    :status="nftQueryData.status"
                                    :options="statusOptions"
                                    @on-selected-change="onSelectedStatus"
                                />
                                <SearchDropdown
                                    class="profile__info_wrap__content__items__dropdown_wrap__collections"
                                    :status="nftQueryData.collection_id"
                                    :options="collectionOptions"
                                    @on-selected-change="onSelectedCollectionId"
                                />
                            </div>
                            <!-- style="overflow: auto" -->
                            <div
                                v-infinite-scroll="loadMoreNftList"
                                :infinite-scroll-disabled="isCancelLoad"
                                :infinite-scroll-immediate="true"
                                :infinite-scroll-distance="300"
                                class="profile__info_wrap__content__items__list_wrap"
                                :class="{ no_data: isNoData }"
                            >
                                <NftCard
                                    v-for="item in nftList"
                                    :key="item.nftId"
                                    class="cursor_pointer"
                                    :image-url="item.imageUrl"
                                    :token-id="item.tokenId"
                                    :collection-name="item.collectionName"
                                    :date-label="item.dateLabel"
                                    :date-value="item.dateValue"
                                    :button-text="item.buttonText"
                                    :is-ghost-button="item.isGhostButton"
                                    :disable-button="item.disableButton"
                                    :is-mask="item.isMask"
                                    :mask-first-text="item.maskFirstText"
                                    :mask-second-text="item.maskSecondText"
                                    :button-click-fn="item.buttonClickFn"
                                    @click="goItemDetails(item.nftId)"
                                />
                                <!-- 加载中和加载失败，相同的样式 -->
                                <SkeletonNftCard
                                    v-for="(item, index) in new Array(pageSize)"
                                    v-show="isLoading || isFailed"
                                    :key="Date.now() + index"
                                />
                                <NoData
                                    v-show="isNoData"
                                    class="profile__info_wrap__content__items__list_wrap__no_data"
                                />
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Activity" name="activity">
                        <div class="profile__info_wrap__content__activity">
                            <ComingSoon />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import NftCard from './components/NftCard.vue';
    import SkeletonNftCard from './components/SkeletonNftCard.vue';
    import { formatAddress } from '@/utils/string';
    import { useProfile } from './composable';
    import { formatBigNumber } from '@/utils/calculate';
    import { useGlobalStore } from '@/store/modules/global';

    const globalStore = useGlobalStore();
    const {
        nftQueryData,
        loginOut,
        activeName,
        handleClick,
        nftTotal,
        statusOptions,
        onSelectedStatus,
        collectionOptions,
        onSelectedCollectionId,
        loadMoreNftList,
        isCancelLoad,
        isNoData,
        nftList,
        isLoading,
        isFailed,
        goItemDetails,
        pageSize
    } = useProfile();
</script>

<style lang="less" scoped>
    .profile {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background-color: var(--bj-background-color);
        scrollbar-color: transparent transparent;

        &::-webkit-scrollbar {
            display: none; // 去除滚动条样式
        }

        &__address_info {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
            padding: 90px 0;
            background-color: var(--bj-background-color-second);

            &__content {
                display: flex;
                align-items: center;
                width: 100%;
                max-width: 1200px;
                margin: 0 10px;

                &__img {
                    width: 120px;
                    height: 120px;
                    background: #ffffff;
                    border-radius: 50%;
                    box-shadow: var(--bj-box-shadow-card);

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }

                &__address {
                    margin-left: 24px;
                    .sub_title_font;
                }

                &__login_out {
                    .cursor_pointer;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    width: 28px;
                    height: 28px;
                    margin-left: 12px;
                    background: var(--bj-primary-color);
                    border-radius: 20px;

                    &:hover {
                        background: var(--bj-primary-color);
                        border: 2px solid rgba(255, 255, 255, 0.35);
                    }

                    .iconfont {
                        color: #ffffff;
                        font-size: 14px;
                        transform: translateX(2px);
                    }
                }
            }
        }

        &__info_wrap {
            display: flex;
            justify-content: center;

            &__content {
                width: 100%;
                max-width: 1200px;
                margin: 0 10px;

                :deep(.slef_tabs) {
                    .el-tabs__header {
                        position: sticky;
                        top: 0;
                        z-index: 1;
                        background-color: var(--bj-background-color);
                    }

                    .el-tabs__content {
                        overflow: visible;
                    }
                }

                &__items {
                    min-height: 400px;

                    &__dropdown_wrap {
                        position: sticky;
                        top: 66px;
                        z-index: 1;
                        padding: 30px 0 24px;
                        background-color: var(--bj-background-color);

                        &__status {
                            margin-right: 12px;
                        }

                        &__collections {
                        }
                    }

                    &__list_wrap {
                        display: grid;
                        grid-gap: 24px 21px;
                        grid-template-columns: repeat(4, 1fr);
                        padding-bottom: 24px;

                        &__no_data {
                            margin-top: calc(80px - 24px);
                        }
                    }

                    .no_data {
                        grid-template-columns: repeat(1, 1fr);
                    }
                }

                &__activity {
                    padding-top: 100px;
                }
            }
        }
    }
</style>
