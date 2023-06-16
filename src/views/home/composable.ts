import { computed } from 'vue';
import { getCollectionsCountAPI } from '@/api/home';
import { useGlobalStore } from '@/store/modules/global';
import { useRouter } from 'vue-router';
import { ROUTE_INFO } from '@/constants';

export const homeModule = () => {
    const globalStore = useGlobalStore();
    const router = useRouter();
    const collectionCount = ref<number>(0);
    const aboutLendlordList = ref([
        {
            title: 'Lenders',
            subtitle: 'Enjoy passive income while still have the potential of appreciation',
            icon: new URL('../../assets/image/Lenders.png', import.meta.url).href
        },
        {
            title: 'Renters',
            subtitle: 'Use NFT in a more cost efficient and flexible way',
            icon: new URL('../../assets/image/Renter.png', import.meta.url).href
        },
        {
            title: 'Projects',
            subtitle: 'Increase activity, using scenario as well as requirement of the project',
            icon: new URL('../../assets/image/Project.png', import.meta.url).href
        },
        {
            title: 'Chains',
            subtitle: 'Make it possible to attract communities and project to boost its ecology',
            icon: new URL('../../assets/image/Chains.png', import.meta.url).href
        }
    ]);

    const topCollectionsList = ref([
        {
            name: 'Doodles',
            image: new URL('../../assets/image/top_collection_test1.jpg', import.meta.url).href,
            headPicture: new URL('../../assets/image/header_pic_test1.jpg', import.meta.url).href
        },
        {
            name: 'Mutant Ape Yacht Club',
            image: new URL('../../assets/image/top_collection_test2.jpg', import.meta.url).href,
            headPicture: new URL('../../assets/image/header_pic_test2.jpg', import.meta.url).href
        },
        {
            name: 'Doodles',
            image: new URL('../../assets/image/top_collection_test3.jpg', import.meta.url).href,
            headPicture: new URL('../../assets/image/header_pic_test3.jpg', import.meta.url).href
        },
        {
            name: 'Doodles',
            image: new URL('../../assets/image/top_collection_test1.jpg', import.meta.url).href,
            headPicture: new URL('../../assets/image/header_pic_test1.jpg', import.meta.url).href
        }
    ]);

    const toMarketplace = () => {
        router.push({
            name: ROUTE_INFO.marketplace.name
        });
    };

    const swiperRef: any = ref(null);

    // 轮播展示数量
    const swiperViewCount = ref(3);
    const prev = () => {
        swiperRef.value?.$el.swiper.slidePrev();
    };

    const swiperActiveIndex = computed(() => {
        return swiperRef.value?.$el.swiper.activeIndex;
    });

    const next = () => {
        swiperRef.value?.$el.swiper.slideNext();
    };

    const getCollectionsCount = async () => {
        try {
            const { data } = await getCollectionsCountAPI();
            if (data) {
                collectionCount.value = data.total_sum;
            }
        } catch (e) {
            globalStore.show500 = true;
        }
    };

    onMounted(async () => {
        await getCollectionsCount();
    });

    return {
        aboutLendlordList,
        topCollectionsList,
        swiperRef,
        swiperActiveIndex,
        swiperViewCount,
        prev,
        next,
        collectionCount,
        toMarketplace
    };
};
