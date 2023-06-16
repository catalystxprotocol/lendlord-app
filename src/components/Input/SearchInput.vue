<template>
    <div class="input_wrap" :class="{ input_focus: myInputRef?.isFocus }">
        <MyInput
            ref="myInputRef"
            v-model:input="searchValue"
            type="text"
            class="input_wrap__input"
            :placeholder="placeholder"
        />
        <MyCloseIcon
            v-show="searchValue && myInputRef?.isFocus"
            class="input_wrap__clear"
            @mousedown="clearInput"
        />
        <div class="input_wrap__line"></div>
        <div class="input_wrap__iconfont">
            <i class="iconfont icon-sousuo"></i>
        </div>
    </div>
</template>

<script setup lang="ts">
    import MyCloseIcon from '@/components/MyCloseIcon.vue';

    interface IProps {
        input: string;
        placeholder: string;
    }

    const props = defineProps<IProps>();
    const emit = defineEmits<{
        (e: 'update:input', value: string): void;
    }>();

    const searchValue = ref('');

    const myInputRef = ref();

    watch(searchValue, (newValue) => {
        emit('update:input', newValue);
    });

    watch(
        () => props.input,
        (newValue) => {
            searchValue.value = newValue;
        },
        {
            immediate: true
        }
    );

    const clearInput = () => {
        setTimeout(() => {
            myInputRef?.value?.clearInput(true);
        });
    };
</script>

<style lang="less" scoped>
    .input_wrap {
        display: flex;
        height: 32px;
        margin: 0 16px;
        background: var(--bj-background-color-third);
        border: 1px solid var(--bj-border-color);
        border-radius: var(--border-radius-normal);

        &__input {
            flex: 1;
            padding: 7px 8px 6px;
        }

        &__clear {
            margin: 6px;
        }

        &__line {
            width: 1px;
            margin: 7px 0;
            background-color: var(--bj-border-color);
        }

        &__iconfont {
            padding: 6px 8px;

            .iconfont {
                color: var(--bj-primary-color);
                font-size: 20px;
            }
        }
    }

    .input_focus {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--bj-primary-color);
    }
</style>
