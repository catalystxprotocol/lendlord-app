<template>
    <div class="collection_nft_card">
        <NftImage
            class="collection_nft_card__image"
            :src="imageUrl"
            :is-mask="isMask"
            :mask-first-text="maskFirstText"
            :mask-second-text="maskSecondText"
        />
        <div class="collection_nft_card__content">
            <div class="collection_nft_card__content__token_id">{{
                tokenId || DEFAULT_DISPLAY_TEXT
            }}</div>
            <div v-show="isShowDateAndButton" class="collection_nft_card__content__date">{{
                dateDisplay || DEFAULT_DISPLAY_TEXT
            }}</div>
            <div
                v-show="isShowDateAndButton"
                class="collection_nft_card__content__button"
                :class="{ collection_nft_card__content__button_hover: isHoverSwitchButton }"
                @click="buttonFn"
            >
                <span class="collection_nft_card__content__button__text">{{ buttonText }}</span>
                <span class="collection_nft_card__content__button__hover_text">Rent</span>
            </div>
            <div v-show="!isShowDateAndButton" :style="{ height: '58px' }"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { DEFAULT_DISPLAY_TEXT } from '@/constants/index';

    interface IProps {
        imageUrl: string;
        tokenId: string;
        dateDisplay: string;
        buttonText: string;
        isShowDateAndButton: boolean;
        isHoverSwitchButton: boolean;
        isMask?: boolean;
        maskFirstText?: string;
        maskSecondText?: string;
        buttonClickFn?: Function;
    }

    const props = withDefaults(defineProps<IProps>(), {});

    const buttonFn = (event: Event) => {
        if (props.buttonClickFn) {
            event.stopPropagation();
            props.buttonClickFn();
        }
    };
</script>

<style lang="less" scoped>
    .collection_nft_card {
        .cursor_pointer;

        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
        border: 2px solid transparent;
        border-radius: var(--border-radius-second);
        // box-shadow: var(--bj-box-shadow-card);
        box-shadow: 0 16px 20px 0 rgba(35, 27, 24, 0.02);

        &__image {
            width: 100%;
            height: 228px;
        }

        &__content {
            flex: 1;
            padding: 8px 12px 12px;
            background: #ffffff;

            &__token_id {
                .text_font_bold;
                .text_ellipsis;

                margin-bottom: 8px;
            }

            &__date {
                .small_text_font;
                .text_ellipsis;

                margin-bottom: 12px;
            }

            &__button {
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                height: 32px;
                background: rgba(188, 178, 160, 0.09);
                border: 1px solid rgba(0, 0, 0, 0.09);
                border-radius: 8px;
                transition: background-color 0.1s;

                span {
                    .text_ellipsis;
                    .text_font_bold;
                }

                &__text {
                    display: inline-block;
                }

                &__hover_text {
                    display: none;
                }
            }

            &__button_hover {
                &:hover {
                    background: #ff9f2a;
                    border: none;

                    span {
                        color: #ffffff;
                    }

                    .collection_nft_card__content__button__text {
                        display: none;
                    }

                    .collection_nft_card__content__button__hover_text {
                        display: inline-block;
                    }
                }
            }
        }

        &:hover {
            border: 2px solid var(--bj-primary-color);
        }
    }
</style>
