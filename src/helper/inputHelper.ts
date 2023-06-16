import { removePrefixZero } from '@/utils/string';

const handleDecimal = (value: string) => {
    // 1.只能输入数字和小数点
    let handleValue = value.replace(/[^0-9.]/g, '');
    // 2.如果一开始就输入小数点，替换成0.
    if (handleValue === '.') {
        handleValue = '0.';
    }
    // 3.如果不是0.需要去除前面的0
    if (value.length > 1 && value[1] !== '.') {
        // 去除前面的0
        handleValue = removePrefixZero(handleValue);
        // 如果去掉0之后，变成空的话，则给一个0，如用户输入00 => 0
        if (handleValue === '') {
            handleValue = '0';
        }
    }
    // 4.禁止出现两个小数点,如果出现保留第一个
    handleValue = handleValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    return handleValue;
};

// 小数点后保留两位
export const handleInputValue1 = (newValue: string, oldValue: string, decimalLength = 2) => {
    // 只能输入两位小数
    const splitArr = newValue.split('.');
    let isNeedShowTip = false;
    if (
        (splitArr[1] && splitArr[1].length > decimalLength) ||
        (splitArr.length > decimalLength && splitArr[1] && splitArr[1].length === decimalLength)
    ) {
        isNeedShowTip = true;
        return {
            handleValue: oldValue,
            isNeedShowTip
        };
    }
    const handleValue = handleDecimal(newValue);
    return {
        handleValue,
        isNeedShowTip
    };
};

// 自然数 0 < value < 364
export const handleInputValue2 = (
    newValue: string,
    oldValue: string,
    minValue = 0,
    maxValue = 364
) => {
    let isNeedShowTip = false;
    // 只能输入整数
    let handleValue = newValue.replace(/[^0-9]/g, '');
    // 大于0
    if (Number(handleValue) < minValue) {
        handleValue = '';
    }
    // 小于minRentPerLimit的整数
    if (Number(handleValue) > maxValue) {
        handleValue = oldValue;
        isNeedShowTip = true;
    }

    if (handleValue === '00') {
        handleValue = '0';
    } else if (handleValue !== '0') {
        handleValue = removePrefixZero(handleValue);
    }

    return {
        handleValue,
        isNeedShowTip
    };
};

// 小数点前后不能超过10位
export const handleInputValue3 = (newValue: string, oldValue: string, maxLength = 10) => {
    // 小数点前后不能超过10位,此时再输入需要给提示
    const valueMaxLength = newValue.includes('.') ? maxLength + 1 : maxLength;
    let isNeedShowTip = false;
    if (
        newValue.length > valueMaxLength ||
        (newValue[newValue.length - 1] === '.' && newValue.length === valueMaxLength)
    ) {
        isNeedShowTip = true;
        return {
            handleValue: oldValue,
            isNeedShowTip
        };
    }
    const handleValue = handleDecimal(newValue);
    return {
        handleValue,
        isNeedShowTip
    };
};
