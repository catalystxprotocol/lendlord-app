<template>
    <div class="collections_table">
        <MyTable>
            <template #header>
                <div class="collections_table__header">
                    <div class="collections_table__header__list_box">
                        <ul class="collections_table__header__list_box__ul column">
                            <li
                                v-for="(column, index) in columns"
                                :key="index"
                                class="collections_table__header__list_box__ul__li"
                                :style="`width: ${column.width}`"
                            >
                                <div class="collections_table__header__list_box__ul__li__content">{{
                                    column.label
                                }}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template #body>
                <div class="collections_table__body">
                    <div
                        v-for="(row, idx) in data"
                        :key="idx"
                        class="collections_table__body__row"
                        @click="toCollectionDetail(row)"
                    >
                        <ul class="collections_table__body__row__ul column">
                            <li
                                v-for="(column, index) in columns"
                                :key="index"
                                class="collections_table__body__row__ul__li"
                                :style="`width: ${column.width}`"
                            >
                                <div
                                    v-if="column.key == 'name'"
                                    class="collections_table__body__row__ul__li__content"
                                >
                                    <div class="collections_table__body__row__ul__li__content__img">
                                        <NftImage
                                            :default-image-overspread="true"
                                            :src="row.icon"
                                        ></NftImage>
                                    </div>
                                    <span
                                        class="collections_table__body__row__ul__li__content__text"
                                        >{{ row[column.key] }}</span
                                    >
                                </div>
                                <div v-else class="collections_table__body__row__ul__li__content">
                                    {{ row[column.key] }}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template v-if="loading" #skeleton>
                <div class="collections_table__skeleton">
                    <div
                        v-for="idx in skeletonCount"
                        :key="idx"
                        class="collections_table__skeleton__row"
                    >
                        <ul class="collections_table__skeleton__row__ul column">
                            <li
                                v-for="(column, index) in columns"
                                :key="index"
                                class="collections_table__skeleton__row__ul__li"
                                :style="`width: ${column.width}`"
                            >
                                <div class="collections_table__skeleton__row__ul__li__content">
                                    <MySkeleton width="100%" height="100%"></MySkeleton>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template v-if="data.length == 0 && !loading" #noData>
                <div class="collections_table__noData">
                    <no-data></no-data>
                </div>
            </template>
        </MyTable>
    </div>
</template>

<script lang="ts" setup>
    import MySkeleton from '@/components/MySkeleton.vue';
    import NoData from '@/components/NoData.vue';
    import NftImage from '@/components/NftImage.vue';
    const router = useRouter();

    interface IProps {
        columns: any[];
        data: any[];
        skeletonCount?: number;
        loading: boolean;
    }

    withDefaults(defineProps<IProps>(), {
        column: () => [],
        data: () => [],
        skeletonCount: 10,
        loading: false
    });

    const toCollectionDetail = (row: any) => {
        router.push(`/collection/${row.collectionId}`);
    };
</script>

<style lang="less" scoped>
    .collections_table__header {
        position: sticky;
        top: 100px;
        z-index: 100;
        box-sizing: border-box;
        width: 100%;
        padding: 16px 12px 4px;

        &__list_box {
            width: 100%;
            height: 34px;
            background: #f8f7f5;
            border: 2px solid #ffffff;
            border-radius: 17px;

            &__ul {
                &__li {
                    .small_text_font_bold;

                    line-height: 34px;
                }
            }
        }
    }

    .collections_table__body {
        &__row {
            height: 72px;
            padding: 0 12px;

            &__ul {
                height: 100%;

                &__li {
                    height: 100%;

                    &__content {
                        display: flex;
                        align-items: center;
                        color: #000000;
                        font-weight: 400;
                        font-size: 14px;
                        font-family: Inter-Regular, Inter;

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
                }
            }
        }

        &__row:hover {
            background: rgba(188, 178, 160, 0.08);
            cursor: pointer;
        }
    }

    .column {
        display: flex;

        li {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            //border: 1px solid red;
        }

        li:not(:first-child) {
            margin-left: 24px;
        }

        li:nth-child(2) {
            margin-left: 21px;
        }

        li:nth-child(3),
        li:nth-child(4),
        li:nth-child(5),
        li:nth-child(6) {
            justify-content: flex-end;
        }

        li:last-child {
            padding-right: 58px;
        }
    }

    .collections_table__skeleton {
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

    .collections_table__noData {
        height: 462px;
        padding-top: 64px;
    }
</style>
