import { Router } from 'vue-router';
import { useNProgress } from '@/utils/NProgress';
import { ROUTE_INFO } from '@/constants';
import { useGlobalStore } from '@/store/modules/global';

export function createInterceptor(router: Router) {
    const nprogress = useNProgress();
    nprogress.init();

    // let startTime = Date.now();
    // let currentTime = null;

    const routeNameMap = new Map();
    Object.values(ROUTE_INFO).forEach((item) => {
        routeNameMap.set(item.name, item);
    });

    router.beforeEach((to, from, next) => {
        nprogress.start();
        const globalStore = useGlobalStore();
        globalStore.show500 = false;
        if (routeNameMap.has(to.name)) {
            const routeInfo = routeNameMap.get(to.name);
            if (routeInfo) {
                document.title = routeInfo.title;
                document
                    .querySelector('meta[name="description"]')
                    ?.setAttribute('content', routeInfo.description);
            }
        }
        if (to && routeNameMap.has(from.name)) {
            // currentTime = Date.now();
            // (window as any).gtag('event', `${from.name as string}页面停留`, {
            //     time: Math.floor((currentTime - startTime) / 1000) + '秒'
            // });
        }
        // startTime = Date.now();
        next();
    });

    router.afterEach(() => {
        nprogress.done();
    });
}
