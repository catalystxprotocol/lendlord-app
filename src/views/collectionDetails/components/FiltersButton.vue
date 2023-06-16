<template>
    <div class="filters_button_wrap">
        <MySkeleton v-if="loading" class="filters_button_wrap__loading" />
        <div
            v-else
            class="filters_button_wrap__content"
            :class="{ active: isActive, disable: isDisable }"
            @click="btnClick"
        >
            <i class="iconfont icon-filter"></i>
            <span>Filters</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import MySkeleton from '@/components/MySkeleton.vue';
    import { FiltersBtnStatus } from '@/constants/collectionDetails';

    interface IProps {
        status: FiltersBtnStatus;
        loading: boolean;
    }

    const props = defineProps<IProps>();

    const emit = defineEmits<{
        (e: 'callback', event: Event): void;
    }>();

    const isActive = computed(() => props.status === FiltersBtnStatus.active);

    const isDisable = computed(() => props.status === FiltersBtnStatus.disable);

    const btnClick = (event: Event) => {
        if (isDisable.value) return;
        emit('callback', event);
    };
</script>

<style lang="less" scoped>
    .filters_button_wrap {
        width: 83px;
        height: 32px;

        &__loading {
            width: 100%;
            height: 100%;
            border-radius: var(--border-radius-normal);
        }

        &__content {
            .small_text_font;
            .cursor_pointer;

            display: flex;
            align-items: center;
            box-sizing: border-box;
            width: 83px;
            height: 32px;
            padding: 7px 8px;
            background: rgba(188, 178, 160, 0.09);
            border: 1px solid rgba(0, 0, 0, 0.09);
            border-radius: var(--border-radius-normal);
            transition: border 0.2s ease-in-out, background 0.2s ease-in-out;

            .iconfont {
                margin-right: 10px;
                color: rgba(0, 0, 0, 1);
                font-size: 17px;
            }

            span {
                color: rgba(0, 0, 0, 0.79);
            }
        }

        .active {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--bj-primary-color);

            .iconfont {
                color: rgba(0, 0, 0, 1);
            }

            span {
                color: rgba(0, 0, 0, 0.79);
            }
        }

        .disable {
            cursor: default;

            .iconfont {
                color: rgba(0, 0, 0, 0.49);
            }

            span {
                color: rgba(0, 0, 0, 0.3871);
            }
        }
    }
</style>
