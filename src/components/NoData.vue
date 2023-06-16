<template>
    <div class="no_data">
        <img src="@/assets/image/NoData.png" alt="" />
        <div class="no_data__text">{{ text }}</div>
    </div>
</template>

<script lang="ts" setup>
    interface IProps {
        text?: string;
    }

    withDefaults(defineProps<IProps>(), {
        text: 'No Data'
    });
</script>

<style lang="less" scoped>
    .no_data {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 112px;
        margin: 0 auto;

        img {
            width: 86px;
            height: 70px;
        }

        &__text {
            .text_font;

            margin-top: 12px;
            color: rgba(0, 0, 0, 0.35);
            text-align: left;
        }
    }
</style>
