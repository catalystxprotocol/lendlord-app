<template>
    <div class="toast_close">
        <MyCloseIcon class="close" @click="close" />
    </div>
</template>

<script setup lang="ts">
    const emit = defineEmits<{
        (e: 'handlerClose'): void;
    }>();

    const close = () => {
        emit('handlerClose');
    };
</script>

<style lang="less" scoped>
    .toast_close {
        position: absolute;
        top: 8px;
        right: 8px;
        box-sizing: content-box;
        width: 28px;
        height: 28px;

        .close {
            width: 100%;
            height: 100%;

            :deep(.iconfont) {
                font-size: 12px;
                transform: none;
            }
        }
    }
</style>
