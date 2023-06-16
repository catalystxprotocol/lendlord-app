import { executeCancel, isAxiosCancel } from '@/utils/axios';
import { useGlobalStore } from '@/store/modules/global';
import { DEFAULT_DISPLAY_TEXT, LEASE_EXPIRES_TEXT } from '@/constants';
import { searchNftIdCancel, FiltersBtnStatus } from '@/constants/collectionDetails';
import { handle404 } from '@/composables';
import {
    dayjsFormatDateToMonth,
    dayjsFormatDateToDay,
    formatLastUpdated,
    formatTimestampInterval
} from '@/utils/time';
import { formatBigNumber, bigNumberMultiply, toPercentage, moveDecimal } from '@/utils/calculate';
import {
    getCollectionInfoAPI,
    getNftIdAPI,
    getCollectionNftListAPI,
    getCollectionActiveList
} from '@/api/collectionDetails';
import { ROUTE_INFO } from '@/constants';
import {
    PriceSupplyFnParams,
    RentalDurationParams,
    IRequestCollectionNftList,
    TabListItem,
    CollectionCardNftItem,
    NftDisplayStatus,
    IRequestCollectionActiveList,
    collectionActiveQueryStatus
} from '@/types/interface/collectionDetails.interface';
import { NftStatus } from '@/types/interface/profile.interface';
import { formatAddress } from '@/utils/string';
import { itemActivityEventEnum } from '@/constants/itemDetails';
import { getExplorerTxHashUrl } from '@/helper/baseHelper';
import { TabsPaneContext } from 'element-plus';

export const useCollectionInfo = () => {
    const route = useRoute();
    const globalStore = useGlobalStore();

    const loadingInfo = ref(true);
    const servieFee = ref();

    const collectionName = ref(DEFAULT_DISPLAY_TEXT);
    const collectionImage = ref('');
    const leftCollectionInfo = ref([
        {
            label: 'Created',
            value: DEFAULT_DISPLAY_TEXT
        },
        {
            label: 'Service Fee',
            value: DEFAULT_DISPLAY_TEXT
        },
        {
            label: 'Chain Name',
            value: DEFAULT_DISPLAY_TEXT
        }
    ]);

    const rightCollectionInfo = ref([
        {
            label: 'Floor Price',
            value: DEFAULT_DISPLAY_TEXT
        },
        {
            label: 'Total Listed',
            value: DEFAULT_DISPLAY_TEXT
        },
        {
            label: 'Available for rent',
            value: DEFAULT_DISPLAY_TEXT
        },
        {
            label: 'Supply',
            value: DEFAULT_DISPLAY_TEXT
        }
    ]);

    const iconInfo = ref([
        {
            key: 'officialWebsite',
            link: '',
            iconfont: 'icon-website',
            isIcon: true,
            iconImgUrl: ''
        },
        {
            key: 'discord',
            link: '',
            iconfont: 'icon-dis',
            isIcon: true,
            iconImgUrl: ''
        },
        {
            key: 'twitter',
            link: '',
            iconfont: 'icon-tuite',
            isIcon: true,
            iconImgUrl: ''
        },
        {
            key: 'explorer',
            link: '',
            iconfont: '',
            isIcon: false,
            iconImgUrl: ''
        }
    ]);

    const getCollectionInfo = async () => {
        loadingInfo.value = true;
        try {
            const { data } = await getCollectionInfoAPI(route.params.collectionId as string);
            if (data) {
                collectionName.value = data.collection_name;
                collectionImage.value = data.collection_image;
                leftCollectionInfo.value[0].value = dayjsFormatDateToMonth(data.timestamp * 1000);
                leftCollectionInfo.value[1].value = toPercentage(data.service_fee);
                leftCollectionInfo.value[2].value = data.chain_name;
                servieFee.value = data.service_fee;
                rightCollectionInfo.value[0].value =
                    data.floor_price !== ''
                        ? `${moveDecimal(data.floor_price, -data.payment_token_info.decimals)} ${
                              data.payment_token_info.symbol
                          }`
                        : DEFAULT_DISPLAY_TEXT;
                rightCollectionInfo.value[1].value = formatBigNumber(data.total_listed).toString();
                rightCollectionInfo.value[2].value = formatBigNumber(
                    data.available_for_rent
                ).toString();
                rightCollectionInfo.value[3].value = formatBigNumber(data.supply).toString();

                iconInfo.value[0].link = data.official_website;
                iconInfo.value[1].link = data.discord;
                iconInfo.value[2].link = data.twitter;
                iconInfo.value[3].link = data.chain_browser;
                iconInfo.value[3].iconImgUrl = data.chain_browser_icon;
            } else {
                globalStore.show500 = true;
            }
        } catch (error) {
            console.log(error);
            handle404(error);
        } finally {
            loadingInfo.value = false;
        }
    };

    return {
        loadingInfo,
        servieFee,
        collectionName,
        collectionImage,
        leftCollectionInfo,
        rightCollectionInfo,
        iconInfo,
        getCollectionInfo
    };
};

