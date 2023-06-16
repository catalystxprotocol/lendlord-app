<template>
    <el-dropdown
        ref="dropdownRef"
        :popper-class="popperClass"
        placement="bottom-start"
        :trigger="['click']"
        @visible-change="changeVisible"
    >
        <div class="dropdown_container cursor_pointer" :class="{ visible_dropdown: visible }">
            <div class="dropdown_container__image">
                <img :src="selectedObject.imgUrl" alt="" />
            </div>
            <div
                class="dropdown_container__text"
                :class="{
                    selected_color_default: userSelected
                }"
                >{{ selectedObject.label }}</div
            >
            <div class="dropdown_container__iconfont">
                <i class="iconfont icon-zhankai" :class="{ visible: visible }"></i>
            </div>
        </div>
        <template #dropdown>
            <div class="overlay_container">
                <div
                    v-for="item in options"
                    :key="item.value"
                    class="overlay_container__item cursor_pointer"
                    :class="{ selected_option: item.value === selecTokenTOption[0]?.value }"
                    @click="onSelect(item.label, item.value, item.imgUrl)"
                >
                    <div class="overlay_container__item__img">
                        <img :src="item.imgUrl" alt="" />
                    </div>
                    {{ item.label }}
                </div>
            </div>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
    import { TokenTOption, TValue } from '@/types/interface/global.interface';

    interface IProps {
        options: TokenTOption[];
        status: TValue;
        popperClass?: string;
    }

    const props = withDefaults(defineProps<IProps>(), {
        popperClass: 'token_dropdown'
    });
    const dropdownRef = ref();
    const visible = ref(false);
    const changeVisible = (flag: boolean) => {
        visible.value = flag;
    };

    const userSelected = ref(true);

    const selecTokenTOption = ref<TokenTOption[]>([]);

    const selectedObject = computed(() => {
        if (selecTokenTOption.value.length > 0) {
            return selecTokenTOption.value[0];
        } else {
            return props.options?.[0] || {};
        }
    });

    watch(
        () => props.status,
        () => {
            const { options } = props;
            const filterData = options.filter((item) => item.value == props.status);
            if (filterData.length > 0) {
                selecTokenTOption.value = filterData;
            }
        },
        {
            immediate: true
        }
    );

    defineExpose({
        selecTokenTOption
    });

    const emit = defineEmits<{
        (e: 'onSelectedChange', value: TValue): void;
    }>();

    const onSelect = (label: string, value: TValue, imgUrl: string) => {
        userSelected.value = true;
        dropdownRef.value?.handleClose();
        selecTokenTOption.value = [];
        selecTokenTOption.value.push({
            imgUrl,
            label,
            value
        });

        emit('onSelectedChange', value);
        visible.value = false;
    };
</script>

<style lang="less" scoped>
    .dropdown_container {
        display: flex;
        box-sizing: border-box;
        width: 124px;
        padding: 6px 0 6px 8px;
        background: var(--bj-background-color-third);
        border: 1px solid var(--bj-border-color);
        border-radius: var(--border-radius-normal);
        transition: all 0.2s;

        &:hover {
            .visible_dropdown;
        }

        &__image {
            width: 28px;
            height: 28px;
            margin-right: 8px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        &__text {
            .text_ellipsis;

            display: flex;
            align-items: center;
            width: calc(28px + 18px);
            color: #000000;
            font-weight: 400;
            font-size: 14px;
            font-family: Inter-Regular;
            line-height: 18px;
            text-align: left;
            border-right: 1px solid var(--bj-border-color);
        }

        &__iconfont {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 3px;

            .iconfont {
                display: inline-block;
                color: var(--bj-primary-color);
                font-size: 14px;
                transform: scale(0.6);
                transition: transform 0.3s;
            }

            .visible {
                transform: scale(0.6) rotate(180deg);
            }
        }

        .selected_color_default {
            color: var(--bj-text-normal);
        }
    }

    .visible_dropdown {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--bj-primary-color);

        .dropdown_container__text {
            color: var(--bj-text-normal);
        }
    }

    :global(.token_dropdown.el-dropdown__popper) {
        .slef_el_dropdown__popper;

        width: 124px;
    }

    .overlay_container {
        &__item {
            .text_ellipsis;
            .small_text_font;

            display: flex;
            align-items: center;
            padding: 8px 16px;
            color: var(--bj-text-normal);

            &:hover {
                background-color: var(--bj-background-color-third);
            }

            &__img {
                width: 20px;
                height: 20px;
                margin-right: 8px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .selected_option {
            .Inter-Regular_Semi-Bold;

            color: var(--bj-primary-color);
        }
    }
</style>
