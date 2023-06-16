import { HTTP_CODE } from '@/constants/apiCode';
import { AxiosError, isAxiosError, isAxiosCancel } from '@/utils/axios';
import { useGlobalStore } from '@/store/modules/global';
import { initMetaMask } from '@/helper/metaMaskHelper';
import router from '@/router/index';

export const useChangeTitleAndIcon = () => {
    const link: HTMLLinkElement =
        document.querySelector('link[rel *= "icon"]') || document.createElement('link');
    const title: HTMLTitleElement =
        document.querySelector('title') || document.createElement('title');
    link.rel = 'icon';
    link.href = import.meta.env.VITE_FAVICON;
    title.innerHTML = import.meta.env.VITE_TITLE;
    document.getElementsByTagName('head')[0].appendChild(link);
    document.getElementsByTagName('head')[0].appendChild(title);
};

export const useToConnectedProfile = (isReplace = false) => {
    const globalStore = useGlobalStore();
    if (globalStore.account) {
        const profileUrl = `/profile/${globalStore.account}`;
        if (isReplace) {
            router.replace(profileUrl);
        } else {
            router.push(profileUrl);
        }
    }
};

export const initApp = async () => {
    useChangeTitleAndIcon();
    const globalStore = useGlobalStore();
    await globalStore.initStateAction();
    initMetaMask();
};

export const handle404 = (error: any, callback?: Function) => {
    const globalStore = useGlobalStore();
    if (isAxiosError(error)) {
        if ((error as AxiosError).response?.status === HTTP_CODE.NOT_FOUND) {
            callback ? callback() : router.replace('/404');
        } else if (isAxiosCancel(error)) {
            console.log('cancel api', error);
        } else {
            globalStore.show500 = true;
        }
    } else {
        globalStore.show500 = true;
    }
};
