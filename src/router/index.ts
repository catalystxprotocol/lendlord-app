import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';
import waterfallLayout from '@/layout/waterfallLayout.vue';
import { createInterceptor } from './interceptor';
import { ROUTE_INFO } from '@/constants';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.home.name,
                component: () => import('../views/home/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/marketplace',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.marketplace.name,
                component: () => import('../views/marketplace/index.vue'),
                meta: {
                    isNoFooter: true
                }
            }
        ]
    },
    {
        path: '/collection/:collectionId',
        component: waterfallLayout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.collectionDetails.name,
                component: () => import('../views/collectionDetails/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/profile/:address',
        component: waterfallLayout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.profile.name,
                component: () => import('../views/profile/index.vue'),
                meta: {
                    noHeaderLine: true
                }
            }
        ]
    },
    {
        path: '/lend/:nftId',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.lend.name,
                component: () => import('../views/lend/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/itemDetails/:nftId',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.itemDetails.name,
                component: () => import('../views/itemDetails/index.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/search/collection/:collectionName',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.searchCollectionName.name,
                component: () => import('../views/search/collectionName.vue'),
                meta: {
                    isNoFooter: true
                }
            }
        ]
    },
    {
        path: '/noResult/collectionId/:collectionId/tokenId/:tokenId',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.collectionIdAndTokenIdNoResult.name,
                component: () => import('../views/noResult/collectionIdAndTokenId.vue'),
                meta: {}
            }
        ]
    },
    {
        path: '/comingSoon',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO.comingSoon.name,
                component: () => import('../views/ComingSoonPage.vue'),
                meta: {
                    noHeaderLine: true
                }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: Layout,
        meta: {},
        children: [
            {
                path: '',
                name: ROUTE_INFO[404].name,
                component: () => import('../views/404.vue'),
                meta: {
                    noHeaderLine: true
                }
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory('/'),
    scrollBehavior() {
        return { left: 0, top: 0 };
    },
    routes
});

createInterceptor(router);

export default router;
