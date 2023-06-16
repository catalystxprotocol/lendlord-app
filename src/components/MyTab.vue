<template>
    <div class="my_tab">
        <div class="my_tab__text_wrap">
            <span v-show="prefixText" class="my_tab__text_wrap__prefix_text">
                {{ prefixText }}
            </span>
            <span class="my_tab__text_wrap__text">{{ text }}</span>
            <span v-show="suffixText" class="my_tab__text_wrap__suffix_text">{{ suffixText }}</span>
        </div>

        <MyCloseIcon @click="closeClick" />
    </div>
</template>

<script setup lang="ts">
    import MyCloseIcon from '@/components/MyCloseIcon.vue';
    interface IProps {
        text: string;
        prefixText?: string;
        suffixText?: string;
    }

    withDefaults(defineProps<IProps>(), {});

    const emit = defineEmits<{
        (e: 'closeFn', event: Event): void;
    }>();

    const closeClick = (event: Event) => {
        emit('closeFn', event);
    };
</script>

<style lang="less" scoped>
    .my_tab {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 32px;
        padding: 8px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--bj-primary-color);
        border-radius: var(--border-radius-normal);

        &__text_wrap {
            .small_text_font;
            .text_ellipsis;

            display: flex;
            flex: 1;
            margin-right: 8px;

            &__prefix_text {
                margin-right: 5px;
            }

            &__text {
                .text_ellipsis;

                flex: 1;
            }

            &__suffix_text {
                margin-left: 5px;
            }
        }
    }
</style>
