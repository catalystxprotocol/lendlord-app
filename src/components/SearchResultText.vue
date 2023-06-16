<template>
    <div class="search_result_text">
        <span class="search_result_text__key"> Search Result </span>
        <span class="search_result_text__value">{{ text }}</span>
    </div>
</template>

<script lang="ts" setup>
    interface IProps {
        text: string;
    }

    defineProps<IProps>();
</script>

<style lang="less" scoped>
    .search_result_text {
        width: 100%;

        &__key {
            .text_font_bold;

            margin-right: 12px;
        }

        &__value {
            .text_font;

            word-break: break-all;
        }
    }
</style>
