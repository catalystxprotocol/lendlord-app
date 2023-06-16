<template>
    <BaseCondition
        ref="BaseConditionComRef"
        class="rental_duraton_condition"
        title="Rental Duration"
        :show-token-dropdown="false"
        :input-text="inputText"
        :error-text="errorText"
        :min-rent-per-limit="minRentPerLimit"
        :handle-input-value="handleInputValue2"
        @rental-dur-supply-fn="supplyFn"
    />
</template>

<script setup lang="ts">
    import BaseCondition from './BaseCondition.vue';
    import { RentalDurationParams } from '@/types/interface/collectionDetails.interface';
    import { handleInputValue2 } from '@/helper/inputHelper';

    const emit = defineEmits<{
        (e: 'supplyFn', params: RentalDurationParams): void;
    }>();

    const inputText = 'The maximum number that can be entered is 364';
    const errorText = 'Minimum must be less than maximum';
    const minRentPerLimit = 364;

    const supplyFn = (params: RentalDurationParams) => {
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
    .rental_duraton_condition {
    }
</style>
