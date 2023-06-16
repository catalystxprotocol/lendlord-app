<template>
    <input
        ref="inputRef"
        v-model="inputValue"
        class="my_input"
        type="text"
        :disabled="disabled"
        :placeholder="placeholder"
        @blur="onBlur"
        @focus="onFocus"
    />
</template>

<script setup lang="ts">
    interface IProps {
        type?: string;
        input: string;
        placeholder: string;
        disabled?: boolean;
    }

    const props = withDefaults(defineProps<IProps>(), {
        type: 'text',
        disabled: false
    });

    const emit = defineEmits<{
        (e: 'update:input', value: string): void;
    }>();

    const inputRef = ref();

    const isFocus = ref(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onFocus = (event: FocusEvent) => {
        isFocus.value = true;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onBlur = (event: FocusEvent) => {
        isFocus.value = false;
    };

    const inputValue = ref('');

    watch(inputValue, (newValue) => {
        emit('update:input', newValue);
    });

    watch(
        () => props.input,
        (newValue) => {
            inputValue.value = newValue;
        },
        {
            immediate: true
        }
    );

    const inputFocus = () => {
        inputRef?.value?.focus();
    };

    const clearInput = () => {
        inputValue.value = '';
        inputFocus();
    };

    defineExpose({
        clearInput,
        isFocus,
        inputFocus
    });
</script>

<style lang="less" scoped>
    .my_input {
        box-sizing: border-box;
        height: 100%;
        padding: 11px 12px;
        .small_text_font;

        letter-spacing: 0;

        &::placeholder {
            color: rgba(0, 0, 0, 0.35);
            font-weight: 400;
            font-size: 14px;
            font-family: Inter-Regular, Inter;
            letter-spacing: 0;
        }

        /* 普通IE浏览器 样式清除 */
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
        }

        /* 火狐浏览器样式清除 */
        &[type='number'] {
            -moz-appearance: textfield;
        }

        &[disabled] {
            color: rgba(0, 0, 0, 0.34);
            opacity: 1;
        }
    }
</style>
