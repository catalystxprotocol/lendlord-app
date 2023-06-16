<template>
    <div class="search">
        <SearchResultText :text="(route.params.collectionName as string)"></SearchResultText>
        <div v-if="!noData" class="search__result">
            <TableBox title="Collections" minheight="0px">
                <CollectionsTable
                    :columns="column"
                    :data="tableData"
                    :loading="tableLoading"
                    :skeleton-count="skeletonCount"
                ></CollectionsTable>
            </TableBox>
        </div>
        <div v-else class="search__noData">
            <SearchNoData
                button-text="Back to Marketplace"
                buttonwidth="220px"
                @callback="toMarketplace"
            ></SearchNoData>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useSearchModule } from '@/views/search/composable';
    import TableBox from '@/components/TableBox.vue';
    import SearchNoData from '@/components/SearchNoData.vue';
    import SearchResultText from '@/components/SearchResultText.vue';

    const { column, route, tableData, tableLoading, skeletonCount, toMarketplace, noData } =
        useSearchModule();
</script>

<style lang="less" scoped>
    .search {
        width: 1200px;
        margin: 0 auto;
        padding-top: 32px;

        &__content {
            display: flex;

            &__title {
                .title_font;

                color: #000000;
                font-weight: bold;
                font-size: 18px;
                line-height: 28px;
            }

            &__text {
                .text_font;

                margin-left: 12px;
                font-size: 18px;
                line-height: 28px;
            }
        }

        &__result {
            width: 100%;
            margin: 24px 0 147px;
        }

        &__noData {
            padding-top: 140px;
        }
    }
</style>
