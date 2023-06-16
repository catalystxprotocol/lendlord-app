<template>
    <div class="marketplace">
        <div class="marketplace__bg">
            <img class="marketplace__bg__img" :src="MarketplaceBg" />
        </div>
        <div class="marketplace__container">
            <div class="marketplace__container__top">
                <div class="marketplace__container__top__title_box">
                    <div class="marketplace__container__top__title_box__title"
                        >NFT Rental Marketplace</div
                    >
                    <div class="marketplace__container__top__title_box__button">
                        <MyButton
                            button-text="Deploy your collection"
                            :is-ghost-button="true"
                            @callback="toComingSoon"
                        ></MyButton>
                    </div>
                </div>
                <div class="marketplace__container__top__account_box">
                    A total of
                    <span class="marketplace__container__top__account_box__account">{{
                        total
                    }}</span>
                    collections supported
                </div>
                <div class="marketplace__container__top__chain_box">
                    <div
                        v-show="chainSelectLoading"
                        class="marketplace__container__top__chain_box__loading"
                    >
                        <MySkeleton width="100%" height="100%"></MySkeleton>
                    </div>
                    <ChainSelect
                        v-show="!chainSelectLoading"
                        ref="chainSelect"
                        v-model="currentChain"
                        :options="options"
                    ></ChainSelect>
                </div>
            </div>
            <div class="marketplace__container__collections">
                <div class="marketplace__container__collections__title"> Collections </div>
                <div class="marketplace__container__collections__table_box">
                    <CollectionsTable
                        :columns="column"
                        :data="tableData"
                        :loading="tableLoading"
                        :skeleton-count="skeletonCount"
                    ></CollectionsTable>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import MyButton from '@/components/MyButton.vue';
    import ChainSelect from '@/views/marketplace/components/ChainSelect.vue';
    import MySkeleton from '@/components/MySkeleton.vue';
    import MarketplaceBg from '@/assets/image/marketplace_bg.png';
    import { useMarketplaceModule } from '@/views/marketplace/composable';

    const {
        chainSelectLoading,
        options,
        currentChain,
        column,
        tableData,
        tableLoading,
        skeletonCount,
        chainSelect,
        total,
        toComingSoon
    } = useMarketplaceModule();
</script>

<style lang="less" scoped>
    .marketplace {
        position: relative;
        box-sizing: border-box;
        border-top: 1px solid transparent;

        &__bg {
            position: absolute;
            z-index: 0;
            width: 100%;

            &__img {
                width: 100%;
            }
        }

        &__container {
            position: relative;
            z-index: 1;
            width: 1200px;
            margin: 0 auto;

            &__top {
                &__title_box {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    margin-top: 48px;

                    &__title {
                        .title_font;
                    }

                    &__button {
                        width: 252px;
                        padding-top: 3px;
                    }
                }

                &__account_box {
                    margin-top: 2px;
                    color: #000000;
                    font-weight: 400;
                    font-size: 18px;
                    font-family: Inter-Regular, Inter;
                    line-height: 28px;

                    &__account {
                        font-weight: bold;
                    }
                }

                &__chain_box {
                    display: inline-block;
                    margin-top: 49px;

                    &__loading {
                        width: 192px;
                        height: 40px;

                        ::v-deep(.block) {
                            border-radius: 8px;
                        }
                    }
                }
            }

            &__collections {
                width: 100%;
                margin-top: 12px;
                margin-bottom: 149px;
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 16px 20px 0 rgba(35, 27, 24, 0.03);

                &__title {
                    display: flex;
                    align-items: center;
                    box-sizing: border-box;
                    height: 48px;
                    padding-left: 16px;
                    .title_font;

                    font-size: 18px;
                    line-height: 28px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }

                &__table_box {
                    min-height: 70px;
                }
            }
        }
    }
</style>
