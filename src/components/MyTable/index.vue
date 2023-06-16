<template>
    <div class="my_table">
        <slot name="header"></slot>
        <slot name="body"></slot>
        <slot name="skeleton"></slot>
        <slot name="noData"></slot>
    </div>
</template>

<script lang="ts" setup>
    interface IProps {
        column?: object[];
        data?: object[];
    }

    withDefaults(defineProps<IProps>(), {
        column: () => [],
        data: () => []
    });
</script>

<style lang="less" scoped></style>
