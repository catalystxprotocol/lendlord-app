<template>
    <el-config-provider :locale="locale">
        <div class="layout">
            <div class="layout__header_box">
                <Header></Header>
            </div>
            <div class="layout__content">
                <div v-show="!globalStore.show500" class="layout__content__router_container">
                    <router-view />
                </div>
                <div v-show="globalStore.show500" class="layout__content__error_container">
                    <ServerError></ServerError>
                </div>
            </div>
            <Footer v-if="!route.meta.isNoFooter" class="layout__footer"></Footer>
        </div>
    </el-config-provider>
</template>

<script setup lang="ts">
    import Header from '@/components/Header/index.vue';
    import Footer from '@/components/Footer/index.vue';
    import { useGlobalStore } from '@/store/modules/global';
    import { useLayout } from './composable';
    import ServerError from '@/components/ServerError.vue';
    // import { MyToast } from '@/utils/toast';
    // import { toastStatusEnum } from '@/constants/index';
    const globalStore = useGlobalStore();
    const { locale } = useLayout();
    const route = useRoute();

    onMounted(() => {
        // toast 用法示例
        // MyToast.submitResult(toastStatusEnum.success, '', 'https:www.baidu.com');
        // MyToast.submitResult(
        //     toastStatusEnum.warning,
        //     'App network doesn’t match to network selected in wallet'
        // );
        // MyToast.submitResult(toastStatusEnum.failed);
        // MyToast.submitResult(toastStatusEnum.processing);
        // MyToast.submitResult(toastStatusEnum.failed, 'Sign Denied');
    });
</script>

<style lang="less" scoped>
    .layout {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: 100%;
        background-color: var(--bj-background-color);

        &__header_box {
            width: 100%;
            min-height: 100px;
        }

        &__content {
            display: flex;
            flex: 1;

            &__router_container {
                flex: 1;
            }

            &__error_container {
                flex: 1;
            }
        }

        &__footer {
        }
    }
</style>
