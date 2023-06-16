<template>
    <div class="dropdown_container cursor_pointer" :class="{ visible_dropdown: visible }">
        <div
            class="dropdown_container__text"
            :class="{
                selected_color_default: userSelected
            }"
            >{{ text }}</div
        >
        <div class="dropdown_container__iconfont">
            <i class="iconfont icon-zhankai" :class="{ visible: visible }"></i>
        </div>
    </div>
</template>

<script setup lang="ts">
    interface IProps {
        visible: boolean;
        userSelected: boolean;
        text: string;
    }

    defineProps<IProps>();
</script>

<style lang="less" scoped>
    .dropdown_container {
        display: flex;
        box-sizing: border-box;
        min-width: 172px;
        padding: 10px 0 10px 12px;
        background: var(--bj-background-color-third);
        border: 1px solid var(--bj-border-color);
        border-radius: var(--border-radius-normal);
        transition: all 0.2s;

        &:hover {
            .visible_dropdown;
        }

        &__text {
            .text_ellipsis;

            width: 125px;
            color: rgba(0, 0, 0, 0.5);
            font-weight: 400;
            font-size: 16px;
            font-family: Inter-Regular;
            line-height: 20px;
            border-right: 1px solid var(--bj-border-color);
        }

        &__iconfont {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 5.5px;

            .iconfont {
                display: inline-block;
                color: var(--bj-primary-color);
                font-size: 14px;
                transform: scale(0.6);
            }

            .visible {
                transform: scale(0.6) rotate(180deg);
            }
        }

        .selected_color_default {
            color: var(--bj-text-normal);
        }
    }

    .visible_dropdown {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--bj-primary-color);

        .dropdown_container__text {
            color: var(--bj-text-normal);
        }
    }
</style>
