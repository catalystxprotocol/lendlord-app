<template>
    <div class="my_close_icon">
        <i class="iconfont icon-guanbi"></i>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
    .my_close_icon {
        .cursor_pointer;

        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        background: var(--bj-background-color-third);
        border: 1px solid var(--bj-border-color);
        border-radius: 50%;

        .iconfont {
            color: var(--bj-primary-color);
            font-size: 14px;
            transform: scale(0.5);
        }
    }
</style>
