<template>
    <MyPopover width="300px" :show="show" :is-gradient="true" :close-on-click-modal="false">
        <div class="loading_popover">
            <MyLoading width="80px" height="80px"></MyLoading>
            <div class="loading_popover__text"> Confirm this transaction in your wallet </div>
        </div>
    </MyPopover>
</template>

<script setup lang="ts">
    import MyPopover from '@/components/MyPopover.vue';
    import MyLoading from '@/components/MyLoading.vue';
    interface Props {
        show?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        show: false
    });
</script>

<style lang="less" scoped>
    .loading_popover {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 64px 0 40px;

        &__text {
            width: 240px;
            margin-top: 40px;
            color: var(--bj-text-normal);
            font-weight: 400;
            font-size: 18px;
            font-family: Inter-Regular, Inter;
            line-height: 28px;
            text-align: center;
        }
    }
</style>
