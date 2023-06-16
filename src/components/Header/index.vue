<template>
    <div class="layout__header" :class="isOpcity ? '' : 'layout__header_bgColor'">
        <div
            class="layout__header__container"
            :class="
                route.meta.noHeaderLine || globalStore.show500
                    ? ''
                    : 'layout__header__container_line'
            "
        >
            <div
                v-ga="'点击-产品icon/产品名称'"
                class="layout__header__container__logo"
                @click="toHome"
            >
                <img :src="logo" alt="" class="layout__header__container__logo__logo" />
            </div>
            <div class="layout__header__container__menu">
                <div
                    v-for="(item, idx) in menu"
                    :key="idx"
                    class="layout__header__container__menu__item"
                >
                    <div
                        :class="
                            item.children.has(String(route.name))
                                ? 'layout__header__container__menu__item__a__active'
                                : ''
                        "
                        class="layout__header__container__menu__item__a"
                        @click="routerTo(item.name)"
                        >{{ item.tabName }}</div
                    >
                </div>
            </div>
            <div class="layout__header__container__search">
                <el-input
                    ref="searchInput"
                    v-model="searchContent"
                    class="layout__header__container__search__input"
                    placeholder="Search by collections"
                    @keydown.enter="search"
                >
                </el-input>
                <div class="layout__header__container__search__btn">
                    <div class="layout__header__container__search__btn__line"></div>
                    <div class="layout__header__container__search__btn__icon">
                        <i class="iconfont icon-sousuo" @click="search"></i>
                    </div>
                </div>
            </div>
            <div class="layout__header__container__chain">
                <el-dropdown
                    popper-class="chain_menu"
                    trigger="click"
                    :disabled="globalStore.isLoadingChainConfig || globalStore.isErrorChainConfig"
                    @visible-change="dropdownChange"
                >
                    <div
                        v-if="globalStore.isLoadingChainConfig"
                        class="layout__header__container__chain__box layout__header__container__chain__box_cursor_auto"
                    >
                        <div class="layout__header__container__chain__box__loading_box">
                            <my-loading width="28px" height="28px"></my-loading>
                        </div>
                    </div>
                    <div
                        v-else-if="globalStore.isErrorChainConfig"
                        class="layout__header__container__chain__box layout__header__container__chain__box_cursor_auto"
                    >
                        <div class="layout__header__container__chain__box__error_box"> </div>
                        <div>--</div>
                    </div>
                    <div
                        v-else
                        class="layout__header__container__chain__box layout__header__container__chain__box__hover"
                        :class="chainIsLight ? 'layout__header__container__chain__box__light' : ''"
                    >
                        <img
                            :src="globalStore.currentChainInfoGetter?.chainLogoUrl"
                            class="layout__header__container__chain__box__icon"
                            alt=""
                        />
                        <div class="layout__header__container__chain__box__chain_name">{{
                            globalStore.currentChainInfoGetter?.chainName
                        }}</div>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="(item, key) in globalStore.chains" :key="key">
                                <div class="dropdown-menu__item" @click="checkChain(item)">
                                    <img :src="item.chainLogoUrl" alt="" class="chain_icon" />
                                    <MenuItemText
                                        :expansion="chainIsLight"
                                        :chain-name="item.chainName"
                                        :active="globalStore.chainId === item.chainId"
                                    ></MenuItemText>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="layout__header__container__wallet">
                <el-dropdown
                    popper-class="wallet_menu"
                    trigger="hover"
                    :disabled="!globalStore.isConnect"
                    placement="bottom-end"
                >
                    <div
                        v-ga="'点击-钱包icon'"
                        class="layout__header__container__wallet__box"
                        @click="walletClickFn"
                    >
                        <i class="iconfont icon-qianbao"></i>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                <div class="dropdown-menu__item" @click="profile">
                                    <div class="menu_icon_box">
                                        <i class="iconfont icon-profile"></i>
                                    </div>
                                    <span class="menu_text"> Profile </span>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <div class="dropdown-menu__item" @click="logFn">
                                    <div class="menu_icon_box">
                                        <i
                                            class="iconfont"
                                            :class="[
                                                globalStore.isConnect ? 'icon-tuichu' : 'icon-black'
                                            ]"
                                        ></i>
                                    </div>
                                    <span class="menu_text"
                                        >{{ globalStore.isConnect ? 'Log out' : 'Log in' }}
                                    </span>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
    <MyConnect />
</template>

<script setup lang="ts">
    import logo from '@/assets/image/logo.png';
    import { useHeaderModule } from '@/components/Header/composable';
    import { useGlobalStore } from '@/store/modules/global';
    import MyLoading from '@/components/MyLoading.vue';
    import MenuItemText from '@/views/home/components/MenuItemText.vue';

    const globalStore = useGlobalStore();
    const route = useRoute();

    const {
        toHome,
        menu,
        searchContent,
        search,
        chainIsLight,
        dropdownChange,
        checkChain,
        profile,
        logFn,
        isOpcity,
        walletClickFn,
        routerTo,
        searchInput
    } = useHeaderModule();
</script>

