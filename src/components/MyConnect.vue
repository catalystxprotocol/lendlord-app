<template>
    <MyPopover
        :show="globalStore.showMyWalletDialog"
        :show-close-btn="true"
        @close="myWalletPopoverClose"
    >
        <template #default>
            <div class="my_wallet_popover">
                <div class="my_wallet_popover__title"> Connect your wallet </div>
                <div class="my_wallet_popover__subtitle"> Ethereum Ecosystem </div>
                <div class="my_wallet_popover__wallet_box" @click="login">
                    <img
                        src="@/assets/image/metamask.png"
                        alt=""
                        class="my_wallet_popover__wallet_box__img"
                    />
                </div>
            </div>
        </template>
    </MyPopover>
</template>

<script setup lang="ts">
    import { useGlobalStore } from '@/store/modules/global';
    import { connectMetaMask } from '@/helper/metaMaskHelper';
    import { useToConnectedProfile } from '@/composables/index';

    const globalStore = useGlobalStore();

    const login = async () => {
        // 登陆metamask
        try {
            await connectMetaMask();
            useToConnectedProfile();
        } catch (error) {
            // 用户拒绝连接，只需要把弹窗关掉即可
        } finally {
            globalStore.showMyWalletDialog = false;
        }
    };

    const myWalletPopoverClose = () => {
        globalStore.showMyWalletDialog = false;
    };
</script>

<style lang="less" scoped>
    .my_wallet_popover {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 264px;
        padding: 48px 0;
        background: linear-gradient(180deg, #fff6ee 0%, #ffffff 100%);
        border-radius: 16px;
        box-shadow: 0 16px 20px 0 var(--bj-box-shadow-second);

        &__title {
            .text_font_bold;
        }

        &__subtitle {
            margin-top: 4px;
            color: var(--bj-text-normal);
            font-weight: 400;
            font-size: 14px;
            font-family: Inter-Regular, Inter;
            line-height: 18px;
            letter-spacing: -0.16px;
        }

        &__wallet_box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 160px;
            height: 128px;
            margin-top: 28px;
            background: var(--bj-background-color-third);
            border: 1px solid var(--bj-border-color);
            border-radius: 8px;
            cursor: pointer;

            &__img {
                width: 100px;
            }
        }

        &__wallet_box:hover {
            background: var(--bj-background-popover-light);
            border: 1px solid var(--bj-primary-color);
        }
    }
</style>
