<template>
    <div class="base_condition slef_collapse">
        <div class="base_condition__header" @click="switchExpend">
            <span>{{ title }}</span>
            <i class="iconfont icon-zhankai" :class="{ visible: isExpend }"></i>
        </div>
        <el-collapse-transition>
            <div v-show="isExpend" class="base_condition__content">
                <TokenDropdown
                    v-if="showTokenDropdown"
                    class="base_condition__content__token_dropdown"
                    popper-class="price_dropdown"
                    :status="currentTokenId"
                    :options="tokenOptions"
                    @on-selected-change="onSelectedToken"
                />
                <div
                    class="base_condition__content__input_wrap"
                    :class="{ margin_top_12: !showTokenDropdown }"
                >
                    <div class="base_condition__content__input_wrap__min">
                        <MyInput v-model:input="minInput" placeholder="Min" />
                    </div>
                    <div class="base_condition__content__input_wrap__to">to</div>
                    <div class="base_condition__content__input_wrap__max">
                        <MyInput v-model:input="maxInput" placeholder="Max" />
                    </div>
                </div>
                <MyButton
                    class="base_condition__content__button"
                    :disable="isDisable"
                    button-text="Supply"
                    @callback="supplyFn"
                />
                <el-collapse-transition>
                    <div v-show="inputTip || errorTip" class="base_condition__content__error">
                        {{ inputTip || errorTip }}
                    </div>
                </el-collapse-transition>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script setup lang="ts">
    import {
        PriceTokenOptionItem,
        PriceSupplyFnParams,
        RentalDurationParams
    } from '@/types/interface/collectionDetails.interface';
    import { bigNumberComparedTo } from '@/utils/calculate';
    import { useGlobalStore } from '@/store/modules/global';
    import MyInput from '@/components/Input/MyInput.vue';

    interface IProps {
        title: string;
        inputText: string;
        errorText: string;
        showTokenDropdown?: boolean;
        handleInputValue: Function;
        minRentPerLimit?: number;
    }

    const props = withDefaults(defineProps<IProps>(), {
        showTokenDropdown: false
    });

    const emit = defineEmits<{
        (e: 'priceSupplyFn', params: PriceSupplyFnParams): void;
        (e: 'rentalDurSupplyFn', params: RentalDurationParams): void;
    }>();

    const isExpend = ref(false);
    const switchExpend = () => {
        isExpend.value = !isExpend.value;
    };

    const globalStore = useGlobalStore();

    // token dropdown
    const currentTokenId = ref('');
    const onSelectedToken = (value: string) => {
        currentTokenId.value = value;
    };
    const tokenOptions = computed<PriceTokenOptionItem[]>(() => {
        return globalStore.chains.map((item, index) => {
            if (currentTokenId.value === '' && index === 0) {
                currentTokenId.value = item.chainId;
            }
            return {
                imgUrl: item.nativeCurrency.icon,
                label: item.nativeCurrency.symbol,
                value: item.chainId
            };
        });
    });

    const minInput = ref('');
    const maxInput = ref('');
    const inputTip = ref('');
    const errorTip = ref('');

    const isDisable = computed(() => {
        return Boolean((!minInput.value && !maxInput.value) || errorTip.value);
    });

    const reset = () => {
        minInput.value = '';
        maxInput.value = '';
        errorTip.value = '';
        inputTip.value = '';
    };

    const supplyFn = () => {
        if (props.showTokenDropdown) {
            const nativeCurrency =
                globalStore.chainsMapGetter[currentTokenId.value]?.nativeCurrency;
            emit('priceSupplyFn', {
                tokenId: currentTokenId.value,
                symbol: nativeCurrency?.symbol,
                decimals: nativeCurrency?.decimals,
                min: minInput.value,
                max: maxInput.value
            });
        } else {
            emit('rentalDurSupplyFn', {
                min: minInput.value,
                max: maxInput.value
            });
        }
    };

    let showTipTimer: number;

    const handleShowTipTimer = () => {
        showTipTimer && clearTimeout(showTipTimer);
        inputTip.value = props.inputText;
        showTipTimer = window.setTimeout(() => {
            inputTip.value = '';
        }, 3000);
    };

    const handleErrorTip = () => {
        if (
            maxInput.value &&
            minInput.value &&
            bigNumberComparedTo(maxInput.value, minInput.value) !== 1
        ) {
            errorTip.value = props.errorText;
        } else {
            errorTip.value = '';
        }
    };

    watch(
        minInput,
        (newValue, oldValue) => {
            const { handleValue, isNeedShowTip } = props.handleInputValue(newValue, oldValue);
            minInput.value = handleValue;
            isNeedShowTip && handleShowTipTimer();
            handleErrorTip();
        },
        {
            flush: 'post'
        }
    );

    watch(
        maxInput,
        (newValue, oldValue) => {
            const { handleValue, isNeedShowTip } = props.handleInputValue(newValue, oldValue);
            maxInput.value = handleValue;
            isNeedShowTip && handleShowTipTimer();
            handleErrorTip();
        },
        {
            flush: 'post'
        }
    );

    defineExpose({
        reset
    });
</script>

<style lang="less" scoped>
    .base_condition {
        &__header {
            .cursor_pointer;

            display: flex;
            align-items: center;
            justify-content: space-between;

            span {
                .text_font_bold;
            }

            .iconfont {
                font-size: 16px;
                transform: scale(0.5);
                transition: transform 0.3s;
            }

            .visible {
                transform: scale(0.5) rotate(180deg);
            }
        }

        &__content {
            &__token_dropdown {
                margin: 12px 0 0;

                :deep(.dropdown_container) {
                    width: auto;
                    padding: 4px 0 4px 8px;

                    &__image {
                        width: 24px;
                        height: 24px;
                        margin-right: 4px;
                    }

                    &__text {
                        width: calc(28px + 12px);
                    }
                }
            }

            &__input_wrap {
                display: flex;
                align-items: center;
                margin-top: 8px;

                &__min,
                &__max {
                    flex: 1;

                    input {
                        width: 100%;
                        height: 32px;
                        padding: 7px 8px;
                        background-color: var(--bj-background-color-third);
                        border: 1px solid var(--bj-border-color);
                        border-radius: var(--border-radius-normal);
                    }
                }

                &__to {
                    .small_text_font;

                    margin: 0 8px;
                }
            }

            .margin_top_12 {
                margin-top: 12px;
            }

            &__button {
                height: 32px;
                margin-top: 8px;
                font-size: 14px;
            }

            &__error {
                padding-top: 8px;
                color: #ff4848;
                font-weight: 400;
                font-size: 12px;
                font-family: Inter-Regular;
                line-height: 16px;
            }
        }
    }

    :global(.price_dropdown.el-dropdown__popper) {
        .slef_el_dropdown__popper;

        width: 104px;
    }
</style>
