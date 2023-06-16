<template>
    <div class="layout__footer">
        <div class="layout__footer__container">
            <div class="layout__footer__container__left">
                <div class="layout__footer__container__left__logo">
                    <img src="@/assets/image/copyright_logo.png" alt="" />
                </div>
                <div class="layout__footer__container__left__copyright">
                    Copyright © {{ new Date().getFullYear() }} LendLord. All Rights Reserved.
                </div>
            </div>
            <div class="layout__footer__container__right">
                <a
                    v-for="(item, idx) in friendshipLinkList"
                    :key="idx"
                    v-ga="{
                        gaEventName: `点击-社群icon${idx + 1}`,
                        params: {
                            link: item.link
                        }
                    }"
                    :href="item.link"
                    target="_blank"
                    class="layout__footer__container__right__iconbox"
                >
                    <i class="iconfont" :class="item.icon"></i>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { footerModule } from './composable';
    const { friendshipLinkList } = footerModule();
</script>

<style lang="less" scoped>
    .layout__footer {
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        width: 100%;
        height: 80px;
        background: var(--bj-background-color-second);

        &__container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 1200px;

            &__left {
                display: flex;
                align-items: center;

                &__logo {
                    img {
                        width: 36px;
                    }
                }

                &__copyright {
                    margin-left: 16px;
                    font-family: Inter-Regular, Inter;
                }
            }

            &__right {
                display: flex;

                &__iconbox {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: var(--bj-background-color-third);
                    border: 1px solid var(--bj-border-color);
                    border-radius: var(--border-radius-normal);
                    cursor: pointer;
                }

                &__iconbox:not(:first-child) {
                    margin-left: 8px;
                }

                &__iconbox:hover {
                    border: 1px solid var(--bj-primary-color);
                }

                a:link,
                a:visited,
                a:hover,
                a:active {
                    color: #000000;
                    text-decoration: none;
                }
            }
        }
    }
</style>
