<template>
    <div class="condition_tabs">
        <MyTab
            v-for="item in list"
            v-show="item.show"
            :key="item.key"
            class="condition_tabs__item"
            :prefix-text="item.prefixText"
            :text="item.text"
            :suffix-text="item.suffixText"
            @close-fn="item.closeFn"
        />
        <MyButton
            v-show="isShowClearAll"
            class="condition_tabs__clear_all"
            button-text="Clear All"
            @callback="clearAllFn"
        />
    </div>
</template>

<script setup lang="ts">
    import { TabListItem } from '@/types/interface/collectionDetails.interface';

    interface IProps {
        list: TabListItem[];
    }

    const props = defineProps<IProps>();

    const isShowClearAll = computed(() => {
        return props.list.some((item) => item.show);
    });

    const emit = defineEmits<{
        (e: 'clearAllFn', event: Event): void;
    }>();

    const clearAllFn = (e: Event) => {
        emit('clearAllFn', e);
    };
</script>

<style lang="less" scoped>
    .condition_tabs {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: -8px;

        &__item {
            max-width: 300px;
            height: 32px;
            margin: 0 8px 8px 0;
        }

        &__clear_all {
            .small_text_font_bold;

            width: 80px;
            height: 32px;
            padding: 0;
            color: #ffffff;
        }
    }
</style>
