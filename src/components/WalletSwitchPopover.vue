<template>
    <MyPopover width="320px" :show="show" :is-gradient="true" @close="close">
        <div class="wallet_switch">
            <div class="wallet_switch__img_box">
                <img :src="switchImg" alt="" class="wallet_switch__img_box__img" />
            </div>
            <div class="wallet_switch__title"> Please switch to {{ netWork }} network </div>
            <div class="wallet_switch__subtitle">
                In order to trade items, please switch to {{ netWork }} network within your wallet.
            </div>
            <div class="wallet_switch__btn_row">
                <div class="wallet_switch__btn_row__btn_box">
                    <MyButton
                        :disable="false"
                        :is-ghost-button="true"
                        button-text="Cancel"
                        @callback="close"
                    ></MyButton>
                </div>
                <div class="wallet_switch__btn_row__btn_box">
                    <MyButton
                        :disable="false"
                        :is-ghost-button="false"
                        button-text="Switch"
                        @callback="clickSwitch"
                    ></MyButton>
                </div>
            </div>
        </div>
    </MyPopover>
</template>

<script setup lang="ts">
    import MyPopover from '@/components/MyPopover.vue';
    import switchImg from '@/assets/image/switch.png';
    import MyButton from '@/components/MyButton.vue';

    interface Props {
        show?: boolean;
        netWork: string;
    }

    withDefaults(defineProps<Props>(), {
        show: false,
        netWork: ''
    });

    const emit = defineEmits<{
        (e: 'cancel'): void;
        (e: 'switch'): void;
    }>();

    const close = () => {
        emit('cancel');
    };

    const clickSwitch = () => {
        emit('switch');
    };
</script>

<style lang="less" scoped>
    .wallet_switch {
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        width: 100%;
        padding: 48px 28px 32px;

        &__img_box {
            display: flex;
            justify-content: center;

            &__img {
                width: 80px;
            }
        }

        &__title {
            .text_font_bold;

            width: 100%;
            margin-top: 37px;
            text-align: center;
            //overflow:hidden;
            //text-overflow:ellipsis;
            //white-space: nowrap;
        }

        &__subtitle {
            margin-top: 12px;
            color: var(--bj-text-normal);
            font-weight: 400;
            font-size: 14px;
            font-family: Inter-Regular, Inter;
            line-height: 24px;
            text-align: center;
        }

        &__btn_row {
            display: flex;
            justify-content: center;
            margin-top: 20px;

            &__btn_box {
                width: 116px;

                ::v-deep(.ghost_button) {
                    color: var(--bj-text-normal);
                    font-weight: 400;
                }
            }

            &__btn_box:not(:first-child) {
                margin-left: 20px;
            }
        }
    }
</style>
