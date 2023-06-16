<template>
    <div class="nft_card">
        <NftImage
            class="nft_card__image"
            :src="imageUrl"
            :is-mask="isMask"
            :mask-first-text="maskFirstText"
            :mask-second-text="maskSecondText"
        />
        <div class="nft_card__content">
            <div class="nft_card__content__token_id">{{ tokenId || DEFAULT_DISPLAY_TEXT }}</div>
            <div class="nft_card__content__collection_name">{{
                collectionName || DEFAULT_DISPLAY_TEXT
            }}</div>
            <div class="nft_card__content__date">
                <span class="nft_card__content__date__label">{{
                    dateLabel || DEFAULT_DISPLAY_TEXT
                }}</span>
                <span class="nft_card__content__date__value">{{
                    dateValue || DEFAULT_DISPLAY_TEXT
                }}</span>
            </div>
            <MyButton
                class="nft_card__content__button"
                :button-text="buttonText"
                :is-ghost-button="isGhostButton"
                :disable="disableButton"
                @click="buttonFn"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { DEFAULT_DISPLAY_TEXT } from '@/constants/index';

    interface IProps {
        imageUrl: string;
        tokenId: string;
        collectionName: string;
        dateLabel: string;
        dateValue: string;
        buttonText: string;
        isGhostButton: Boolean;
        disableButton: Boolean;
        isMask?: boolean;
        maskFirstText?: string;
        maskSecondText?: string;
        buttonClickFn?: Function;
    }

    const props = withDefaults(defineProps<IProps>(), {});

    const buttonFn = (event: Event) => {
        event.stopPropagation();
        props.buttonClickFn && props.buttonClickFn();
    };
</script>

<style lang="less" scoped>
    .nft_card {
        width: 284px;
        background: #ffffff;
        border-radius: var(--border-radius-second);
        box-shadow: var(--bj-box-shadow-card);

        &__image {
            width: 100%;
            height: 272px;
            border-radius: var(--border-radius-second) var(--border-radius-second) 0 0;
        }

        &__content {
            padding: 12px 16px 16px;

            &__token_id {
                .text_font_bold;
                .text_ellipsis;

                margin-bottom: 4px;
            }

            &__collection_name {
                .small_text_font;
                .text_ellipsis;

                margin-bottom: 12px;
            }

            &__date {
                .small_text_font;

                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 18px;
                margin-bottom: 12px;

                &__label {
                    margin-right: 10px;
                    text-align: left;
                }

                &__value {
                    .text_ellipsis;

                    flex: 1;
                    text-align: right;
                }
            }

            &__button {
            }
        }
    }
</style>
