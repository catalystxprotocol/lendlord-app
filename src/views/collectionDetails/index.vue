<template>
    <div class="wrap">
        <div class="wrap__collection">
            <div class="wrap__collection__info">
                <div class="wrap__collection__info__left">
                    <div class="wrap__collection__info__left__img">
                        <MySkeleton
                            v-if="loadingInfo"
                            class="wrap__collection__info__left__img__loading"
                        />
                        <NftImage
                            v-else
                            class="wrap__collection__info__left__img__content"
                            :src="collectionImage"
                        />
                    </div>
                    <div class="wrap__collection__info__left__info">
                        <MySkeleton
                            v-if="loadingInfo"
                            class="wrap__collection__info__left__info__name_loading"
                        />
                        <div v-else class="wrap__collection__info__left__info__name">
                            {{ collectionName || DEFAULT_DISPLAY_TEXT }}
                        </div>
                        <div class="wrap__collection__info__left__info__text">
                            <div
                                v-for="item in leftCollectionInfo"
                                :key="item.label"
                                class="wrap__collection__info__left__info__text__item"
                            >
                                <span class="wrap__collection__info__left__info__text__item__label">
                                    {{ item.label }}
                                </span>
                                <span class="wrap__collection__info__left__info__text__item__value">
                                    {{ item.value }}
                                </span>
                            </div>
                        </div>
                        <div class="wrap__collection__info__left__info__icon">
                            <div
                                v-if="loadingInfo"
                                class="wrap__collection__info__left__info__icon__loading"
                            >
                                <MySkeleton
                                    v-for="(item, index) in new Array(4)"
                                    :key="index"
                                    class="wrap__collection__info__left__info__icon__loading__item"
                                />
                            </div>
                            <div v-else class="wrap__collection__info__left__info__icon__content">
                                <a
                                    v-for="item in iconInfo"
                                    :key="item.key"
                                    class="wrap__collection__info__left__info__icon__content__item"
                                    :href="item.link"
                                    target="_blank"
                                >
                                    <i
                                        v-if="item.isIcon"
                                        class="iconfont"
                                        :class="[item.iconfont]"
                                    ></i>
                                    <img v-else :src="item.iconImgUrl" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrap__collection__info__right">
                    <div
                        v-for="item in rightCollectionInfo"
                        :key="item.label"
                        class="wrap__collection__info__right__item"
                    >
                        <div class="wrap__collection__info__right__item__label">{{
                            item.label
                        }}</div>
                        <div class="wrap__collection__info__right__item__value">{{
                            item.value
                        }}</div>
                    </div>
                </div>
            </div>
            <div class="wrap__collection__content">
                <el-tabs v-model="activeName" class="slef_tabs" @tab-click="handleClick">
                    <el-tab-pane name="item">
                        <template #label>
                            <div>
                                <span>Item</span>
                                <span class="item_number">({{ formatBigNumber(nftTotal) }})</span>
                            </div>
                        </template>
                        <div class="wrap__collection__content__items">
                            <div class="wrap__collection__content__items__header">
                                <div class="wrap__collection__content__items__header__filters">
                                    <FiltersButton
                                        class="wrap__collection__content__items__header__filters__button"
                                        :loading="loadingItemFilter"
                                        :status="itemFilterStatus"
                                        @callback="switchExpend"
                                    />
                                </div>
                                <ConditionTabs
                                    v-show="isConditionExpend && isShowConditionTabs"
                                    :list="itemTabsList"
                                    class="wrap__collection__content__items__header__tabs"
                                    @clear-all-fn="clearAllFn"
                                />
                            </div>
                            <div class="wrap__collection__content__items__content">
                                <div
                                    v-show="isConditionExpend"
                                    class="wrap__collection__content__items__content__filters"
                                >
                                    <SingleStatus
                                        class="wrap__collection__content__items__content__filters__status"
                                        :list="itemStatusList"
                                        :current-key="itemStatusCurrent"
                                        @switch-fn="itemStatusSwitch"
                                    />
                                    <PriceCondition
                                        ref="PriceComRef"
                                        class="wrap__collection__content__items__content__filters__price"
                                        @supply-fn="priceSupplyFn"
                                    />
                                    <RentalDuration
                                        ref="RentalDurComRef"
                                        class="wrap__collection__content__items__content__filters__rental_duration"
                                        @supply-fn="rentalDurSupplyFn"
                                    />
                                </div>
                                <div class="wrap__collection__content__items__content__list">
                                    <ConditionTabs
                                        v-show="!isConditionExpend && isShowConditionTabs"
                                        :list="itemTabsList"
                                        class="wrap__collection__content__items__content__list__tabs"
                                        @clear-all-fn="clearAllFn"
                                    />
                                    <!-- style="overflow: auto" -->
                                    <div
                                        v-infinite-scroll="loadMoreNftList"
                                        :class="{ small: isConditionExpend }"
                                        :infinite-scroll-disabled="isCancelLoad"
                                        :infinite-scroll-immediate="true"
                                        :infinite-scroll-distance="300"
                                        class="wrap__collection__content__items__content__list__content"
                                    >
                                        <CollectionNftCard
                                            v-for="item in nftList"
                                            :key="item.nftId"
                                            :image-url="item.imageUrl"
                                            :token-id="item.tokenId"
                                            :date-display="item.dateDisplay"
                                            :is-show-date-and-button="item.isShowDateAndButton"
                                            :button-text="item.buttonText"
                                            :is-hover-switch-button="item.isHoverSwitchButton"
                                            :is-mask="item.isMask"
                                            :mask-first-text="item.maskFirstText"
                                            :mask-second-text="item.maskSecondText"
                                            :button-click-fn="item.buttonClickFn"
                                            class="wrap__collection__content__items__content__list__content__item"
                                            @click="goItemDetails(item.nftId)"
                                        />
                                        <SkeletonCollectionNftCard
                                            v-for="(item, index) in new Array(itemPageSize)"
                                            v-show="loadingItemList || isFailedList"
                                            :key="Date.now() + index"
                                            class="wrap__collection__content__items__content__list__content__loading"
                                        />
                                    </div>
                                    <NoData
                                        v-show="isItemNoData"
                                        class="wrap__collection__content__items__content__list__no_data"
                                    />
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Activity" name="activity">
                        <div
                            v-infinite-scroll="infiniteScroll"
                            class="wrap__collection__content__activity"
                        >
                            <div
                                class="wrap__collection__content__activity__filters"
                                :class="
                                    !isActiveConditionExpend
                                        ? 'wrap__collection__content__activity__filters_expend'
                                        : ''
                                "
                            >
                                <div
                                    class="wrap__collection__content__activity__filters__filters_box"
                                >
                                    <FiltersButton
                                        :loading="loadingActiveFilter"
                                        :status="activityFilterStatus"
                                        @callback="activeSwitchExpend"
                                    />
                                </div>

                                <ConditionTabs
                                    v-show="isShowActiveConditionTabs"
                                    :list="activeTabsList"
                                    @clear-all-fn="activeClearAllFn"
                                />
                            </div>

                            <div class="wrap__collection__content__activity__content">
                                <div
                                    v-show="activityFilterStatus == FiltersBtnStatus.active"
                                    class="wrap__collection__content__activity__content__condition"
                                >
                                    <SingleStatus
                                        class="wrap__collection__content__items__content__filters__status"
                                        :list="activeStatusList"
                                        :current-key="activityCurrentStatus"
                                        @switch-fn="activeStatusSwitch"
                                    />
                                </div>
                                <div class="wrap__collection__content__activity__content__table">
                                    <TableBox
                                        title="Collections"
                                        :show-title="false"
                                        minheight="0px"
                                    >
                                        <ActivityTable
                                            :columns="
                                                activityFilterStatus == FiltersBtnStatus.normal
                                                    ? column
                                                    : columnSmall
                                            "
                                            :data="tableData"
                                            :loading="tableLoading"
                                            :skeleton-count="skeletonCount"
                                            :small-spacing="isSmallSpacing"
                                        ></ActivityTable>
                                    </TableBox>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <SearchTokenId
                    :init-loading="loadingInfo"
                    :search-loading="searchLoading"
                    placeholder="Search by Token ID"
                    class="wrap__collection__content__search_wrap"
                    @search-fn="searchTokenIdFn"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import MySkeleton from '@/components/MySkeleton.vue';
    import FiltersButton from './components/FiltersButton.vue';
    import SingleStatus from './components/SingleStatus.vue';
    import SearchTokenId from './components/SearchTokenId.vue';
    import PriceCondition from './components/Condition/PriceCondition.vue';
    import ConditionTabs from './components/ConditionTabs.vue';
    import RentalDuration from './components/Condition/RentalDuration.vue';
    import CollectionNftCard from './components/CollectionNftCard/CollectionNftCard.vue';
    import SkeletonCollectionNftCard from './components/CollectionNftCard/SkeletonCollectionNftCard.vue';
    import { formatBigNumber } from '@/utils/calculate';
    import { DEFAULT_DISPLAY_TEXT } from '@/constants';
    import {
        useCollectionActiveList,
        useCollectionInfo,
        useCollectionItemList,
        useSearchTokenId,
        useCollectionTabs
    } from './composable';

    const {
        loadingInfo,
        collectionName,
        collectionImage,
        leftCollectionInfo,
        rightCollectionInfo,
        iconInfo,
        getCollectionInfo
    } = useCollectionInfo();

    const { searchTokenIdFn, cancelSearchTokenId, searchLoading } = useSearchTokenId();

    const {
        loadingItemList,
        loadingItemFilter,
        itemFilterStatus,
        switchExpend,
        isConditionExpend,
        isShowConditionTabs,
        itemTabsList,
        clearAllFn,
        itemStatusList,
        itemStatusCurrent,
        itemStatusSwitch,
        PriceComRef,
        RentalDurComRef,
        priceSupplyFn,
        rentalDurSupplyFn,
        loadMoreNftList,
        isCancelLoad,
        nftList,
        nftTotal,
        goItemDetails,
        isFailedList,
        itemPageSize,
        isItemNoData
    } = useCollectionItemList(cancelSearchTokenId);

    const {
        column,
        columnSmall,
        tableData,
        // currentPage,
        // totalPage,
        tableLoading,
        skeletonCount,
        loadTableData,
        activityCurrentStatus,
        activityFilterStatus,
        activeSwitchExpend,
        FiltersBtnStatus,
        isSmallSpacing,
        activeTabsList,
        activeStatusList,
        activeStatusSwitch,
        isActiveConditionExpend,
        isShowActiveConditionTabs,
        activeClearAllFn,
        isFirstLoading,
        infiniteScroll,
        loadingActiveFilter
    } = useCollectionActiveList(cancelSearchTokenId);

    const { activeName, handleClick } = useCollectionTabs(
        isFirstLoading,
        loadTableData,
        cancelSearchTokenId
    );

    onMounted(() => {
        getCollectionInfo();
        loadMoreNftList();
    });
