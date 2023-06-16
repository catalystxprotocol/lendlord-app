import { useRoute, useRouter } from 'vue-router';
import { moveDecimal } from '@/utils/calculate';
import { IRequestSearchCollectionList } from '@/types/interface/searchCollection';
import { getSearchCollectionListAPI } from '@/api/searchCollection';

export const useSearchModule = () => {
    const route = useRoute();
    const router = useRouter();
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
    const noData = ref(false);
    const loadTableData = async (isFirst = true) => {
        if (!isFirst && tableLoading.value) return; // 除第一次加载外处于loading状态下不再重新触发load
        if (!isFirst) skeletonCount.value = 5; // 初次加载骨架屏和后续加载骨架屏数量不一致
        if (currentPage.value < totalPage.value) {
            try {
                tableLoading.value = true;
                tableData.value = [];
                noData.value = false;
                const param: IRequestSearchCollectionList = {
                    collection_name: route.params.collectionName as string
                };
                const res = await getSearchCollectionListAPI(param);

                if (res?.data) {
                    const resList: any = res.data.list.map((item, key) => {
                        return {
                            index: key + 1,
                            name: item.collection_name,
                            icon: item.collection_image,
                            floorPrice: `${moveDecimal(
                                item.floor_price,
                                (item.payment_token_info.decimals as any) * -1
                            )} ${item.payment_token_info.symbol}/Days`,
                            totalListed: item.total_listed,
                            availableForRent: item.available_for_rent,
                            supply: item.supply,
                            collectionId: item.collection_id
                        };
                    });
                    console.log(resList, 'resList');

                    // if (isFirstLoad) total.value = res.data.page_info.total_record_count;
                    // isFirstLoad.value = false;
                    // totalPage.value = res.data.page_info.total_page_count;
                    // currentPage.value++;
                    tableLoading.value = false;
                    Array.prototype.push.apply(tableData.value, resList);
                    if (tableData.value.length == 0) noData.value = true;
                }
            } catch (e) {
                console.log(e);
            }
        }
    };

    // 模糊搜算暂不设计分页，后续如果有更改可使用滚动加载逻辑
    // 滚动到底部加载表格数据，后续根据需求可考虑增加初始化加载数据条数交少时，没有出现滚动条后继续加载。参考element plus infinite-scroll-immediate
    // const scrollBottom = () => {
    //     const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //     const clientHeight = document.documentElement.clientHeight;
    //     const scrollHeight = document.documentElement.scrollHeight;
    //     if (scrollTop + clientHeight >= scrollHeight) {
    //         if (tableLoading.value || tableData.value.length == 0) return; // 初次请求无数据状态不再加载数据
    //         loadTableData(false);
    //     }
    // };

    watch(
        () => route.params.collectionName,
        (value) => {
            console.log(value);
            loadTableData();
        },
        {
            immediate: true
        }
    );

    const toMarketplace = () => {
        router.push('/marketplace');
    };

    return {
        column,
        tableData,
        currentPage,
        totalPage,
        tableLoading,
        skeletonCount,
        route,
        toMarketplace,
        noData
    };
};
