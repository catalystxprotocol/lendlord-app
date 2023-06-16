<template>
    <!-- element plus 不能满足当前产品需求，使用了ant design vue -->
    <a-date-picker
        v-model:value="dateValue"
        class="my_date_picker"
        dropdown-class-name="my_date_dropdown"
        format="MMM-DD-YYYY   HH:mm:ss"
        :disabled-date="disabledDate"
        :disabled-time="disabledDateTime"
        :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
        :allow-clear="false"
        :input-read-only="true"
        placeholder=""
        :show-now="false"
        @change="onChange"
    >
        <template #suffixIcon>
            <i class="iconfont icon-rili"></i>
        </template>
    </a-date-picker>
</template>

<script setup lang="ts">
    import dayjs, { Dayjs } from 'dayjs';

    interface IProps {
        date: Dayjs;
        currentTime: Dayjs;
    }

    const props = withDefaults(defineProps<IProps>(), {});

    const emit = defineEmits<{
        (e: 'update:date', value: Dayjs): void;
    }>();

    const dateValue = ref<Dayjs>(props.date);

    watch(dateValue, (newValue) => {
        emit('update:date', newValue);
    });

    const range = (start: number, end: number) => {
        const result = [];

        for (let i = start; i < end; i++) {
            result.push(i);
        }

        return result;
    };

    const maxTime = computed<Dayjs>(() => {
        return dayjs(props.currentTime).add(1, 'year');
    });

    const disabledDate = (current: Dayjs) => {
        const min = dayjs(props.currentTime).startOf('day');
        const max = maxTime.value.endOf('day');
        // console.log(min.format('YYYY-MM-DD HH:mm:ss'), max.format('YYYY-MM-DD HH:mm:ss'));
        return current && (current < min || current > max);
    };

    const getSameDate = (value1: Dayjs, value2: Dayjs) => {
        return (
            value1.year() === value2.year() &&
            value1.month() === value2.month() &&
            value1.date() === value2.date()
        );
    };

    const disabledDateTime = (current: Dayjs) => {
        const hours = props.currentTime.hour();
        const minutes = props.currentTime.minute();
        const seconds = props.currentTime.second();
        if (current && getSameDate(props.currentTime, current)) {
            return {
                disabledHours: () => range(0, hours),
                disabledMinutes: (selectedHour: number) => {
                    return selectedHour <= hours ? range(0, minutes) : [];
                },
                disabledSeconds: (selectedHour: number, selectedMinute: Ref<number>) => {
                    return selectedHour <= hours && selectedMinute.value <= minutes
                        ? range(0, seconds)
                        : [];
                }
            };
        } else if (current && getSameDate(maxTime.value, current)) {
            return {
                disabledHours: () => range(hours + 1, 24),
                disabledMinutes: (selectedHour: number) => {
                    return selectedHour <= hours ? range(minutes + 1, 60) : [];
                },
                disabledSeconds: (selectedHour: number, selectedMinute: Ref<number>) => {
                    return selectedHour <= hours && selectedMinute.value <= minutes
                        ? range(seconds + 1, 60)
                        : [];
                }
            };
        }
        return {
            disabledHours: () => [],
            disabledMinutes: () => [],
            disabledSeconds: () => []
        };
    };

    const inputColor = ref('rgba(0, 0, 0, 0.5)');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onChange = (date: Dayjs, dateString: string) => {
        if (date.unix() < props.currentTime.unix()) {
            dateValue.value = props.currentTime;
        } else if (date.unix() > maxTime.value.unix()) {
            dateValue.value = maxTime.value;
        }
        inputColor.value = 'rgba(0, 0, 0, 1)';
    };
</script>

<style lang="less" scoped>
    .my_date_picker.ant-picker {
        width: 100%;
        height: 100%;
        padding: 11px 12px;
        background: var(--bj-background-color-third);
        border: 1px solid var(--bj-border-color);
        border-radius: var(--border-radius-normal);

        :deep(.ant-picker-input) {
            & > input {
                /* stylelint-disable-next-line value-keyword-case */
                color: v-bind(inputColor);
            }

            .ant-picker-suffix {
                .iconfont {
                    padding-left: 12px;
                    color: var(--bj-primary-color);
                    font-size: 20px;
                    border-left: 1px solid var(--bj-border-color);
                }
            }
        }

        :deep(.ant-picker-input-placeholder) {
            & > input {
                color: #bfbfbf;
            }
        }
    }

    .my_date_picker.ant-picker-focused {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--bj-primary-color);
        box-shadow: none;
    }
</style>
