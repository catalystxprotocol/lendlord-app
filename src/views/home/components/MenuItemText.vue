<template>
    <el-tooltip
        popper-class="box-item"
        effect="light"
        :content="chainName"
        placement="top"
        :disabled="isDisabled"
    >
        <div ref="textBox" class="chain_name__box">
            <span
                ref="text"
                class="chain_name__box__name"
                :class="active ? 'chain_name_active' : ''"
                >{{ chainName }}
            </span>
        </div>
    </el-tooltip>
</template>

<script lang="ts" setup>
    interface IProps {
        active: boolean;
        chainName: string;
        expansion: boolean; // menu 是否为展开状态，只有展开才可根据宽度计算是否需要展示tooltip
    }

    const props = withDefaults(defineProps<IProps>(), {});

    const text: any = ref(null);
    const textBox: any = ref(null);
    const isDisabled = ref(false);

    watch(
        () => props.expansion,
        (value) => {
            if (value) {
                isDisabled.value = textBox.value.offsetWidth >= text.value.offsetWidth;
            }
        }
    );
</script>

<style lang="less" scoped>
    .chain_name__box {
        .text_ellipsis;

        flex-grow: 1;

        &__name {
            width: 100px;
            .small_text_font;
        }
    }

    .chain_name_active {
        .Inter-Regular_Semi-Bold;

        color: var(--bj-primary-color) !important;
    }
</style>