<style lang="less" scoped>
    .layout__header {
        position: fixed;
        z-index: 100;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        width: 100%;
        height: 100px;
        background: rgba(255, 255, 255, 0); // 透明
        &__container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 1200px;
            height: 100%;

            &__logo {
                position: absolute;
                left: 0;
                box-sizing: border-box;
                width: 208px;
                cursor: pointer;

                &__logo {
                    width: 100%;
                }
            }

            &__menu {
                display: flex;
                margin-left: 454px;

                &__item {
                    position: relative;
                    display: flex;
                    cursor: pointer;

                    &__a {
                        color: var(--bj-text-second);
                        font-weight: 400;
                        font-size: 14px;
                        font-family: Inter-Regular, Inter;
                        line-height: 18px;
                    }

                    &__a:hover {
                        color: var(--bj-text-title);
                    }

                    &__a__active {
                        .small_text_font_bold;

                        letter-spacing: 0;
                    }

                    &__a__active::after {
                        position: absolute;
                        left: 50%;
                        display: block;
                        width: 16px;
                        height: 4px;
                        margin-top: 12px;
                        margin-left: -8px;
                        background: var(--bj-primary-color);
                        border-radius: 2px;
                        content: '';
                    }

                    a:link,
                    a:visited,
                    a:hover,
                    a:active {
                        text-decoration: none;
                    }
                }

                &__item:not(:first-child) {
                    margin-left: 60px;
                }
            }

            &__search {
                position: relative;
                margin-left: 60px;

                &__input {
                    width: 242px;
                    height: 40px;
                    border: none;

                    ::v-deep(.el-input__wrapper) {
                        padding-right: 50px;
                        background: var(--bj-background-color-third);
                        border: 1px solid var(--bj-border-color);
                        border-radius: 20px;
                        box-shadow: none;

                        input::input-placeholder {
                            /* WebKit browsers */
                            color: rgba(0, 0, 0, 0.5);
                            font-weight: 400;
                            font-size: 14px;
                            font-family: Inter-Regular, Inter;
                            line-height: 18px;
                        }
                    }

                    ::v-deep(.el-input__wrapper.is-focus),
                    ::v-deep(.el-input__wrapper:hover) {
                        background: var(--bj-background-popover-light) !important;
                        border: 1px solid var(--bj-primary-color) !important;
                        box-shadow: none;
                    }
                }

                &__btn {
                    position: absolute;
                    top: 0;
                    right: 0;
                    display: flex;
                    align-items: center;
                    height: 40px;

                    &__line {
                        width: 1px;
                        height: 20px;
                        background: rgba(0, 0, 0, 0.1);
                    }

                    &__icon {
                        margin: 0 16px 0 7px;

                        .iconfont {
                            color: var(--bj-primary-color);
                            font-size: 20px;
                        }
                    }
                }
            }

            &__chain {
                margin-left: 16px;

                &__box {
                    display: flex;
                    align-items: center;
                    min-width: 150px;
                    max-width: 176px;
                    height: 40px;
                    background: var(--bj-background-color-third);
                    border: 1px solid var(--bj-border-color);
                    border-radius: 20px;
                    cursor: pointer;

                    &__loading_box,
                    &__error_box {
                        width: 28px;
                        height: 28px;
                        margin: 0 8px;
                        border-radius: 50%;
                    }

                    &__loading_box {
                        ::v-deep(.chase-item)::before {
                            background-color: var(--bj-disable-color) !important;
                        }
                    }

                    &__error_box {
                        background: var(--bj-text-fifth);
                    }

                    &__icon {
                        width: 28px;
                        margin: 0 8px;
                    }

                    &__chain_name {
                        .text_ellipsis;

                        max-width: 120px;
                    }
                }

                &__box_cursor_auto {
                    cursor: auto;
                }

                &__box__hover:hover,
                &__box__light {
                    background: var(--bj-background-popover-light);
                    border: 1px solid var(--bj-primary-color);
                }
            }

            &__wallet {
                margin-left: 16px;

                &__box {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    width: 40px;
                    height: 40px;
                    background: var(--bj-primary-color);
                    border-radius: 50%;
                    cursor: pointer;

                    .iconfont {
                        color: #ffffff;
                        font-size: 20px;
                    }
                }

                &__box:hover {
                    background: var(--bj-hover-color);
                    border: 3px solid var(--bj-background-button-light);
                }
            }
        }

        &__container_line {
            border-bottom: 1px solid var(--bj-border-color);
        }
    }

    .layout__header_bgColor {
        background: var(--bj-background-color) !important;
    }

    .chain_menu {
        .el-dropdown-menu {
            padding: 0;
            border-radius: 8px !important;

            ::v-deep(.el-dropdown-menu__item) {
                padding: 0;

                .dropdown-menu__item {
                    display: flex;
                    align-items: center;
                    box-sizing: border-box;
                    min-width: 150px;
                    max-width: 300px;
                    height: 36px;
                    padding-right: 16px;

                    &__text_box {
                        flex-grow: 1;
                        max-width: 150px;
                    }

                    .chain_icon {
                        width: 20px;
                        margin: 0 8px 0 16px;
                    }
                }
            }

            ::v-deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
                background-color: var(--bj-background-color-third);
            }
        }
    }

    .wallet_menu {
        .el-dropdown-menu {
            padding: 0;
            border-radius: 8px !important;

            ::v-deep(.el-dropdown-menu__item) {
                padding: 0;

                .dropdown-menu__item {
                    display: flex;
                    align-items: center;
                    width: 132px;
                    height: 34px;

                    .menu_icon_box {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 24px;
                        height: 24px;
                        margin: 0 8px 0 16px;
                        background: var(--bj-background-color-fourth);
                        border-radius: 50%;

                        .iconfont {
                            margin-right: 0 !important;
                            color: #000000;
                            font-size: 12px;
                        }
                    }

                    .menu_text {
                        color: var(--bj-text-normal);
                    }
                }

                .dropdown-menu__item:hover {
                    background: var(--bj-background-color-third);
                }
            }

            ::v-deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
                background-color: var(--bj-background-color-third);
            }
        }
    }
</style>
