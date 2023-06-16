<template>
    <div class="single_stauts">
        <div class="single_stauts__title"> Status </div>
        <div v-for="(item, index) in list" :key="item.value" class="single_stauts__option_item">
            <MyRadioIcon
                class="single_stauts__option_item__radio"
                :selected="item.value === currentKey"
                @click="selectedFn(index)"
            />
            <span @click="selectedFn(index)">{{ item.label }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import MyRadioIcon from '@/components/MyRadioIcon.vue';
    import { StatusListItem } from '@/types/interface/collectionDetails.interface';

    interface IProps {
        list: StatusListItem[];
        currentKey: string | number;
    }

    defineProps<IProps>();

    const emit = defineEmits<{
        (e: 'switchFn', index: number): void;
    }>();

    const selectedFn = (index: number) => {
        emit('switchFn', index);
    };
</script>

<style lang="less" scoped>
    .single_stauts {
        &__title {
            .text_font_bold;

            margin-bottom: 12px;
        }

        &__option_item {
            display: flex;
            align-items: center;
            margin-bottom: 18px;

            &__radio {
            }

            span {
                .cursor_pointer;
                .small_text_font;

                padding-left: 12px;
            }

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
</style>
