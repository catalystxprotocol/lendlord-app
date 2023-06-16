<template>
    <div class="activity_table">
        <MyTable>
            <template #header>
                <div class="activity_table__header">
                    <div class="activity_table__header__list_box">
                        <ul class="activity_table__header__list_box__ul column">
                            <li
                                v-for="(column, index) in columns"
                                :key="index"
                                class="activity_table__header__list_box__ul__li"
                                :style="`width: ${column.width}`"
                                :class="smallSpacing ? 'small_spacing' : ''"
                            >
                                <div
                                    v-if="column.key === 'date'"
                                    class="activity_table__header__list_box__ul__li__date"
                                >
                                    <span
                                        class="activity_table__header__list_box__ul__li__date__text"
                                    >
                                        {{ column.label }}
                                    </span>
                                    <div
                                        class="activity_table__header__list_box__ul__li__date__img_box"
                                        @click="toggleDate"
                                    >
                                        <img
                                            :src="timeImg"
                                            alt=""
                                            class="activity_table__header__list_box__ul__li__date__img_box__img"
                                        />
                                    </div>
                                </div>
                                <div
                                    v-else
                                    class="activity_table__header__list_box__ul__li__content"
                                    >{{ column.label }}</div
                                >
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template #body>
                <div class="activity_table__body">
                    <div v-for="(row, idx) in data" :key="idx" class="activity_table__body__row">
                        <ul class="activity_table__body__row__ul column">
                            <li
                                v-for="(column, index) in columns"
                                :key="index"
                                class="activity_table__body__row__ul__li"
                                :style="`width: ${column.width}`"
                                :class="smallSpacing ? 'small_spacing' : ''"
                            >
                                <div
                                    v-if="column.key == 'name'"
                                    class="activity_table__body__row__ul__li__content cursor_pointer clickable"
                                    @click="toPage(column, row)"
                                >
                                    <div class="activity_table__body__row__ul__li__content__img">
                                        <NftImage
                                            :default-image-overspread="true"
                                            :src="row.icon"
                                        ></NftImage>
                                    </div>

                                    <span
                                        class="activity_table__body__row__ul__li__content__text"
                                        >{{ row[column.key] }}</span
                                    >
                                </div>

                                <div
                                    v-else-if="column.key == 'lender' || column.key == 'renter'"
                                    class="activity_table__body__row__ul__li__content"
                                    :class="{ clickable: isCursor(row[column.key]) }"
                                    @click="toPage(column, row)"
                                >
                                    <div
                                        class="activity_table__body__row__ul__li__content__addr"
                                        :class="{ table_cursor: isCursor(row[column.key]) }"
                                    >
                                        {{ row[column.key] }}
                                    </div>
                                </div>

                                <div
                                    v-else-if="column.key == 'price'"
                                    class="activity_table__body__row__ul__li__content"
                                >
                                    <div class="activity_table__body__row__ul__li__content__price">
                                        <div
                                            class="activity_table__body__row__ul__li__content__price__icon"
                                        >
                                            <img
                                                :src="row['paymentTokenInfo'].icon"
                                                alt=""
                                                class="activity_table__body__row__ul__li__content__price__icon__img"
                                            />
                                        </div>
                                        <span
                                            class="activity_table__body__row__ul__li__content__price__text"
                                            >{{ row[column.key] }}
                                            {{
                                                row['event'] == collectionActiveQueryStatus.Listed
                                                    ? '/Day'
                                                    : ''
                                            }}</span
                                        >
                                    </div>
                                </div>

                                <div
                                    v-else-if="column.key == 'date'"
                                    class="activity_table__body__row__ul__li__content clickable"
                                    :class="{ table_cursor: row['explorerTxHashUrl'] }"
                                    @click="toExplorer(row['explorerTxHashUrl'])"
                                >
                                    <div class="activity_table__body__row__ul__li__content__date">
                                        {{ isShowUTCDate ? row['dateUTC'] : row['dateNormal'] }}
                                    </div>
                                </div>
                                <div v-else class="activity_table__body__row__ul__li__content">
                                    {{ row[column.key] }}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template v-if="loading" #skeleton>
                <div class="activity_table__skeleton">
                    <div
                        v-for="idx in skeletonCount"
                        :key="idx"
                        class="activity_table__skeleton__row"
                    >
                        <ul class="activity_table__skeleton__row__ul column">
                            <li
                                v-for="(column, index) in columns"
                                :key="index"
                                class="activity_table__skeleton__row__ul__li"
                                :style="`width: ${column.width}`"
                                :class="smallSpacing ? 'small_spacing' : ''"
                            >
                                <div class="activity_table__skeleton__row__ul__li__content">
                                    <MySkeleton width="100%" height="100%"></MySkeleton>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template v-if="data.length == 0 && !loading" #noData>
                <div class="activity_table__noData">
                    <no-data></no-data>
                </div>
            </template>
        </MyTable>
    </div>
