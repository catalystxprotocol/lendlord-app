<template>
    <div class="container_404">
        <img :src="img404" alt="" class="container_404__img" />
        <div class="container_404__title"> PAGE NOT FOUND </div>
        <div class="container_404__subtitle">
            The page you were looking for could not be found.
        </div>
    </div>
</template>

<script lang="ts" setup>
    import img404 from '@/assets/image/404_image.png';
</script>

<style lang="less" scoped>
    .container_404 {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 120px;

        &__img {
            width: 344px;
        }

        &__title {
            margin-top: 24px;
            color: var(--bj-text-fouth);
            font-weight: 400;
            font-size: 20px;
            font-family: Inter-Regular, Inter;
            line-height: 20px;
        }

        &__subtitle {
            margin-top: 16px;
            color: var(--bj-text-second);
            font-weight: 400;
            font-size: 14px;
            font-family: Inter-Regular, Inter;
            line-height: 20px;
        }
    }
</style>
