import { switchOrAddChainToMetaMask, getIsInstallMetaMask } from '@/helper/metaMaskHelper';
import { decimalismToHex } from '@/utils/decimalSystem';
import { useToConnectedProfile } from '@/composables/index';
import { ROUTE_INFO } from '@/constants/index';

import type { IChainInfo } from '@/types/interface/index.interface';
import { useGlobalStore } from '@/store/modules/global';

export const useHeaderModule = () => {
    const globalStore = useGlobalStore();
    const router = useRouter();
    const toHome = () => {
        router.push('/');
    };

    // header 菜单
    const menu = ref([
        {
            tabName: 'MARKETPLACE',
            name: ROUTE_INFO.marketplace.name,
            children: new Map([
                [ROUTE_INFO.marketplace.name, true],
                [ROUTE_INFO.collectionDetails.name, true]
            ])
        },
        {
            tabName: 'PROFILE',
            name: ROUTE_INFO.profile.name,
            children: new Map([
                [ROUTE_INFO.profile.name, true],
                [ROUTE_INFO.itemDetails.name, true],
                [ROUTE_INFO.lend.name, true],
                [ROUTE_INFO.searchCollectionName.name, true]
            ])
        }
    ]);

    const routerTo = (routerName: string) => {
        switch (routerName) {
            case ROUTE_INFO.marketplace.name:
                (window as any).gtag('event', '点击-Marketplace');
                console.log('点击-Marketplace');
                router.push({
                    name: routerName
                });
                break;
            case ROUTE_INFO.profile.name:
                (window as any).gtag('event', '点击-Profile');
                console.log('点击-Profile');
                isLoginOrProfile();
                break;
            default:
                router.push({
                    name: routerName
                });
                break;
        }
    };

    const searchContent = ref('');
    const searchInput = ref(null);
    const search = () => {
        if (!searchContent.value) return;
        (searchInput.value as any).blur();
        router.push(`/search/collection/${searchContent.value}`);
    };

    const chainIsLight = ref<boolean>(false);

    const dropdownChange = (flag: boolean) => {
        chainIsLight.value = flag;
    };

    const checkChain = async (item: IChainInfo) => {
        if (globalStore.chainId !== item.chainId) {
            // 用户从应用内部切换chain，埋点统计
            console.log('链切换埋点', item.chainId);
            (window as any).gtag('event', '链切换', {
                chainId: item.chainId
            });
            // metamask 也需要切换，切换且添加
            const hexadecimal = decimalismToHex(item.chainId);
            const chainInfo = globalStore.chainsMapGetter[item.chainId];
            if (await getIsInstallMetaMask()) {
                try {
                    await switchOrAddChainToMetaMask(hexadecimal, [chainInfo.addChainParameter]);
                    globalStore.chainId = item.chainId;
                } catch (error) {
                    console.log('切换链失败', error);
                }
            }
        }
    };

    const isLoginOrProfile = () => {
        if (globalStore.isConnect) {
            useToConnectedProfile();
        } else {
            globalStore.showMyWalletDialog = true;
        }
    };

    const profile = () => {
        // 点击钱包profile
        isLoginOrProfile();
    };

    const logFn = () => {
        if (globalStore.isConnect) {
            // 点击钱包logout
            globalStore.logout();
        } else {
            globalStore.showMyWalletDialog = true;
        }
    };

    const isOpcity = ref(true);

    const setHeaderStyle = () => {
        isOpcity.value = window.scrollY == 0;
    };

    onMounted(() => {
        window.addEventListener('scroll', setHeaderStyle);
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', setHeaderStyle);
    });

    const walletClickFn = () => {
        isLoginOrProfile();
    };

    return {
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
    };
};
