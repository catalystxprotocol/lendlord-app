<template>
    <div class="skeletion_collection_nft_card">
        <MySkeleton class="skeletion_collection_nft_card__image" />
        <div class="skeletion_collection_nft_card__content">
            <MySkeleton class="skeletion_collection_nft_card__content__token_id" />
            <MySkeleton class="skeletion_collection_nft_card__content__date" />
            <MySkeleton class="skeletion_collection_nft_card__content__button" />
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
    .skeletion_collection_nft_card {
        box-sizing: border-box;
        width: 100%;
        background: #ffffff;
        border: 2px solid var(--bj-background-color);
        border-radius: 16px;
        box-shadow: var(--bj-box-shadow-card);

        &__image {
            width: 100%;
            height: 228px;
            // skeletion 实现已更改，设计background 会导致动画失效
            // background: var(--bj-background-color-fourth);
            border-radius: 16px 16px 0 0;
        }

        &__content {
            display: flex;
            flex-direction: column;
            padding: 11px 12px 12px;

            &__token_id {
                width: 120px;
                height: 22px;
                margin-bottom: 8px;
                // background: var(--bj-background-color-third);
                border-radius: 14px;
            }

            &__date {
                width: 88px;
                height: 14px;
                margin-bottom: 12px;
                // background: var(--bj-background-color-third);
                border-radius: 9px;
            }

            &__button {
                width: 100%;
                height: 32px;
                // background: var(--bj-background-color-fifth);
                border-radius: 8px;
            }
        }
    }
</style>
