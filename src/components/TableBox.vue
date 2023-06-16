<template>
    <div class="table_box">
        <div v-if="showTitle" class="table_box__title_box">
            <span class="table_box__title_box__title">{{ title }}</span>
        </div>
        <div class="table_box__container">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    interface IProps {
        showTitle?: boolean;
        title?: string;
        minheight?: string;
    }

    withDefaults(defineProps<IProps>(), {
        showTitle: true,
        title: '',
        minheight: '600px'
    });
</script>

<style lang="less" scoped>
    .table_box {
        min-height: v-bind(minheight);
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 16px 20px 0 rgba(35, 27, 24, 0.03);

        &__title_box {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            width: 100%;
            height: 48px;
            padding-left: 16px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);

            &__title {
                .title_font;

                font-size: 18px;
                line-height: 28px;
            }
        }

        &__container {
            box-sizing: border-box;
            width: 100%;
            padding-top: 7px;
        }
    }
</style>
