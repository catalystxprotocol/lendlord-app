<template>
    <el-dropdown
        ref="dropdownRef"
        popper-class="my_base"
        placement="bottom-start"
        :trigger="['click']"
        @visible-change="changeVisible"
    >
        <DropdownContainer
            class="base_dropdown_wrap"
            :visible="visible"
            :user-selected="userSelected"
            :text="selectedText"
        />
        <template #dropdown>
            <div class="overlay_container">
                <div
                    v-for="item in options"
                    :key="item.value"
                    class="overlay_container__item cursor_pointer"
                    :class="{ selected_option: item.value === selectOption[0]?.value }"
                    @click="onSelect(item.label, item.value)"
                    >{{ item.label }}</div
                >
            </div>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
    import { TOption, TValue } from '@/types/interface/global.interface';

    interface IProps {
        options: TOption[];
        status: TValue;
    }

    const props = defineProps<IProps>();
    const dropdownRef = ref();
    const visible = ref(false);
    const changeVisible = (flag: boolean) => {
        visible.value = flag;
    };

    const userSelected = ref(false);

    const selectOption = ref<TOption[]>([]);

    const selectedText = computed(() => {
        if (selectOption.value.length > 0) {
            return selectOption.value[0].label;
        } else {
            return props.options[0]?.label ?? '';
        }
    });

    watch(
        () => props.status,
        () => {
            const { options } = props;
            const filterData = options.filter((item) => item.value == props.status);
            if (filterData.length > 0) {
                selectOption.value = filterData;
            }
        },
        {
            immediate: true
        }
    );

    defineExpose({
        selectOption
    });

    const emit = defineEmits<{
        (e: 'onSelectedChange', value: TValue): void;
    }>();

    const onSelect = (label: string, value: TValue) => {
        userSelected.value = true;
        dropdownRef.value?.handleClose();
        selectOption.value = [];
        selectOption.value.push({
            label,
            value
        });

        emit('onSelectedChange', value);
        visible.value = false;
    };
</script>

<style lang="less" scoped>
    .base_dropdown_wrap {
        :deep(.dropdown_container__text) {
            width: 125px;
        }
    }

    :global(.my_base.el-dropdown__popper) {
        width: 172px;
        margin-top: -8px;
        padding: 8px 0;
        background: #ffffff;
        border: none;
        border-radius: 9px;
        box-shadow: 0 16px 20px 0 rgba(35, 27, 24, 0.05);
    }

    .overlay_container {
        &__item {
            .text_ellipsis;
            .small_text_font;

            padding: 8px 16px;
            color: var(--bj-text-normal);

            &:hover {
                background-color: var(--bj-background-color-third);
            }
        }

        .selected_option {
            .Inter-Regular_Semi-Bold;

            color: var(--bj-primary-color);
        }
    }
</style>
