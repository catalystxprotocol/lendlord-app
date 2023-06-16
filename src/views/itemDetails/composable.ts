import { handle404 } from '@/composables/index';
import { selectOptionsEnum, itemActivityEventEnum } from '@/constants/itemDetails';
import { TValue } from '@/types/interface/global.interface';
import { onMounted } from 'vue';
import {
    dayjsFormatDateToDay,
    dayjsFormatDateToMinutes,
    formatTimestampInterval,
    formatLastUpdated
} from '@/utils/time';
import { formatAddress } from '@/utils/string';
import { moveDecimal } from '@/utils/calculate';
import { ItemDetailInfo, TableItem, TableParam } from '@/types/interface/itemDetails.interface';
import { useGlobalStore } from '@/store/modules/global';
import { getItemActivityList, getNftDetailInfoAPI } from '@/api/itemDetails';
import { NftStatus } from '@/types/interface/profile.interface';
import { ROUTE_INFO } from '@/constants';
import { getExplorerTxHashUrl } from '@/helper/baseHelper';

export const useItemDetailsModule = () => {
    const globalStore = useGlobalStore();
    const route = useRoute();
    const router = useRouter();
    const loading = ref(true);
    // 数据 loading 效果取决于数据初始化的值
    const itemDetailInfo = reactive<ItemDetailInfo>({
        collectionName: '--',
        collectionImg: '',
        tokenId: '--',
        owner: '--',
        user: '--',
        rentAfter: '--',
        availableUntil: '--',
        availableUntilMin: '--',
        price: '--',
        priceIcon: '',
        priceUnit: '',
        rentPeriod: '--',
        rentPeriodUnit: '',
        nftStatus: NftStatus.listed,
        nftId: 0
    });

    const isExpansion = ref(false);
    const tableDataLoading = ref(false);
    const toggleExpansion = async () => {
        isExpansion.value = !isExpansion.value;
        clearInterval(dateTimer.value);
        if (isExpansion.value) {
            tableDataLoading.value = true;
            tableData.value = [];
            currentPage.value = 1;
            totalPage.value = 1;
            await loadTableData();
        }
    };

    const itemActivityOptions = [
        { label: 'All Events', value: selectOptionsEnum.all },
        { label: 'List', value: selectOptionsEnum.list },
        { label: 'Rent', value: selectOptionsEnum.rent }
    ];

    // 后端请求总页数
    const totalPage = ref(5);
    // 当前页
    const currentPage = ref(1);

    const pageSize = ref<number>(10);

    const tableData = ref<TableItem[]>([]);

    const column = ref([
        {
            label: 'Event',
            columnProp: 'event',
            width: '64',
            align: 'left'
        },
        {
            label: 'Lender',
            columnProp: 'lender',
            width: '112',
            align: 'left'
        },
        {
            label: 'Renter',
            columnProp: 'renter',
            width: '112',
            align: 'left'
        },
        {
            label: 'Price',
            columnProp: 'price',
            width: '152',
            align: 'left'
        },
        {
            label: 'Rental Duration',
            columnProp: 'ratedDuration',
            width: '126',
            align: 'left'
        },
        {
            label: 'Date',
            columnProp: 'date',
            width: '102',
            align: 'right'
        }
    ]);

    const selectStatus = ref<number | string>(0);

    const rollTrigger = async (page: number) => {
        currentPage.value = page + 1;
        await loadTableData();
    };

    const dateTimer = ref<any>(null);

    const dateTimerCallback = () => {
        tableData.value.forEach((item) => {
            item.dateNormal = formatLastUpdated(Number(item.startTimestamp));
        });
    };

    const loadTableData = async () => {
        try {
            const param: TableParam = {
                nft_id: itemDetailInfo.nftId,
                page_size: pageSize.value,
                page_number: currentPage.value
            };
            if (selectStatus.value !== selectOptionsEnum.all) param.event_type = selectStatus.value;
            const { data } = await getItemActivityList(param);
            if (data) {
                tableDataLoading.value = false;
                const { list, page_info } = data;
                totalPage.value = page_info?.total_page_count;
                let loadData: TableItem[] = [];
                if (list) {
                    loadData = list.map((item) => {
                        const explorerTxHashUrl = getExplorerTxHashUrl(item.chain_id, item.tx_hash);
                        // console.log('explorerTxHashUrl', explorerTxHashUrl);
                        return {
                            event: itemActivityEventEnum.get(item.event) || '',
                            lender: formatAddress(item.lender, 4, 4) || '--',
                            renter: formatAddress(item.renter, 4, 4) || '--',
                            price: moveDecimal(
                                item.price,
                                Number(item?.payment_token_info?.decimals) * -1
                            ),
                            ratedDuration: formatTimestampInterval(
                                Number(item.rent_min_duration),
                                Number(item.end_timestamp) - Number(item.start_timestamp)
                            ),
                            icon: item.payment_token_info.icon,
                            startTimestamp: item.start_timestamp,
                            lendEndTimestamp: item.end_timestamp,
                            dateNormal: formatLastUpdated(Number(item.start_timestamp)),
                            dateUTC: dayjsFormatDateToDay(Number(item.start_timestamp) * 1000),
                            lenderData: item.lender,
                            renterData: item.renter,
                            explorerTxHashUrl: explorerTxHashUrl
                        };
                    });
                }
                Array.prototype.push.apply(tableData.value, loadData);
                clearInterval(dateTimer.value);
                dateTimer.value = setInterval(dateTimerCallback, 1000);
            }
        } catch (e) {
            console.log(e);
            globalStore.show500 = true;
        }
    };

    const selectedChange = async (value: TValue) => {
        selectStatus.value = value;
        currentPage.value = 1;
        totalPage.value = 1;
        tableData.value = [];
        tableDataLoading.value = true;
        await loadTableData();
    };

    const btnCallback = () => {
        switch (itemDetailInfo.nftStatus) {
            case NftStatus.listed:
                router.push({
                    name: ROUTE_INFO.comingSoon.name
                });
                break;
            case NftStatus.idelOwner:
                router.push({
                    path: `/lend/${itemDetailInfo.nftId}`
                });
                break;
        }
    };

    const getNftDetailInfo = async () => {
        loading.value = false;
        try {
            const { data } = await getNftDetailInfoAPI(
                (route as any).params.nftId,
                globalStore.account
            );
            if (data) {
                itemDetailInfo.collectionName = data.collection_name || '--';
                itemDetailInfo.collectionImg = data.nft_image;
                itemDetailInfo.tokenId = data.nft_token_id;
                itemDetailInfo.owner = formatAddress(data.nft_owner, 6, 6);
                itemDetailInfo.user = formatAddress(data.nft_user, 6, 6);
                itemDetailInfo.rentAfter = dayjsFormatDateToDay(Number(data.end_timestamp) * 1000);
                itemDetailInfo.availableUntil = dayjsFormatDateToDay(
                    Number(data.lend_end_timestamp) * 1000
                );
                itemDetailInfo.availableUntilMin = dayjsFormatDateToMinutes(
                    Number(data.lend_end_timestamp) * 1000
                );
                itemDetailInfo.price = moveDecimal(
                    data.price,
                    data?.payment_token_info?.decimals * -1
                );
                itemDetailInfo.priceIcon = data?.payment_token_info?.icon;
                itemDetailInfo.priceUnit = `${data?.payment_token_info?.symbol} /Days`;
                itemDetailInfo.rentPeriod = formatTimestampInterval(
                    Number(data.lend_min_duration),
                    Math.floor(Number(data.lend_end_timestamp) - new Date().getTime() / 1000),
                    false
                );
                itemDetailInfo.rentPeriodUnit = 'Days';
                itemDetailInfo.nftStatus = data.nft_status;
                itemDetailInfo.nftId = data.nft_id;

                if (data.nft_status == NftStatus.idle || data.nft_status == NftStatus.idelOwner) {
                    itemDetailInfo.rentPeriod = '--';
                    itemDetailInfo.price = '--';
                }
            }
        } catch (e) {
            console.log(e);
            handle404(e);
        }
    };

    // 监听globalStore.account
    watch(
        () => globalStore.account,
        () => {
            window.location.reload();
        }
    );

    onMounted(async () => {
        await getNftDetailInfo();
    });

    onUnmounted(() => {
        clearInterval(dateTimer.value);
    });

    return {
        isExpansion,
        itemActivityOptions,
        totalPage,
        currentPage,
        tableData,
        loadTableData,
        toggleExpansion,
        itemDetailInfo,
        loading,
        selectedChange,
        column,
        tableDataLoading,
        btnCallback,
        selectStatus,
        rollTrigger,
        NftStatus
    };
};