</script>

<style lang="less" scoped>
    .wrap {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        scrollbar-color: transparent transparent;

        &::-webkit-scrollbar {
            display: none;
        }

        &__collection {
            width: 100%;
            max-width: 1200px;
            height: 100%;

            &__info {
                display: flex;
                margin: 48px 0 35px;

                &__left {
                    display: flex;
                    flex: 1;
                    margin-right: 10px;

                    &__img {
                        width: 112px;
                        height: 112px;
                        margin-right: 20px;
                        overflow: hidden;
                        border-radius: var(--border-radius-normal);

                        &__loading {
                            width: 100%;
                            height: 100%;
                        }

                        &__content {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    &__info {
                        flex: 1;
                        width: 0;

                        &__name_loading {
                            width: 350px;
                            height: 34px;
                            margin-bottom: 16px;
                            border-radius: var(--border-radius-normal);
                        }

                        &__name {
                            .sub_title_font;
                            .text_ellipsis;

                            height: 34px;
                            margin-bottom: 16px;
                        }

                        &__text {
                            display: flex;
                            margin-bottom: 16px;

                            &__item {
                                margin-right: 40px;

                                &__label {
                                    .small_text_font;

                                    margin-right: 8px;
                                }

                                &__value {
                                    .small_text_font_bold;
                                }
                            }
                        }

                        &__icon {
                            &__loading {
                                display: flex;

                                &__item {
                                    width: 24px;
                                    height: 24px;
                                    margin-right: 6px;
                                    border-radius: 12px;
                                }
                            }

                            &__content {
                                display: flex;

                                &__item {
                                    .cursor_pointer;

                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    box-sizing: border-box;
                                    width: 24px;
                                    height: 24px;
                                    margin-right: 6px;
                                    color: black;
                                    background: var(--bj-background-color-third);
                                    border: 1px solid var(--bj-border-color);
                                    border-radius: 12px;

                                    &:hover {
                                        border: 1px solid var(--bj-primary-color);
                                    }

                                    &:nth-child(1) {
                                        .iconfont {
                                            font-size: 16px;
                                        }
                                    }

                                    &:nth-child(2) {
                                        .iconfont {
                                            font-size: 12px;
                                        }
                                    }

                                    &:nth-child(3) {
                                        .iconfont {
                                            font-size: 12px;
                                            transform: translate(1px, 1px);
                                        }
                                    }

                                    &:nth-child(4) {
                                        img {
                                            width: 16px;
                                            height: 16px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                &__right {
                    display: flex;

                    &__item {
                        width: 110px;
                        margin-top: 8px;
                        margin-right: 16px;
                        text-align: right;

                        &:nth-child(2) {
                            margin-right: 32px;
                        }

                        &:nth-child(3) {
                            margin-right: 10px;
                        }

                        &:nth-child(4) {
                            width: 100px;
                        }

                        &:last-child {
                            margin-right: 0;
                        }

                        &__label {
                            .small_text_font;

                            margin-bottom: 24px;
                        }

                        &__value {
                            .small_text_font_bold;
                            .text_ellipsis;
                        }
                    }
                }
            }

            &__content {
                position: relative;

                :deep(.slef_tabs) {
                    .el-tabs__content {
                        overflow: visible;
                    }
                }

                &__items {
                    padding-top: 16px;

                    &__header {
                        display: flex;

                        &__filters {
                            width: 238px;
                            margin-right: 34px;

                            &__button {
                            }
                        }

                        &__tabs {
                            flex: 1;
                        }
                    }

                    &__content {
                        display: flex;

                        &__filters {
                            position: sticky;
                            top: 0;
                            width: 238px;
                            height: 500px;
                            margin: 0 34px 0 0;
                            padding: 16px 0 0;

                            &__status {
                            }

                            &__price {
                                margin-top: 24px;
                            }

                            &__rental_duration {
                                margin-top: 24px;
                            }
                        }

                        &__list {
                            flex: 1;
                            margin-top: 16px;

                            &__tabs {
                                margin-bottom: 8px;
                            }

                            &__content {
                                display: grid;
                                grid-gap: 16px 15px;
                                grid-template-columns: repeat(5, 1fr);
                                padding-bottom: 148px;

                                &__item {
                                    // height: 346px;
                                }
                            }

                            .small {
                                grid-gap: 16px;
                                grid-template-columns: repeat(4, 1fr);

                                .wrap__collection__content__items__content__list__content__item {
                                    // height: 338px;

                                    :deep(.collection_nft_card__image) {
                                        height: 220px;
                                    }
                                }

                                .wrap__collection__content__items__content__list__content__loading {
                                    :deep(.skeletion_collection_nft_card__image) {
                                        height: 220px;
                                    }
                                }
                            }

                            &__no_data {
                                margin-top: 80px;
                            }
                        }
                    }
                }

                &__activity {
                    &__filters {
                        display: flex;
                        padding-top: 16px;

                        &__filters_box {
                            width: 180px;
                        }
                    }

                    &__filters_expend {
                        display: flex;
                        flex-direction: column;

                        ::v-deep(.condition_tabs) {
                            margin-top: 16px;
                        }
                    }

                    &__content {
                        display: flex;
                        padding-bottom: 148px;

                        &__condition {
                            flex-shrink: 0;
                            width: 180px;

                            .single_stauts {
                                position: sticky;
                                top: 0;
                                padding-top: 16px;
                            }
                        }

                        &__table {
                            flex-shrink: 1;
                            padding-top: 16px;
                        }
                    }
                }

                &__search_wrap {
                    position: absolute;
                    top: 20px;
                    right: 0;
                }
            }
        }
    }
</style>
