import { isAxiosCancel } from '@/utils/axios';
import type { TabsPaneContext } from 'element-plus';
import { getUserCollectionListAPI, getNftListAPI } from '@/api/profile';
import { useGlobalStore } from '@/store/modules/global';
import { statusOptions } from '@/constants/profile';
import {
    DropdownOptionItem,
    IRequestNftList,
    NftStatus,
    NftCardItem
} from '@/types/interface/profile.interface';
import { moveDecimal } from '@/utils/calculate';
import { dayjsFormatDateToDay } from '@/utils/time';
import { DEFAULT_DISPLAY_TEXT, LEASE_EXPIRES_TEXT, ROUTE_INFO } from '@/constants';

export const useProfile = () => {
    const globalStore = useGlobalStore();
    const pageSize = 20;
    // 定义变量
    const route = useRoute();
    const router = useRouter();
    const collectionOptions = ref<DropdownOptionItem[]>([
        {
            label: 'All Collections',
            value: ''
        }
    ]);
    const nftQueryData: IRequestNftList = reactive({
        address: '',
        status: '',
        collection_id: '',
        page_number: 1,
        page_size: pageSize
    });
    const nftTotal = ref<string | number>(DEFAULT_DISPLAY_TEXT);
    const isCancelLoad = ref(false); // 是否取消加载更多列表数据
    const nftList = ref<NftCardItem[]>([]);
    const isLoading = ref(true);
    const isFailed = ref(false);

    const getUserCollectionList = async (
        address: string
    ): Promise<DropdownOptionItem[] | undefined> => {
        try {
            const { data } = await getUserCollectionListAPI(address);
            if (data) {
                data.list = data.list.filter((item) => item.name);
            }
            return data?.list.map((item) => {
                return { label: item.name, value: item.id };
            });
        } catch (error) {
            console.log(error);
            // 页面基础数据未获取到，展示500
            globalStore.show500 = true;
        }
    };

    const getNftList = async (params: IRequestNftList): Promise<NftCardItem[] | undefined> => {
        isLoading.value = true;
        isFailed.value = false;
        try {
            const { data } = await getNftListAPI(params);
            let result;
            if (data) {
                nftTotal.value = data.page_info.total_record_count;
                if (data.list && data.list.length > 0) {
                    // data.list = data.list
                    //     .concat(data.list)
                    //     .concat(data.list)
                    //     .concat(data.list)
                    //     .concat(data.list)
                    //     .concat(data.list);
                    result = data.list.map((item) => {
                        const formatRes = {
                            nftId: item.nft_id,
                            imageUrl: item.nft_image,
                            tokenId: item.nft_token_id,
                            collectionName: item.collection_name,
                            dateLabel: '',
                            dateValue: '',
                            buttonText: '',
                            isGhostButton: false,
                            disableButton: false,
                            buttonClickFn: () => {},
                            isMask: false,
                            maskFirstText: '',
                            maskSecondText: ''
                        };
                        switch (item.nft_status) {
                            case NftStatus.idle:
                                formatRes.buttonText = 'Lend';
                                formatRes.buttonClickFn = () => {
                                    goLendPage(item.nft_id);
                                };
                                break;
                            case NftStatus.listed:
                                formatRes.dateLabel = 'End of';
                                formatRes.dateValue = dayjsFormatDateToDay(
                                    item.lend_end_timestamp * 1000
                                );
                                const formatPrice = moveDecimal(
                                    item.lender_price,
                                    -item.payment_token_info.decimals
                                );
                                formatRes.buttonText = `${formatPrice} ${item.payment_token_info.symbol}/Day`;
                                formatRes.isGhostButton = true;
                                formatRes.buttonClickFn = () => {
                                    goItemDetails(item.nft_id);
                                };
                                break;
                            case NftStatus.listedAndDeal:
                                formatRes.dateLabel = 'End of';
                                formatRes.dateValue = dayjsFormatDateToDay(
                                    item.lend_end_timestamp * 1000
                                );
                                const formatPrice2 = moveDecimal(
                                    item.lender_price,
                                    -item.payment_token_info.decimals
                                );
                                formatRes.buttonText = `${formatPrice2} ${item.payment_token_info.symbol}/Day`;
                                formatRes.isGhostButton = true;
                                formatRes.isMask = true;
                                formatRes.maskFirstText = LEASE_EXPIRES_TEXT;
                                formatRes.maskSecondText = dayjsFormatDateToDay(
                                    item.end_timestamp * 1000
                                );
                                formatRes.buttonClickFn = () => {
                                    goItemDetails(item.nft_id);
                                };
                                break;
                            case NftStatus.rented:
                                formatRes.dateLabel = 'Expires in';
                                formatRes.dateValue = dayjsFormatDateToDay(
                                    item.end_timestamp * 1000
                                );
                                formatRes.buttonText = 'Use';
                                formatRes.isGhostButton = false;
                                formatRes.disableButton = !item.use_link;
                                formatRes.buttonClickFn = () => {
                                    item.use_link && window.open(item.use_link);
                                };
                                break;
                        }
                        return formatRes;
                    });
                } else {
                    result = [];
                }
            } else {
                // 只有没有数据的时候，才会返回null,否则即使list 无数据，page_info 也会有数据返回的
                nftTotal.value = 0;
            }
            isLoading.value = false;
            return result;
        } catch (error) {
            if (!isAxiosCancel(error)) {
                isLoading.value = false;
                isFailed.value = true;
                console.log(error);
            } else {
                throw error;
            }
        }
    };

    // 解析url
    const parseUrl = async () => {
        nftQueryData.address = route.params.address as string;
        const { status: statusFormUrl, collectionId: collectionIdFormUrl } = route.query;
        collectionOptions.value = [
            {
                label: 'All Collections',
                value: ''
            }
        ];
        collectionOptions.value.push(
            ...((await getUserCollectionList(nftQueryData.address)) || [])
        );
        let statusUrl = '';
        let collectionIdUrl = '';
        if (statusFormUrl) {
            if (statusOptions.find((item) => item.value === statusFormUrl)) {
                nftQueryData.status = statusFormUrl as string;
                statusUrl = statusFormUrl as string;
            } else {
                statusUrl = '';
                nftQueryData.status = '';
            }
        } else {
            nftQueryData.status = '';
        }
        if (collectionIdFormUrl) {
            if (collectionOptions.value.find((item) => item.value === collectionIdFormUrl)) {
                nftQueryData.collection_id = collectionIdFormUrl as string;
                collectionIdUrl = collectionIdFormUrl as string;
            } else {
                collectionIdUrl = '';
                nftQueryData.collection_id = '';
            }
        } else {
            nftQueryData.collection_id = '';
        }
        handUrl(nftQueryData.address, statusUrl, collectionIdUrl);
    };

    const loginOut = () => {
        // 退出登陆
        globalStore.logout();
    };

    const activeName = ref('item');
    // 切换tab事件
    const handleClick = (tab: TabsPaneContext, event: Event) => {
        console.log('switch tab', tab, event);
    };

    const loadMoreNftList = async () => {
        isCancelLoad.value = true;
        try {
            const res = await getNftList(nftQueryData);
            isCancelLoad.value = false;
            if (res && res.length > 0) {
                if (nftQueryData.page_number === 1) {
                    nftList.value = res;
                } else {
                    nftList.value = nftList.value.concat(res);
                }
                if (res.length < nftQueryData.page_size!) {
                    // 返回数据数量不足时，取消后续加载请求
                    isCancelLoad.value = true;
                } else {
                    // 否则页数加1
                    nftQueryData.page_number!++;
                }
            } else if (!res?.length && nftQueryData.page_number !== 1) {
                // 如果上次数量刚好是page_size 而此次又刚好是空
                isCancelLoad.value = true;
            } else {
                nftList.value = [];
                isCancelLoad.value = true;
            }
        } catch (error) {
            if (isAxiosCancel(error)) {
                console.log('cancel profile nft list api');
            }
        }
    };

    let manualChangeUrl = false;
    const handUrl = (address: string, status?: string, collectionId?: string) => {
        let replaceUrl = `/profile/${address}`;
        if (status) {
            replaceUrl += `?status=${status}`;
        }
        if (collectionId) {
            replaceUrl += `${status ? '&' : '?'}collectionId=${collectionId}`;
        }
        // console.log(replaceUrl, route.fullPath);
        if (replaceUrl !== route.fullPath) {
            manualChangeUrl = true;
            router.replace(replaceUrl);
        }
    };

    const reloadFromFirstNumFn = () => {
        nftTotal.value = DEFAULT_DISPLAY_TEXT;
        nftQueryData.page_number = 1;
        nftList.value = [];
        loadMoreNftList();
    };

    const onSelectedStatus = (value: string): void => {
        console.log('onSelectedStatus', value);
        if (value !== nftQueryData.status) {
            nftQueryData.status = value;
            const { collectionId: collectionIdFormUrl } = route.query;
            handUrl(nftQueryData.address, value, collectionIdFormUrl as string | undefined);
        }
        reloadFromFirstNumFn();
    };

    const onSelectedCollectionId = (value: string): void => {
        console.log('onSelectedCollectionId', value);
        if (value !== nftQueryData.collection_id) {
            nftQueryData.collection_id = value;
            const { status: statusFormUrl } = route.query;
            handUrl(nftQueryData.address, statusFormUrl as string | undefined, value);
        }
        reloadFromFirstNumFn();
    };

    const isNoData = computed(() => {
        return nftList.value.length <= 0 && !isLoading.value && !isFailed.value;
    });

    const initNftQueryData = () => {
        nftQueryData.address = '';
        nftQueryData.status = '';
        nftQueryData.collection_id = '';
        nftQueryData.page_number = 1;
        nftQueryData.page_size = pageSize;
    };

    const initData = async () => {
        initNftQueryData();
        isLoading.value = true;
        nftList.value = [];
        await parseUrl();
        await loadMoreNftList();
    };

    onMounted(async () => {
        await initData();
    });

    const goItemDetails = (nftId: number) => {
        router.push(`/itemDetails/${nftId}`);
    };

    const goLendPage = (nftId: number) => {
        const lendUrl = `/lend/${nftId}`;
        router.push(lendUrl);
    };

    watch(route, async (newVal) => {
        if (manualChangeUrl) {
            manualChangeUrl = false;
            return;
        }
        if (newVal.name === ROUTE_INFO.profile.name) {
            await initData();
        }
    });

    return {
        nftQueryData,
        loginOut,
        activeName,
        handleClick,
        nftTotal,
        statusOptions,
        onSelectedStatus,
        collectionOptions,
        onSelectedCollectionId,
        loadMoreNftList,
        isCancelLoad,
        isNoData,
        nftList,
        isLoading,
        isFailed,
        goItemDetails,
        pageSize
    };
};
