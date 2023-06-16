<template>
    <div class="search_token_id_wrap">
        <MySkeleton v-if="initLoading" class="search_token_id_wrap__loading" />
        <div
            v-if="!initLoading"
            class="search_token_id_wrap__input"
            :class="{ input_focus: myInputRef?.isFocus, input_small: isSmall }"
        >
            <transition name="slide-width-fade">
                <div v-show="!isSmall" class="search_token_id_wrap__input__large_wrap">
                    <MyInput
                        ref="myInputRef"
                        v-model:input="searchValue"
                        type="text"
                        class="search_token_id_wrap__input__large_wrap__input"
                        :placeholder="placeholder"
                        :disabled="searchLoading"
                        @blur="onBlur"
                        @keyup.enter="searchFn"
                    />
                    <MyCloseIcon
                        v-show="searchValue && myInputRef?.isFocus"
                        class="search_token_id_wrap__input__large_wrap__clear"
                        @mousedown="clearInput"
                    />
                    <div class="search_token_id_wrap__input__large_wrap__line"></div>
                </div>
            </transition>
            <div
                class="search_token_id_wrap__input__iconfont"
                :class="{ disabled: searchLoading }"
                @mousedown="searchIconFn"
            >
                <MyLoading v-show="searchLoading" width="20px" height="20px" :scale="0.5" />
                <i v-show="!searchLoading" class="iconfont icon-sousuo"></i>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    interface IProps {
        placeholder: string;
        initLoading: boolean;
        searchLoading: boolean;
    }

    defineProps<IProps>();

    const emit = defineEmits<{
        (e: 'searchFn', value: string): void;
    }>();

    const searchValue = ref('');

    const myInputRef = ref();

    const clearInput = () => {
        flag = true;
        myInputRef?.value?.clearInput();
    };

    const onBlur = () => {
        if (flag) {
            flag = false;
            myInputRef?.value?.inputFocus();
            return;
        }
        if (!searchValue.value) {
            chagneSizeFn(true);
        }
    };

    let flag = false;

    const searchIconFn = () => {
        if (searchValue.value) {
            searchFn();
        } else {
            flag = true;
            if (isSmall.value) {
                chagneSizeFn(false);
                nextTick(() => {
                    myInputRef?.value?.inputFocus();
                });
            }
        }
    };

    const isSmall = ref(true);
    const chagneSizeFn = (bool: boolean) => {
        isSmall.value = bool;
    };

    const searchFn = () => {
        emit('searchFn', searchValue.value);
    };
</script>

<style lang="less" scoped>
    .search_token_id_wrap {
        &__input {
            display: flex;
            height: 32px;
            overflow: hidden;
            background: var(--bj-background-color-third);
            border: 1px solid var(--bj-border-color);
            border-radius: var(--border-radius-normal);

            &__large_wrap {
                display: flex;
                width: 232px;
                opacity: 1;

                &__input {
                    flex: 1;
                    padding: 6px 8px 7px;
                }

                &__clear {
                    margin: 6px;
                }

                &__line {
                    width: 1px;
                    margin: 7px 0;
                    background-color: var(--bj-border-color);
                }
            }

            &__iconfont {
                .cursor_pointer;

                z-index: 1;
                padding: 6px 8px;
                transition: padding 0.2s ease-in-out;

                .iconfont {
                    color: var(--bj-primary-color);
                    font-size: 20px;
                }
            }

            .disabled {
                cursor: default;
                pointer-events: none;
            }
        }

        .input_focus {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--bj-primary-color);
        }

        .input_small {
            height: 32px;

            .search_token_id_wrap__input__iconfont {
                padding: 6px;
            }
        }

        &__loading {
            width: 32px;
            height: 32px;
            border-radius: var(--border-radius-normal);
        }
    }

    .slide-width-fade-enter-active {
        transition: width 0.2s ease-in-out, opacity 0.3s ease-in-out;
    }

    .slide-width-fade-leave-active {
        transition: width 0.2s ease-in-out, opacity 0.1s ease-in-out;
    }

    .slide-width-fade-enter-from,
    .slide-width-fade-leave-to {
        width: 0;
        opacity: 0;
    }
</style>