</template>

<script lang="ts" setup>
    import MySkeleton from '@/components/MySkeleton.vue';
    import NoData from '@/components/NoData.vue';
    import timeImg from '@/assets/image/time_icon.png';
    import NftImage from '@/components/NftImage.vue';
    import { collectionActiveQueryStatus } from '@/types/interface/collectionDetails.interface';
    import { isCursor, toExplorer } from '@/helper/baseHelper.js';
    import router from '@/router';

    interface IProps {
        columns: any[];
        data: any[];
        skeletonCount?: number;
        loading: boolean;
        smallSpacing?: boolean;
    }

    withDefaults(defineProps<IProps>(), {
        column: () => [],
        data: () => [],
        skeletonCount: 10,
        loading: false,
        smallSpacing: true
    });

    const isShowUTCDate = ref(true);
    const toggleDate = () => {
        isShowUTCDate.value = !isShowUTCDate.value;
    };

    const toPage = (column: any, row: any) => {
        switch (column.key) {
            case 'name':
                router.push(`/itemDetails/${row.nftId}`);
                break;
            case 'lender':
                if (row.lenderVal) router.push(`/profile/${row.lenderVal}`);
                break;
            case 'renter':
                if (row.renterVal) router.push(`/profile/${row.renterVal}`);
                break;
        }
    };
</script>

<style lang="less" scoped>
    .activity_table__header {
        position: sticky;
        top: 0;
        z-index: 100;
        box-sizing: border-box;
        width: 100%;
        // height: 42px;
        padding: 5px 10px 8px;

        &__list_box {
            width: 100%;
            height: 34px;
            background: #f8f7f5;
            border: 2px solid #ffffff;
            border-radius: 17px;

            &__ul {
                &__li {
                    .title_font;

                    font-weight: bold;
                    font-size: 14px;
                    line-height: 34px;

                    &__date {
                        display: flex;
                        align-items: center;

                        &__img_box {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 18px;
                            height: 18px;
                            margin-left: 8px;
                            background: var(--bj-background-color-third);
                            border: 1px solid var(--bj-border-color);
                            border-radius: 4px;

                            &__img {
                                width: 12px;
                                height: 12px;
                            }
                        }

                        &__img_box:hover {
                            .cursor_pointer;

                            border: 1px solid var(--bj-primary-color);
                        }
                    }
                }
            }
        }
    }

    .activity_table__body {
        &__row {
            height: 72px;
            padding: 0 10px;

            &__ul {
                height: 100%;

                &__li {
                    height: 100%;

                    &__content {
                        display: flex;
                        align-items: center;
                        .text_font;

                        font-weight: 400;
                        font-size: 14px;

                        &__addr {
                        }

                        &__price {
                            display: flex;
                            align-items: center;

                            &__icon {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 16px;
                                height: 16px;

                                &__img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }

                            &__text {
                                margin-left: 4px;
                            }
                        }

                        &__date {
                            width: 100%;
                            color: var(--bg-text-addr);
                            text-align: right;
                        }

                        &__img {
                            width: 48px;
                            height: 48px;

                            ::v-deep(.image_wrap) {
                                width: 100%;
                                height: 100%;
                                border-radius: 8px;
                            }
                        }

                        &__text {
                            margin-left: 12px;
                        }
                    }

                    .clickable {
                        .cursor_pointer;

                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }

        &__row:hover {
            background: rgba(188, 178, 160, 0.08);
        }
    }

    .column {
        display: flex;

        li {
            display: flex;
            align-items: center;
            box-sizing: border-box;
        }

        li:not(:first-child) {
            margin-left: 24px;
        }

        .small_spacing:not(:first-child) {
            margin-left: 12px !important;
        }

        li:first-child {
            box-sizing: content-box;
            padding-left: 18px;
        }

        li:nth-child(5),
        li:nth-child(6),
        li:nth-child(7) {
            justify-content: flex-end;
        }

        li:last-child {
            box-sizing: content-box;
            padding-right: 18px;
        }
    }

    .activity_table__skeleton {
        padding-top: 4px;

        &__row {
            height: 72px;
            padding: 0 12px;

            &__ul {
                height: 100%;

                &__li {
                    height: 100%;

                    &__content {
                        width: 100%;
                        height: 40px;
                        border-radius: 16px;

                        ::v-deep(.block) {
                            border-radius: 4px;
                        }
                    }
                }

                li:last-child {
                    padding-right: 0 !important;
                }
            }
        }
    }

    .activity_table__noData {
        height: 462px;
        padding-top: 64px;
    }
</style>
