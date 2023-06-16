<template>
    <div class="profile_detail__collection__info__item_activity__bottom__table_box">
        <div
            class="profile_detail__collection__info__item_activity__bottom__table_box__header_bg"
        ></div>
        <el-table
            :data="tableData"
            style="width: 100%"
            max-height="265"
            header-cell-class-name="table_header"
            row-class-name="table_row"
            header-row-class-name="headerRow"
            :row-style="{ height: '46px' }"
            cell-class-name="table_cell"
        >
            <el-table-column
                v-for="(item, index) in column"
                :key="index"
                :align="item.align"
                :prop="item.columnProp"
                :label="item.label"
                :width="item.width"
            >
                <template v-if="item.columnProp == 'date'" #header>
                    <div class="table_header_date">
                        <div class="table_header_date__text">Date</div>
                        <div class="table_header_date__icon_box" @click="toggleTime">
                            <!-- icon显示有大概1px的样式问题，换成图片展示 -->
                            <img :src="timeImg" alt="" class="table_header_date__icon_box__img" />
                        </div>
                    </div>
                </template>
                <template #default="scope">
                    <div v-if="item.columnProp == 'price'" class="table_cell_price">
                        <img :src="scope.row.icon" alt="" class="table_cell_price__img" />
                        <span class="table_cell_price__text">{{ scope.row.price }}</span>
                    </div>
                    <div
                        v-else-if="item.columnProp == 'lender'"
                        :class="{ table_cursor: isCursor(scope.row.lender) }"
                        @click="toProfilePage(item.columnProp, scope.row)"
                    >
                        <span>{{ scope.row.lender }}</span>
                    </div>
                    <div
                        v-else-if="item.columnProp == 'renter'"
                        :class="{ table_cursor: isCursor(scope.row.renter) }"
                        @click="toProfilePage(item.columnProp, scope.row)"
                    >
                        <span>{{ scope.row.renter }}</span>
                    </div>
                    <div
                        v-else-if="item.columnProp == 'date'"
                        :class="{ table_cursor: scope.row.explorerTxHashUrl }"
                        :style="`text-align: ${item.align}`"
                        @click="toExplorer(scope.row.explorerTxHashUrl)"
                    >
                        {{ isNormalTime ? scope.row.dateNormal : scope.row.dateUTC }}
                    </div>
                    <div v-else :style="`text-align: ${item.align}`">
                        {{ scope.row[item.columnProp] }}
                    </div>
                </template>
            </el-table-column>
            <template #empty>
                <div class="table_empty">
                    <div v-if="tableLoading" class="table_empty__loading">
                        <MyLoading width="32px" height="32px"></MyLoading>
                    </div>
                    <div v-else class="table_empty__empty">
                        <NoData></NoData>
                    </div>
                </div>
            </template>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
    import { onMounted } from 'vue';
    import { DEFAULT_DISPLAY_TEXT } from '@/constants';
    import NoData from '@/components/NoData.vue';
    import MyLoading from '@/components/MyLoading.vue';
    import timeImg from '@/assets/image/time_icon.png';
    import { isCursor, toExplorer } from '@/helper/baseHelper.js';

    const router = useRouter();

    type Column = {
        align: string;
        columnProp: string;
        label: string;
        width: string;
    };
    interface IProps {
        tableData?: Array<object>;
        totalPage?: number;
        currentPage?: number;
        tableLoading?: boolean;
        column: Array<Column>;
    }

    const props = withDefaults(defineProps<IProps>(), {
        tableData: [] as any,
        totalPage: 1,
        currentPage: 1,
        tableLoading: false
    });

    const emit = defineEmits<{
        (e: 'loadData', currentPage: number): void;
    }>();

    const scrollDiv: any = ref(null);

    const callback = () => {
        let scrollDiv: any = document.getElementsByClassName('el-scrollbar__wrap')[0];
        const scrollTop = scrollDiv.scrollTop;
        const scrollHeight = scrollDiv.scrollHeight;
        const offsetHeight = scrollDiv.offsetHeight;
        if (offsetHeight + scrollTop >= scrollHeight) {
            //触发事件
            if (props.totalPage > props.currentPage) {
                emit('loadData', props.currentPage);
            }
        }
    };

    onMounted(() => {
        scrollDiv.value = document.getElementsByClassName('el-scrollbar__wrap')[0];
        //绑定事件
        scrollDiv.value.addEventListener('scroll', callback);
    });

    onUnmounted(() => {
        scrollDiv.value.removeEventListener('scroll', callback);
    });

    // 根据字段具体显示哪个时间
    const isNormalTime = ref(true);
    const toggleTime = () => {
        isNormalTime.value = !isNormalTime.value;
    };

    const toProfilePage = (type: string, row: any) => {
        if (!row[type] || row[type] === DEFAULT_DISPLAY_TEXT) return;
        router.push({
            path: `/profile/${row[`${type}Data`]}`
        });
    };
</script>

<style scoped lang="less">
    .profile_detail__collection__info__item_activity__bottom__table_box {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        padding: 0 6px 0 16px;

        &__header_bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 34px;
            background: var(--bj-background-color-third) !important;
        }

        .table_header_date {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            &__icon_box {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                margin-left: 8px;
                background: var(--bj-background-color-third);
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                cursor: pointer;

                .iconfont {
                    color: #000000;
                    font-size: 12px;
                }

                &__img {
                    width: 12px;
                    height: 12px;
                }
            }
        }

        .table_cell_price {
            display: flex;
            align-items: center;

            &__img {
                width: 16px;
                height: 16px;
                margin-right: 4px;
            }
        }

        .table_empty {
            padding: 40px 0 20px;

            &__loading {
                ::v-deep(.chase-item)::before {
                    background-color: var(--bj-disable-color) !important;
                }
            }
        }
    }

    ::v-deep(.el-table) {
        .el-table__cell {
            height: 34px !important;
            padding: 0;
            font-size: 14px;
        }

        .el-table__header-wrapper {
            background: var(--bj-background-color-third);
        }
        // 删除表格下方边框
        .el-table__inner-wrapper::before {
            background: transparent;
            border: none !important;
        }

        .headerRow {
            height: 34px;
            color: red !important;
        }

        .table_header {
            .small_text_font_bold;

            color: var(--bj-text-second);
            background: var(--bj-background-color-third) !important;
            border-bottom: none !important;
        }

        .cell {
            padding: 0 !important;
            font-size: 14px !important;
        }
    }
</style>