export const useSearchTokenId = () => {
    const route = useRoute();
    const router = useRouter();
    const searchLoading = ref(false);

    const cancelSearchTokenId = () => {
        executeCancel(searchNftIdCancel);
        searchLoading.value = false;
    };

    const searchTokenIdFn = async (searchTokenId: string) => {
        // console.log('searchFn', 'searchvalue:', searchTokenId);
        searchLoading.value = true;
        const noResultPageUrl = `/noResult/collectionId/${route.params.collectionId}/tokenId/${searchTokenId}`;
        try {
            const { data } = await getNftIdAPI(route.params.collectionId as string, searchTokenId);
            // console.log(data);
            if (data) {
                router.push(`/itemDetails/${data.nft_id}`);
            } else {
                router.push(noResultPageUrl);
            }
        } catch (error) {
            console.log(error);
            handle404(error, () => {
                router.push(
                    `/noResult/collectionId/${route.params.collectionId}/tokenId/${searchTokenId}`
                );
            });
        } finally {
            searchLoading.value = false;
        }
    };

    return {
        searchTokenIdFn,
        cancelSearchTokenId,
        searchLoading
    };
};

export const useCollectionItemList = (cancelSearchTokenId: Function) => {
    const itemPageSize = 20;
    const router = useRouter();
    const route = useRoute();
    const nftTotal = ref<string | number>(DEFAULT_DISPLAY_TEXT);
    const loadingItemList = ref(false);
    const isFailedList = ref(false);
    const loadingItemFilter = ref(true);
    const nftList = ref<CollectionCardNftItem[]>([]);
    const nftQueryData: IRequestCollectionNftList = reactive({
        collection_id: route.params.collectionId as string,
        status: undefined,
        token_symbol: undefined,
        min_price: undefined,
        max_price: undefined,
        min_duration: undefined,
        max_duration: undefined,
        page_number: 1,
        page_size: itemPageSize
    });
    const isCancelLoad = ref(false);

    const isItemNoData = computed(() => {
        return nftList.value.length <= 0 && !loadingItemList.value && !isFailedList.value;
    });
    const goItemDetails = (nftId: string) => {
        router.push(`/itemDetails/${nftId}`);
    };

    const getNftList = async (
        params: IRequestCollectionNftList
    ): Promise<CollectionCardNftItem[] | undefined> => {
        loadingItemList.value = true;
        isFailedList.value = false;
        try {
            const { data } = await getCollectionNftListAPI(params);
            // console.log(data);
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
                        const formatRes: CollectionCardNftItem = {
                            nftId: item.nft_id.toString(),
                            imageUrl: item.nft_image,
                            tokenId: item.nft_token_id,
                            dateDisplay: '',
                            isShowDateAndButton: false,
                            buttonText: '',
                            isHoverSwitchButton: false,
                            isMask: undefined,
                            maskFirstText: undefined,
                            maskSecondText: undefined,
                            buttonClickFn: undefined
                        };
                        switch (item.nft_display_status) {
                            case NftDisplayStatus.listed:
                                formatRes.dateDisplay = formatTimestampInterval(
                                    Number(item.lender_min_duration),
                                    Number(item.lender_end_timestamp) -
                                        Number(item.lender_start_timestamp)
                                );
                                formatRes.isShowDateAndButton = true;
                                const formatPrice1 = moveDecimal(
                                    item.lender_price,
                                    -item.payment_token_info.decimals
                                );
                                formatRes.buttonText = `${formatPrice1} ${item.payment_token_info.symbol}/Day`;
                                formatRes.isHoverSwitchButton = true;
                                formatRes.buttonClickFn = () => {
                                    router.push({
                                        name: ROUTE_INFO.comingSoon.name
                                    });
                                };
                                break;
                            case NftDisplayStatus.rented:
                                formatRes.dateDisplay = formatTimestampInterval(
                                    Number(item.lender_min_duration),
                                    Number(item.lender_end_timestamp) -
                                        Number(item.lender_start_timestamp)
                                );
                                formatRes.isShowDateAndButton = true;
                                const formatPrice2 = moveDecimal(
                                    item.lender_price,
                                    -item.payment_token_info.decimals
                                );
                                formatRes.buttonText = `${formatPrice2} ${item.payment_token_info.symbol}/Day`;
                                formatRes.isHoverSwitchButton = false;
                                formatRes.isMask = true;
                                formatRes.maskFirstText = LEASE_EXPIRES_TEXT;
                                formatRes.maskSecondText = dayjsFormatDateToDay(
                                    item.renter_end_timestamp * 1000
                                );
                                break;
                            case NftDisplayStatus.idle:
                                formatRes.dateDisplay = '';
                                formatRes.isShowDateAndButton = false;
                                formatRes.isHoverSwitchButton = false;
                                break;
                        }
                        // console.log(formatRes);
                        return formatRes;
                    });
                } else {
                    result = [];
                }
            } else {
                // 只有没有数据的时候，才会返回null,否则即使list 无数据，page_info 也会有数据返回的
                nftTotal.value = 0;
                // 没有任何条件，无数据，此时filter 按钮进入不可点击状态
                const {
                    status,
                    token_symbol,
                    min_price,
                    max_price,
                    min_duration,
                    max_duration,
                    page_number
                } = params;
                const tempList = [
                    status,
                    token_symbol,
                    min_price,
                    max_price,
                    min_duration,
                    max_duration
                ];
                if (tempList.every((item) => item === undefined) && page_number === 1) {
                    itemFilterStatus.value = FiltersBtnStatus.disable;
                }
            }
            loadingItemList.value = false;
            return result;
        } catch (error) {
            if (!isAxiosCancel(error)) {
                isFailedList.value = true;
                loadingItemList.value = false;
                console.log(error);
            } else {
                throw error;
            }
        } finally {
            loadingItemFilter.value = false;
        }
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
                console.log('cancel collection item nft list api');
            }
        }
    };

    // FilterButton
    const itemFilterStatus = ref(FiltersBtnStatus.normal);
    const isConditionExpend = computed(() => itemFilterStatus.value === FiltersBtnStatus.active);
    const switchExpend = () => {
        itemFilterStatus.value =
            itemFilterStatus.value === FiltersBtnStatus.active
                ? FiltersBtnStatus.normal
                : FiltersBtnStatus.active;

        console.log(isConditionExpend.value, 'isConditionExpend');
        console.log(isShowConditionTabs.value, 'isShowConditionTabs');
    };

    // tabs 和 status price rental duration 联动
    // Status
    const itemStatusList = [
        {
            label: 'Show All',
            value: 'all'
        },
        {
            label: 'Listed',
            value: NftStatus.listed
        },
        {
            label: 'Renting',
            value: NftStatus.rented
        }
    ];
    const itemStatusCurrent = ref<string | number>('all');
    const itemStatusSwitch = (index: number, isNeedRequest = true) => {
        const info = itemStatusList[index];
        if (!info) return;
        if (index === 0) {
            itemTabsList.value[0].show = false;
        } else {
            itemTabsList.value[0].show = true;
            itemTabsList.value[0].text = info.label;
        }
        itemStatusCurrent.value = info.value;
        nftQueryData.status = info.value === 'all' ? undefined : (info.value as number);
        if (isNeedRequest) {
            reloadFn();
        }
    };

    const PriceComRef = ref();
    const RentalDurComRef = ref();

    const handleAreaDisplay = (min: string, max: string) => {
        let result = '';
        if (min && max) {
            result = `${min}-${max}`;
        } else if (min) {
            result = `>=${min}`;
        } else if (max) {
            result = `<=${max}`;
        }
        return result;
    };

    const priceSupplyFn = (params: PriceSupplyFnParams) => {
        const { symbol, decimals, min, max } = params;
        itemTabsList.value[1].show = true;
        itemTabsList.value[1].text = handleAreaDisplay(min, max);
        itemTabsList.value[1].suffixText = symbol || '';
        nftQueryData.min_price = min ? moveDecimal(min, decimals) : undefined;
        nftQueryData.max_price = max ? moveDecimal(max, decimals) : undefined;
        nftQueryData.token_symbol = symbol;
        console.log('priceSupplyFn', params);
        reloadFn();
    };

    const rentalDurSupplyFn = (params: RentalDurationParams) => {
        const { min, max } = params;
        const s = 60 * 60 * 24;
        itemTabsList.value[2].show = true;
        itemTabsList.value[2].text = handleAreaDisplay(min, max);
        nftQueryData.min_duration = min ? bigNumberMultiply(min, s) : undefined;
        nftQueryData.max_duration = max ? bigNumberMultiply(max, s) : undefined;
        console.log('rentalDurSupplyFn', params);
        reloadFn();
    };

    const closePriceTab = (isNeedRequest = true) => {
        itemTabsList.value[1].show = false;
        PriceComRef.value?.reset();
        nftQueryData.min_price = undefined;
        nftQueryData.max_price = undefined;
        nftQueryData.token_symbol = undefined;
        if (isNeedRequest) {
            reloadFn();
        }
    };

    const closeRentalDurationTab = (isNeedRequest = true) => {
        itemTabsList.value[2].show = false;
        RentalDurComRef.value?.reset();
        nftQueryData.min_duration = undefined;
        nftQueryData.max_duration = undefined;
        if (isNeedRequest) {
            reloadFn();
        }
    };

    const itemTabsList = ref<TabListItem[]>([
        {
            key: 'status',
            show: false,
            prefixText: 'Status: ',
            text: '',
            closeFn: () => {
                itemStatusSwitch(0);
            }
        },
        {
            key: 'price',
            show: false,
            prefixText: 'Price:',
            text: '',
            suffixText: '',
            closeFn: () => {
                closePriceTab();
            }
        },
        {
            key: 'rentalDuration',
            show: false,
            prefixText: 'Rental Duration:',
            text: '',
            closeFn: () => {
                closeRentalDurationTab();
            }
        }
    ]);

    const isShowConditionTabs = computed(() => itemTabsList.value.some((item) => item.show));

    const clearAllFn = () => {
        itemStatusSwitch(0, false);
        closePriceTab(false);
        closeRentalDurationTab(false);
        reloadFn();
    };

    const reloadFn = () => {
        cancelSearchTokenId();
        nftTotal.value = DEFAULT_DISPLAY_TEXT;
        nftQueryData.page_number = 1;
        nftList.value = [];
        loadMoreNftList();
    };

    return {
        loadingItemList,
        loadingItemFilter,
        itemFilterStatus,
        switchExpend,
        isConditionExpend,
        isShowConditionTabs,
        itemTabsList,
        clearAllFn,
        itemStatusList,
        itemStatusCurrent,
        itemStatusSwitch,
        PriceComRef,
        RentalDurComRef,
        priceSupplyFn,
        rentalDurSupplyFn,
        loadMoreNftList,
        isCancelLoad,
        nftList,
        nftTotal,
        goItemDetails,
        isFailedList,
        itemPageSize,
        isItemNoData
    };
};

