<template>
    <div class="lend_input" :class="{ input_focus: myInputRef?.focused }">
        <MyInput
            ref="myInputRef"
            v-model:input="lendInputValue"
            class="lend_input__input"
            type="text"
            :placeholder="placeholder"
        />
        <div class="lend_input__right">
            <MyCloseIcon
                v-show="isNeedClear && lendInputValue"
                class="lend_input__right__clear"
                @mousedown="clearInput"
            />
            <div class="lend_input__right__text"> / Day </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    interface IProps {
        input: string;
        placeholder: string;
        isNeedClear?: boolean;
    }

    const props = withDefaults(defineProps<IProps>(), {
        isNeedClear: false
    });

    const emit = defineEmits<{
        (e: 'update:input', value: string): void;
    }>();

    const myInputRef = ref();

    const lendInputValue = ref<string>('');

    const clearInput = () => {
        setTimeout(() => {
            myInputRef?.value?.clearInput();
        });
    };

    watch(lendInputValue, (newValue) => {
        emit('update:input', newValue);
    });

    watch(
        () => props.input,
        (newValue) => {
            lendInputValue.value = newValue;
        },
        {
            immediate: true
        }
    );
</script>

<style lang="less" scoped>
    .lend_input {
        display: flex;
        align-items: center;
        height: 40px;
        padding-right: 16px;
        background: var(--bj-background-color-third);
        border: 1px solid var(--bj-border-color);
        border-radius: var(--border-radius-normal);

        &__input {
            flex: 1;
            padding: 11px 12px;
        }

        &__right {
            display: flex;

            &__clear {
                margin: 6px;
            }

            &__text {
                .small_text_font;

                display: flex;
                align-items: center;
                justify-content: center;
                color: rgba(0, 0, 0, 0.35);
            }
        }
    }

    .input_focus {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--bj-primary-color);
    }
</style>
