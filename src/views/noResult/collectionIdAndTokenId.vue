<template>
    <div class="no_result">
        <SearchResultText class="no_result__text" :text="(route.params.tokenId as string)" />
        <NoData class="no_result__no_data" :text="noValidResult" />
        <MyButton
            class="no_result__button"
            button-text="Back to Collection"
            @callback="goCollection"
        />
    </div>
</template>

<script setup lang="ts">
    import { noValidResult } from '@/constants';
    import SearchResultText from '@/components/SearchResultText.vue';
    import { useCollectionIdAndTokenId } from './composable';

    const { route, goCollection } = useCollectionIdAndTokenId();
</script>

<style lang="less" scoped>
    .no_result {
        max-width: 1200px;
        margin: 32px auto 0;
        padding: 0 10px;

        &__text {
        }

        &__no_data {
            width: 220px;
            margin-top: 140px;

            :deep(img) {
                width: 123px;
                height: 100px;
            }
        }

        &__button {
            width: 220px;
            margin: 24px auto 0;
        }
    }
</style>
