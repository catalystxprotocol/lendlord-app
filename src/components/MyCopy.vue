<template>
    <el-tooltip
        popper-class="copy_popper"
        placement="top"
        effect="light"
        content="Copied!"
        trigger="click"
        :offset="14"
        :visible="copyTooltipVisible"
    >
        <div class="copy_wrap" @click="copyAddress">
            <i class="iconfont icon-fuzhi"></i>
        </div>
    </el-tooltip>
</template>

<script setup lang="ts">
    import { copyToClipboard } from '@/utils/clipboard';

    interface IProps {
        copyText?: string;
    }

    const props = withDefaults(defineProps<IProps>(), {
        copyText: ''
    });

    const { copyText } = toRefs(props);

    const copyTooltipVisible = ref(false);
    let copyTimer: number;

    const copyAddress = () => {
        if (!copyText.value) return;
        copyTooltipVisible.value = true;
        copyTimer && clearTimeout(copyTimer);
        copyTimer = window.setTimeout(() => {
            copyTooltipVisible.value = false;
        }, 3000);
        copyToClipboard(copyText.value);
    };
</script>

<style lang="less" scoped>
    .copy_wrap {
        .cursor_pointer;

        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        margin-left: 12px;
        background: var(--bj-background-color-second);
        border: 1px solid var(--bj-border-color);
        border-radius: 20px;

        &:hover {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--bj-primary-color);
        }

        .iconfont {
            color: var(--bj-primary-color);
            font-size: 14px;
        }
    }
</style>
