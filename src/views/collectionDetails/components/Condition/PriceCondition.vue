<template>
    <BaseCondition
        ref="BaseConditionComRef"
        class="price_condition"
        title="Price"
        :show-token-dropdown="true"
        :input-text="inputText"
        :error-text="errorText"
        :handle-input-value="handleInputValue1"
        @price-supply-fn="supplyFn"
    />
</template>

<script setup lang="ts">
    import BaseCondition from './BaseCondition.vue';
    import { PriceSupplyFnParams } from '@/types/interface/collectionDetails.interface';
    import { handleInputValue1 } from '@/helper/inputHelper';

    const emit = defineEmits<{
        (e: 'supplyFn', params: PriceSupplyFnParams): void;
    }>();

    const inputText = 'Maximum input of two decimal places';
    const errorText = 'Minimum must be less than maximum';

    const supplyFn = (params: PriceSupplyFnParams) => {
        emit('supplyFn', params);
    };

    const BaseConditionComRef = ref();
    const reset = () => {
        BaseConditionComRef.value?.reset();
    };

    defineExpose({
        reset
    });
</script>

<style lang="less" scoped>
    .price_condition {
    }
</style>
