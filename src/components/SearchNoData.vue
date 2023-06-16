<template>
    <div class="search_noData">
        <img src="@/assets/image/NoData.png" alt="" />
        <div class="search_noData__text">NO VALID RESULT</div>
        <div class="search_noData__btn">
            <MyButton :button-text="buttonText" @callback="btnClick"></MyButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import MyButton from '@/components/MyButton.vue';

    interface IProps {
        buttonText?: string;
        buttonwidth?: string;
    }

    const emit = defineEmits<{
        (e: 'callback', event: Event): void;
    }>();

    withDefaults(defineProps<IProps>(), {
        buttonText: '',
        buttonwidth: '200px'
    });
    const btnClick = (event: Event) => {
        emit('callback', event);
    };
</script>

<style lang="less" scoped>
    .search_noData {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
            width: 86px;
            height: 70px;
        }

        &__text {
            .text_font;

            margin-top: 40px;
            color: var(--bj-text-fouth);
            font-size: 20px;
            line-height: 20px;
        }

        &__btn {
            width: v-bind(buttonwidth);
            margin-top: 24px;
        }
    }
</style>
