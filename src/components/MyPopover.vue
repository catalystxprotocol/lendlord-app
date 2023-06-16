<template>
    <el-dialog
        :class="isGradient ? 'gradient' : ''"
        :model-value="show"
        :width="width"
        :before-close="handleClose"
        :show-close="false"
        :close-on-click-modal="closeOnClickModal"
    >
        <MyCloseIcon v-if="showCloseBtn" class="close_box" @click="handleClose" />
        <slot></slot>
    </el-dialog>
</template>

<script setup lang="ts">
    interface Props {
        width?: string;
        height?: string;
        show?: boolean;
        showCloseBtn?: boolean;
        isGradient?: boolean;
        closeOnClickModal?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        width: '264px',
        height: '264px',
        show: false,
        showCloseBtn: false,
        isGradient: false,
        closeOnClickModal: true
    });

    const emit = defineEmits<{
        (e: 'close'): void;
    }>();

    const handleClose = () => {
        emit('close');
    };
</script>

<style lang="less" scoped>
    .close_box {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 24px;
        height: 24px;

        :deep(.iconfont) {
            color: var(--bj-primary-color);
            font-size: 10px;
            transform: none;
        }
    }
</style>
