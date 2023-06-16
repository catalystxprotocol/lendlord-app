<template>
    <div class="waterfall_layout">
        <BaseLayout />
    </div>
</template>

<script setup lang="ts">
    import BaseLayout from './index.vue';
</script>

<style lang="less" scoped>
    .waterfall_layout {
        width: 100%;
        height: 100%;

        :deep(.layout) {
            height: 100%;

            &__header_box {
            }

            &__content {
                overflow-y: auto;

                &__router_container {
                }

                &__error_container {
                }
            }

            &__footer {
                display: none;
            }
        }
    }
</style>
