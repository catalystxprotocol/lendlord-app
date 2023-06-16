<template>
    <!-- popper-options flip enabled false 表示当屏幕放不下的时候，不做位置调整 -->
    <el-dropdown
        ref="dropdownRef"
        popper-class="my_search"
        placement="bottom-start"
        :popper-options="{
            modifiers: [
                {
                    name: 'flip',
                    enabled: false
                }
            ]
        }"
        :teleported="teleported"
        :trigger="['click']"
        @visible-change="changeVisible"
    >
        <DropdownContainer
            class="search_dropdown_wrap"
            :visible="visible"
            :user-selected="userSelected"
            :text="selectedText"
        />
        <template #dropdown>
            <div class="overlay_container">
                <SearchInput
                    v-model:input="searchValue"
                    class="overlay_container__input_wrap"
                    placeholder="Search by collection"
                />
                <el-scrollbar class="overlay_container__list_wrap" max-height="188px">
                    <div
                        v-for="item in searchResultArray"
                        :key="item.value"
                        class="overlay_container__list_wrap__item cursor_pointer"
                        :class="{
                            selected_option: item.value === selectOption[0]?.value && !searchValue
                        }"
                        @click="onSelect(item.label, item.value)"
                    >
                        <span
                            v-for="(highLightData, index) in item.handleHighLightData"
                            :key="index"
                            :class="{ primary_color: highLightData.ishighLight }"
                        >
                            {{ highLightData.text }}
                        </span>
                    </div>
                    <div
                        v-show="searchResultArray.length <= 0"
                        class="overlay_container__list_wrap__item_no_data"
                    >
                        No items found
                    </div>
                </el-scrollbar>
            </div>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
    import { handleHighLightWord } from '@/helper/searchHelper';
    import { TOption, TValue } from '@/types/interface/global.interface';

    interface IProps {
        options: TOption[];
        status: string | number;
        teleported?: boolean;
    }

    interface SearchResult {
        label: string;
        value: TValue;
        handleHighLightData: {
            ishighLight: boolean;
            text: string;
        }[];
    }

    const props = withDefaults(defineProps<IProps>(), {
        teleported: false
    });

    const dropdownRef = ref();
    const visible = ref(false);
    const changeVisible = (flag: boolean) => {
        visible.value = flag;
        if (flag === true) {
            // 打开的时候清除输入框内容
            searchValue.value = '';
            // setTimeout(() => {
            //     inputRef && inputRef.value.focus();
            // }, 0);
        }
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

    const onSelect = (label: string, value: TValue, noFound = false) => {
        if (noFound) {
            dropdownRef.value?.handleClose();
            return;
        }
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

    const searchValue = ref('');

    const searchResultArray = ref<SearchResult[]>([]);
    watch(
        [() => props.options, searchValue],
        () => {
            const searchText = searchValue.value.trim();
            const matchArr = props.options.filter((item) => {
                const reg = new RegExp(searchText, 'ig');
                return item.label.match(reg);
            });
            if (matchArr) {
                searchResultArray.value = matchArr.map((item) => {
                    const handleData = handleHighLightWord(item.label, searchText);
                    return {
                        ...item,
                        handleHighLightData: handleData
                    };
                });
            } else {
                searchResultArray.value = [];
            }
        },
        {
            immediate: true,
            deep: true
        }
    );
</script>

<style lang="less" scoped>
    .search_dropdown_wrap {
        :deep(.dropdown_container__text) {
            width: 180px;
        }
    }

    :global(.my_search.el-dropdown__popper) {
        min-width: 300px;
        max-width: 400px;
        margin-top: -8px;
        padding: 0;
        background: #ffffff;
        border: none;
        border-radius: 9px;
        box-shadow: 0 16px 20px 0 rgba(35, 27, 24, 0.05);
    }

    .overlay_container {
        padding: 16px 0 8px;

        &__input_wrap {
        }

        &__list_wrap {
            margin: 8px 0 0;

            &__item {
                .text_ellipsis;
                .small_text_font;

                padding: 8px 32px 8px 16px;
                color: var(--bj-text-normal);

                &:hover {
                    background-color: var(--bj-background-color-third);
                }

                .primary_color {
                    color: var(--bj-primary-color);
                }
            }

            &__item_no_data {
                .text_ellipsis;
                .small_text_font;

                padding: 8px 32px 8px 16px;
                color: var(--bj-text-normal);
                cursor: default;
            }

            .selected_option {
                .Inter-Regular_Semi-Bold;

                color: var(--bj-primary-color);
            }

            :deep(.el-scrollbar__bar) {
                width: 4px;
                transform: translateX(-16px);

                .el-scrollbar__thumb {
                    background-color: rgba(255, 159, 42, 0.35);
                    border-radius: 2px;
                    opacity: 1;
                }
            }
        }
    }
</style>
