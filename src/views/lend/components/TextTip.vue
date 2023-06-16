<template>
    <div class="text_tip">
        <div class="text_tip__iconfont">
            <i class="iconfont icon-Warning"></i>
        </div>
        <div class="text_tip__content">{{ text }}</div>
    </div>
</template>

<script setup lang="ts">
    interface Props {
        text: string;
    }

    withDefaults(defineProps<Props>(), {});
</script>

<style lang="less" scoped>
    .text_tip {
        display: flex;

        &__iconfont {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            background: rgba(255, 159, 42, 0.15);
            border-radius: 50%;

            .iconfont {
                display: inline-block;
                color: var(--bj-primary-color);
                font-size: 18px;
                transform: scale(0.5);
            }
        }

        &__content {
            .text_ellipsis;

            flex: 1;
            color: var(--bj-primary-color);
            font-weight: 400;
            font-size: 12px;
            font-family: Inter-Regular;
            line-height: 18px;
        }
    }
</style>