export const useCollectionActiveList = (cancelSearchTokenId: Function) => {
    const route = useRoute();
    const globalStore = useGlobalStore();
    const collectionId = route.params.collectionId as string;
    const isFirstLoading = ref(true);
    const column = ref([
        {
            label: 'Event',
            width: '79px',
            key: 'event'
        },
        {
            label: 'Item',
            width: '255px',
            key: 'name'
        },
        {
            label: 'Lender',
            width: '104px',
            key: 'lender'
        },
        {
            label: 'Renter',
            width: '104px',
            key: 'renter'
        },
        {
            label: 'Price',
            width: '129px',
            key: 'price'
        },
        {
            label: 'Rental Duration',
            width: '130px',
            key: 'rentalDuration'
        },
        {
            label: 'Date',
            width: '199px',
            key: 'date'
        }
    ]);

    const columnSmall = ref([
        {
            label: 'Event',
            width: '50px',
            key: 'event'
        },
        {
            label: 'Item',
            width: '232px',
            key: 'name'
        },
        {
            label: 'Lender',
            width: '94px',
            key: 'lender'
        },
        {
            label: 'Renter',
            width: '94px',
            key: 'renter'
        },
        {
            label: 'Price',
            width: '158px',
            key: 'price'
        },
        {
            label: 'Rental Duration',
            width: '134px',
            key: 'rentalDuration'
        },
        {
            label: 'Date',
            width: '130px',
            key: 'date'
        }
    ]);

    const tableData = ref([]);
    const currentPage = ref(1);
    const totalPage = ref(10);
    const tableLoading = ref(true);
    const skeletonCount = ref(10);
    const firstLoad = ref(true);

    const loadTableData = async (isFirst = true) => {
        if (!isFirst) {
            if (tableLoading.value) return;
            skeletonCount.value = 5;
        }
        console.log('触底');
        if (currentPage.value < totalPage.value) {
            console.log('load');
            tableLoading.value = true;
            const param: IRequestCollectionActiveList = {
                collection_id: collectionId,
                event_type: nftQueryData.status,
                page_size: firstLoad ? 100 : 10,
                page_number: 1
            };

            try {
                const res = await getCollectionActiveList(param);
                console.log(res.data);
                if (res.data) {
                    tableLoading.value = false;
                    loadingActiveFilter.value = false;

                    const data = res.data.list.map((item) => {
                        const explorerTxHashUrl = getExplorerTxHashUrl(item.chain_id, item.tx_hash);
                        return {
                            event: itemActivityEventEnum.get(item.event) || '',
                            name: item.token_id,
                            icon: item.nft_image,
                            lender: formatAddress(item.lender, 4, 4) || '--',
                            renter: formatAddress(item.renter, 4, 4) || '--',
                            price: moveDecimal(
                                item.price,
                                (item.payment_token_info.decimals as any) * -1
                            ),
                            rentalDuration: formatTimestampInterval(
                                Number(item.min_duration),
                                Number(item.end_timestamp) - Number(item.start_timestamp)
                            ),
                            lenderVal: item.lender,
                            renterVal: item.renter,
                            dateNormal: formatLastUpdated(item.start_timestamp),
                            dateUTC: dayjsFormatDateToDay(item.start_timestamp * 1000),
                            startTimestamp: item.start_timestamp,
                            nftId: item.nft_id,
                            txHash: item.tx_hash,
                            paymentTokenInfo: {
                                decimals: item.payment_token_info.decimals,
                                icon: item.payment_token_info.icon,
                                symbol: item.payment_token_info.symbol
                            },
                            explorerTxHashUrl: explorerTxHashUrl
                        };
                    });
                    totalPage.value = res.data.page_info.total_page_count;
                    currentPage.value++;
                    Array.prototype.push.apply(tableData.value, data);
                    if (tableData.value.length == 0 && firstLoad.value) {
                        activityFilterStatus.value = FiltersBtnStatus.disable;
                    }
                    firstLoad.value = false;
                }
            } catch (e: any) {
                console.log(e, 'error');
                if (firstLoad) {
                    globalStore.show500 = true;
                }
            }
        }
    };

    const activeClearAllFn = () => {
        activeStatusSwitch(0, false);
        reloadFn();
    };

    const nftQueryData: any = reactive({
        status: undefined
    });

    const activityCurrentStatus: any = ref('all');
    const activityFilterStatus = ref(FiltersBtnStatus.normal);
    const activeSwitchExpend = () => {
        activityFilterStatus.value =
            activityFilterStatus.value === FiltersBtnStatus.active
                ? FiltersBtnStatus.normal
                : FiltersBtnStatus.active;
    };

    const loadingActiveFilter = ref(true);

    const isSmallSpacing = ref(false);

    watch(
        () => activityFilterStatus.value,
        (val) => {
            switch (val) {
                case FiltersBtnStatus.active:
                    isSmallSpacing.value = true;
                    break;
                case FiltersBtnStatus.normal:
                    isSmallSpacing.value = false;
                    break;
            }
        }
    );

    const reloadFn = () => {
        cancelSearchTokenId();
        tableData.value = [];
        tableLoading.value = true;
        currentPage.value = 1;
        totalPage.value = 10;
        loadTableData();
    };

    const activeTabsList = ref<TabListItem[]>([
        {
            key: 'status',
            show: false,
            prefixText: 'Status: ',
            text: '',
            closeFn: () => {
                activeStatusSwitch(0);
            }
        }
    ]);

    const activeStatusSwitch = (index: number, isNeedRequest = true) => {
        const info = activeStatusList[index];
        if (!info) return;
        if (index === 0) {
            activeTabsList.value[0].show = false;
        } else {
            activeTabsList.value[0].show = true;
            activeTabsList.value[0].text = info.label;
        }
        activityCurrentStatus.value = info.value;
        nftQueryData.status = info.value === 'all' ? undefined : (info.value as number);
        if (isNeedRequest) {
            reloadFn();
        }
    };

    const activeStatusList = [
        {
            label: 'Show All',
            value: 'all'
        },
        {
            label: 'Listed',
            value: collectionActiveQueryStatus.Listed
        },
        {
            label: 'Renting',
            value: collectionActiveQueryStatus.Renting
        }
    ];

    const isActiveConditionExpend = computed(
        () => activityFilterStatus.value === FiltersBtnStatus.active
    );

    const isShowActiveConditionTabs = computed(() =>
        activeTabsList.value.some((item) => item.show)
    );

    const infiniteScroll = () => {
        loadTableData(false);
    };

    const activeTimer: any = ref(null);

    const setActiveTimer = () => {
        activeTimer.value = setInterval(() => {
            tableData.value.forEach((item: any) => {
                item.dateNormal = formatLastUpdated(item.startTimestamp);
                // item.dateUTC = dayjsFormatDateToDay(item.startTimestamp * 1000);
            });
        }, 1000);
    };

    onMounted(() => {
        setActiveTimer();
    });

    onUnmounted(() => {
        clearInterval(activeTimer.value);
    });

    return {
        column,
        columnSmall,
        tableData,
        currentPage,
        totalPage,
        tableLoading,
        skeletonCount,
        loadTableData,
        activityCurrentStatus,
        activityFilterStatus,
        activeSwitchExpend,
        FiltersBtnStatus,
        isSmallSpacing,
        activeTabsList,
        activeStatusList,
        activeStatusSwitch,
        isActiveConditionExpend,
        isShowActiveConditionTabs,
        activeClearAllFn,
        isFirstLoading,
        infiniteScroll,
        loadingActiveFilter
    };
};

export const useCollectionTabs = (
    isFirstLoading: Ref<boolean>,
    loadTableData: Function,
    cancelSearchTokenId: Function
) => {
    // tab
    const activeName = ref('item');

    // 切换tab事件
    const handleClick = (tab: TabsPaneContext) => {
        // 切换tab 取消toknId的搜索
        cancelSearchTokenId();
        switch (tab.props.name) {
            case 'activity':
                if (isFirstLoading.value) {
                    // 初次点击 active 加载数据。
                    isFirstLoading.value = false;
                    loadTableData();
                }
                break;
        }
    };
    return {
        activeName,
        handleClick
    };
};
