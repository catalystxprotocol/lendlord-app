<template>
    <div class="toast_component">
        <div class="toast_component__container" :class="toastComponentClass">
            <div class="toast_component__container__icon_box">
                <img
                    v-if="status == toastStatusEnum.success"
                    class="toast_component__container__icon_box__img"
                    src="../assets/image/Success.png"
                    alt=""
                />
                <img
                    v-if="status == toastStatusEnum.processing"
                    class="toast_component__container__icon_box__img"
                    src="../assets/image/Processing.png"
                    alt=""
                />
                <img
                    v-if="status == toastStatusEnum.failed"
                    class="toast_component__container__icon_box__img"
                    src="../assets/image/Failed.png"
                    alt=""
                />
                <img
                    v-if="status == toastStatusEnum.warning"
                    class="toast_component__container__icon_box__img"
                    src="../assets/image/Warning.png"
                    alt=""
                />
            </div>
            <div v-if="text" class="toast_component__container__text">
                {{ text }}
            </div>
            <div v-else class="toast_component__container__title_box">
                <div class="toast_component__container__title_box__title">
                    {{ status }}
                </div>
                <div
                    class="toast_component__container__title_box__subtitle"
                    @click="viewOnExplorer"
                >
                    View on explorer
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { toastStatusEnum } from '@/constants/index';
    import { toExplorer } from '@/helper/baseHelper';

    interface IProps {
        status: string;
        text?: string;
        explorerUrl?: string;
    }

    const props = defineProps<IProps>();

    const toastComponentClass = computed(() => {
        switch (props.status) {
            case toastStatusEnum.success:
                return 'toast_component__container_success';
            case toastStatusEnum.processing:
                return 'toast_component__container_processing';
            case toastStatusEnum.failed:
                return 'toast_component__container_failed';
            case toastStatusEnum.warning:
                return 'toast_component__container_warning';
            default:
                return '';
        }
    });

    const viewOnExplorer = () => {
        toExplorer(props.explorerUrl || '');
    };
</script>

<style lang="less" scoped>
    .toast_component {
        position: relative;
        //width: 100%;
        //height: 100%;
        min-width: 296px;
        height: 80px;
        box-shadow: 0 16px 20px 0 var(--bj-box-shadow-second);

        &__container {
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;

            &__icon_box {
                margin: 0 16px;

                &__img {
                    width: 48px;
                    height: 48px;
                }
            }

            &__title_box {
                &__title {
                    .text_font_bold;
                }

                &__subtitle {
                    color: var(--bj-text-normal);
                    font-weight: 400;
                    font-size: 14px;
                    font-family: Inter-Regular, Inter;
                    line-height: 18px;
                    cursor: pointer;
                }

                &__subtitle:hover {
                    color: var(--bj-primary-color);
                }
            }

            &__text {
                display: flex;
                align-items: center;
                max-width: 254px;
                height: 48px;
                margin-right: 40px;
                color: #000000;
                font-weight: 400;
                font-size: 18px;
                font-family: Inter-Regular, Inter;
                line-height: 24px;
            }
        }

        &__container_success {
            background: linear-gradient(90deg, #f0fff4 0%, #ffffff 50%);
        }

        &__container_processing {
            background: linear-gradient(90deg, #fffcf4 0%, #ffffff 50%);
        }

        &__container_failed {
            background: linear-gradient(90deg, #fff7f6 0%, #ffffff 50%);
        }

        &__container_warning {
            background: linear-gradient(90deg, #fff7f6 0%, #ffffff 50%);
        }

        &__close_btn {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 28px;
            height: 28px;
        }
    }
</style>
