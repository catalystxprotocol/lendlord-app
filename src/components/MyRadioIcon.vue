<template>
    <div class="my_radio" :class="{ selected: selected }">
        <div class="my_radio__color_block"></div>
    </div>
</template>

<script setup lang="ts">
    interface IProps {
        selected: boolean;
    }

    defineProps<IProps>();
</script>

<style lang="less" scoped>
    .my_radio {
        .cursor_pointer;

        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        background: rgba(188, 178, 160, 0.09);
        border: 1px solid rgba(0, 0, 0, 0.09);
        border-radius: 4px;
        transition: border 0.2s ease-in-out, background 0.2s ease-in-out;

        &__color_block {
            box-sizing: border-box;
            width: 0;
            height: 0;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
        }
    }

    .selected {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #ff9f2a;

        .my_radio__color_block {
            width: 10px;
            height: 10px;
            background: var(--bj-primary-color);
            border-radius: 2px;
            opacity: 1;
        }
    }
</style>
