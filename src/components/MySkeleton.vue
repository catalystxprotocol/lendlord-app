<template>
    <div
        class="my_skeleton"
        :class="{ skeleton_loading: animated, width: width, height: height }"
    ></div>
</template>

<script setup lang="ts">
    interface IProps {
        width?: string;
        height?: string;
        animated?: boolean;
    }

    withDefaults(defineProps<IProps>(), {
        animated: true
    });
</script>

<style scoped lang="less">
    .my_skeleton {
        background: linear-gradient(90deg, #f9f8f6 25%, #f3f0ec 37%, #f9f8f6 63%);
        background-size: 400% 100%;
    }

    .width {
        width: v-bind(width);
    }

    .height {
        height: v-bind(height);
    }

    .skeleton_loading {
        animation: my-skeleton-loading 1.4s ease infinite;
    }

    @keyframes my-skeleton-loading {
        0% {
            background-position: 100% 50%;
        }

        100% {
            background-position: 0 50%;
        }
    }
</style>
