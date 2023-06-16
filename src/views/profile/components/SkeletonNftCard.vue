<template>
    <div class="nft_card">
        <MySkeleton class="nft_card__image" />
        <div class="nft_card__content">
            <MySkeleton class="nft_card__content__token_id" />
            <MySkeleton class="nft_card__content__collection_name" />
            <div class="nft_card__content__date">
                <MySkeleton class="nft_card__content__date__label" />
                <MySkeleton class="nft_card__content__date__value" />
            </div>
            <MySkeleton class="nft_card__content__button" />
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
    .nft_card {
        width: 284px;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: var(--bj-box-shadow-card);

        &__image {
            width: 100%;
            height: 272px;
            // background: var(--bj-background-color-fourth);
            border-radius: 16px 16px 0 0;
        }

        &__content {
            display: flex;
            flex-direction: column;
            padding: 12px 16px 16px;

            &__token_id {
                width: 150px;
                height: 28px;
                margin-bottom: 4px;
                // background: var(--bj-background-color-third);
                border-radius: 14px;
            }

            &__collection_name {
                width: 110px;
                height: 18px;
                margin-bottom: 12px;
                // background: var(--bj-background-color-third);
                border-radius: 9px;
            }

            &__date {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;

                &__label {
                    width: 90px;
                    height: 18px;
                    margin-right: 10px;
                    // background: var(--bj-background-color-third);
                    border-radius: 9px;
                }

                &__value {
                    width: 110px;
                    height: 18px;
                    // background: var(--bj-background-color-third);
                    border-radius: 9px;
                }
            }

            &__button {
                width: 252px;
                height: 40px;
                background: var(--bj-background-color-fifth);
                border-radius: 8px;
            }
        }
    }
</style>
