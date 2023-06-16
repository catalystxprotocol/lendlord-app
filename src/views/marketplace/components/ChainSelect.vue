<template>
    <div class="chain_select">
        <div
            v-for="(item, idx) in options"
            :key="idx"
            class="chain_select__item_box"
            :class="item.value == modelValue.value ? 'chain_select__item_box_active' : ''"
            @click="update(item, $event)"
        >
            <div v-if="item.label" class="chain_select__item_box__text">
                {{ item.label }}
            </div>
            <div v-else class="chain_select__item_box__icon_box">
                <img
                    class="chain_select__item_box__icon_box__icon"
                    :src="item.value == modelValue.value ? item.iconActive : item.icon"
                />
            </div>
        </div>
        <div ref="itemBg" class="chain_select__item_bg"></div>
    </div>
</template>

<script lang="ts" setup>
    interface IProps {
        options?: Array<any>;
        modelValue: any;
    }
    withDefaults(defineProps<IProps>(), {
        options: () => [],
        modelValue: () => {
            return {};
        }
    });

    const emits = defineEmits(['update:modelValue']);
    const itemBg: any = ref(null);
    const update = (item: any, e: any) => {
        itemBg.value.style.width = e.currentTarget.offsetWidth + 'px';
        itemBg.value.style.left = e.currentTarget.offsetLeft + 'px';
        emits('update:modelValue', item);
    };

    // const init = () => {
    //   console.log('chainselect init')
    //   let el: any = document.getElementsByClassName('chain_select__item_box_active')[0];
    //   el.click();
    // }
</script>

<style lang="less" scoped>
    .chain_select {
        position: relative;
        z-index: 1;
        display: flex;
        height: 40px;
        background: rgba(188, 178, 160, 0.09);
        border: 1px solid rgba(0, 0, 0, 0.09);
        border-radius: 8px;

        &__item_box {
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 0 11px;
            cursor: pointer;
            transition: linear 0.2s;

            &__text {
            }

            &__icon_box {
                width: 28px;
                height: 28px;

                &__icon {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        &__item_bg {
            position: absolute;
            left: 0;
            z-index: 2;
            height: 100%;
            background: #ffffff;
            border-radius: 8px;
            transition: ease 0.2s;
        }

        &__item_box_active {
            background: #ffffff;
            border-radius: 8px;

            &::before {
                display: none;
            }

            & + div::before {
                display: none;
            }
        }

        &__item_box:not(:first-child)::before {
            position: relative;
            right: 12px;
            width: 1px;
            height: 18px;
            background: rgba(0, 0, 0, 0.1);
            content: '';
        }

        &__item_box:not(:first-child) {
            margin-left: 2px;
        }
    }
</style>
