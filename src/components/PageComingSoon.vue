<template>
    <div class="page_coming_soon">
        <img :src="comingSoonImg" alt="" class="page_coming_soon__img" />
        <div class="page_coming_soon__title"> Coming Soon </div>
        <div class="page_coming_soon__subtitle">
            This page is under development and will be released soon.
        </div>
    </div>
</template>

<script lang="ts" setup>
    import comingSoonImg from '@/assets/image/comingsoon_image.png';
</script>

<style lang="less" scoped>
    .page_coming_soon {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 120px;

        &__img {
            width: 264px;
        }

        &__title {
            margin-top: 2px;
            color: var(--bj-text-fouth);
            font-weight: 400;
            font-size: 20px;
            font-family: Inter-Regular, Inter;
            line-height: 20px;
        }

        &__subtitle {
            margin-top: 15px;
            color: var(--bj-text-second);
            font-weight: 400;
            font-size: 14px;
            font-family: PingFangSC-Regular, 'PingFang SC';
            line-height: 20px;
            text-align: center;
        }
    }
</style>
