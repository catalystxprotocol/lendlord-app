import { getMarketplaceListAPI } from '@/api/marketplace';
import { useGlobalStore } from '@/store/modules/global';
import { moveDecimal } from '@/utils/calculate';
import router from '@/router';

export const useMarketplaceModule = () => {
    const globalStore = useGlobalStore();
    const chainSelectLoading = ref(true);
    const options = ref<any>([
        {
            label: 'All Chains',
            value: undefined,
            iconActive: '',
            icon: ''
        }
    ]);
    const chainSelect = ref();
    const total = ref<number | string>('--');

    watch(
        () => globalStore.chains,
        (val) => {
            console.log(val, 'val');
            initChainOption(val);
        }
    );

    const initChainOption = (val: any) => {
        chainSelectLoading.value = false;

        const initOption = [
            {
                label: 'All Chains',
                value: undefined,
                iconActive: '',
                icon: ''
            }
        ];
        const chainOption = val.map((item: any) => {
            return {
                label: '',
                value: item.chainId,
                iconActive: item.chainLogoUrl,
                icon: item.grayChainLogoUrl
            };
        });
        options.value = initOption.concat(chainOption);
    };

    const currentChain = ref(options.value[0]);

    // table
    const column = ref([
        {
            label: '',
            width: '40px',
            key: 'index'
        },
        {
            label: 'Name',
            width: '255px',
            key: 'name'
        },
        {
            label: 'Floor Price',
            width: '189px',
            key: 'floorPrice'
        },
        {
            label: 'Total Listed',
            width: '152px',
            key: 'totalListed'
        },
        {
            label: 'Available for rent',
            width: '186px',
            key: 'availableForRent'
        },
        {
            label: 'Supply',
            width: '237px',
            key: 'supply'
        }
    ]);
    const tableData = ref([]);
    const currentPage = ref(1);
    const totalPage = ref(10);
    const tableLoading = ref(true);
    const skeletonCount = ref(10);
    const isFirstLoad = ref(true);

    const loadTableData = async () => {
        if (!isFirstLoad.value && tableLoading.value) return; // 除第一次加载外处于loading状态下不再重新触发load
        if (!isFirstLoad.value) skeletonCount.value = 5; // 初次加载骨架屏和后续加载骨架屏数量不一致
        if (currentPage.value < totalPage.value) {
            try {
                tableLoading.value = true;
                const param = {
                    chain_id: currentChain.value.value,
                    page_size: isFirstLoad ? 100 : 10,
                    page_number: currentPage.value
                };
                const res = await getMarketplaceListAPI(param);
                if (res?.data) {
                    const resList: any = res.data.list.map((item, key) => {
                        return {
                            index: key + 1,
                            name: item.collection_name,
                            icon: item.collection_image,
                            floorPrice:
                                item.floor_price !== ''
                                    ? `${moveDecimal(
                                          item.floor_price,
                                          (item.payment_token_info.decimals as any) * -1
                                      )} ${item.payment_token_info.symbol}/Days`
                                    : '--',
                            totalListed: item.total_listed,
                            availableForRent: item.available_for_rent,
                            supply: item.supply,
                            collectionId: item.collection_id
                        };
                    });

                    total.value = res.data.page_info.total_record_count;
                    tableLoading.value = false;
                    isFirstLoad.value = false;
                    totalPage.value = res.data.page_info.total_page_count;
                    currentPage.value++;
                    Array.prototype.push.apply(tableData.value, resList);
                }
            } catch (e) {
                if (isFirstLoad.value) {
                    globalStore.show500 = true;
                }
            }
        }
    };

    const scrollBottom = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight) {
            if (tableLoading.value || tableData.value.length == 0) return; // 初次请求无数据状态不再加载数据
            loadTableData();
        }
    };

    watch(
        () => currentChain.value,
        () => {
            skeletonCount.value = 10;
            tableData.value = [];
            currentPage.value = 1;
            totalPage.value = 10;
            loadTableData();
        },
        {
            immediate: true
        }
    );

    onMounted(() => {
        window.addEventListener('scroll', scrollBottom);
        if (globalStore.chains) {
            initChainOption(globalStore.chains);
        }
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', scrollBottom);
    });

    const toComingSoon = () => {
        router.push('/comingSoon');
    };

    return {
        chainSelectLoading,
        options,
        currentChain,
        column,
        tableData,
        currentPage,
        totalPage,
        tableLoading,
        skeletonCount,
        chainSelect,
        total,
        toComingSoon
    };
};
