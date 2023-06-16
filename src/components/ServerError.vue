<template>
    <div class="container_500">
        <img :src="img500" alt="" class="container_500__img" />
        <div class="container_500__title"> INTERNAL SERVER ERROR </div>
        <div class="container_500__subtitle">
            The server has been deserted for a while.
            <br />Please be patient or try again later.
        </div>
    </div>
</template>

<script lang="ts" setup>
    import img500 from '@/assets/image/500_image.png';
</script>

<style lang="less" scoped>
    .container_500 {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 120px;

        &__img {
            width: 320px;
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
