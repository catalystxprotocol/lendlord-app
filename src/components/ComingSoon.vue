<template>
    <div class="coming_soon">
        <img src="@/assets/image/Comingsoon.png" alt="" />
        <div class="coming_soon__text">Coming Soon</div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
    .coming_soon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 112px;
        margin: 0 auto;

        img {
            width: 104px;
            height: 99px;
        }

        &__text {
            .text_font;

            margin-top: 15px;
            color: rgba(0, 0, 0, 0.35);
            text-align: left;
        }
    }
</style>
