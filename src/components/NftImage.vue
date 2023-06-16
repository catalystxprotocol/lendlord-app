<template>
    <div class="image_wrap">
        <el-image
            class="image_wrap__image"
            :src="src || defaultAndErrorImg"
            :loading="loadingType"
            :lazy="lazy"
            :fit="src ? fit : 'cover'"
            @load="onLoad"
            @error="onError"
        >
            <template #placeholder>
                <!-- 加载中 -->
                <div class="image_wrap__image__loading_wrap">
                    <MySkeleton width="100%" height="100%" />
                </div>
            </template>
            <template #error>
                <!-- 加载失败 -->
                <div class="image_wrap__image__error_wrap">
                    <img :src="defaultAndErrorImg" />
                </div>
            </template>
        </el-image>
        <div v-show="loadComplete && isMask" class="image_wrap__mask">
            <div class="image_wrap__mask__text_wrap">
                <p class="image_wrap__mask__text_wrap__first">{{ maskFirstText }}</p>
                <p class="image_wrap__mask__text_wrap__second">{{ maskSecondText }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import nftDefaultImage from '@/assets/image/nft_default_image.jpg';
    import defaultSmall from '@/assets/image/default_small.png';

    interface IProps {
        src: string;
        fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
        loadingType?: 'eager' | 'lazy';
        lazy?: boolean;
        isMask?: boolean;
        maskFirstText?: string;
        maskSecondText?: string;
        defaultImageOverspread?: boolean;
    }

    const props = withDefaults(defineProps<IProps>(), {
        fit: 'contain',
        loading: 'lazy',
        lazy: true,
        isMask: false,
        maskFirstText: '',
        maskSecondText: '',
        defaultImageOverspread: false
    });

    const emit = defineEmits<{
        (e: 'load', isSuccess: boolean): void;
        (e: 'error', isError: boolean): void;
    }>();

    const loadSuccess = ref(false);
    const loadComplete = ref(false);

    const defaultAndErrorImg = computed(() => {
        return props.defaultImageOverspread ? defaultSmall : nftDefaultImage;
    });

    const onLoad = () => {
        loadComplete.value = true;
        loadSuccess.value = true;
        emit('load', true);
    };

    const onError = () => {
        loadComplete.value = true;
        loadSuccess.value = false;
        emit('error', true);
    };
</script>

<style lang="less" scoped>
    .image_wrap {
        position: relative;
        width: 200px;
        height: 200px;
        overflow: hidden;
        // background: linear-gradient(180deg, #ffffff 0%, #fdfdfd 91%, #f3f3f3 100%);
        background: #ffffff;

        &__image {
            width: 100%;
            height: 100%;

            &__loading_wrap {
                width: 100%;
                height: 100%;
            }

            &__error_wrap {
                width: 100%;
                height: 100%;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }

        &__mask {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.5);

            &__text_wrap {
                text-align: center;

                &__first {
                    .small_text_font;

                    color: rgba(255, 255, 255, 0.8);
                }

                &__second {
                    .text_font_bold;

                    color: #ffffff;
                }
            }
        }
    }
</style>
