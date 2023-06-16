import { BigNumber } from 'bignumber.js';
import moveDecimalPoint from 'move-decimal-point';
import { DEFAULT_DISPLAY_TEXT } from '@/constants';

export const formatBigNumber = (value: string | number, num?: number) => {
    if (value == 0 || value === DEFAULT_DISPLAY_TEXT) {
        return value;
    }
    return new BigNumber(value).toFormat(num);
};

/**
 * @param moveNumber 正数右移，负数左移
 */
export const moveDecimal = (value: string | number, moveNumber: number) => {
    if (value == 0) {
        return value;
    }
    return moveDecimalPoint(value, moveNumber);
};

export const toPercentage = (value: string | number) => {
    return moveDecimal(value, 2) + '%';
};

// bigNumber的加减乘除
export const bigNumberAdd = (num1: string | number, num2: string | number): string => {
    return new BigNumber(num1).plus(num2).toString();
};

export const bigNumberSubtract = (num1: string | number, num2: string | number): string => {
    return new BigNumber(num1).minus(num2).toString();
};

export const bigNumberMultiply = (num1: string | number, num2: string | number): string => {
    if (isNaN(new BigNumber(num1).multipliedBy(num2).toNumber())) {
        return '0';
    } else {
        return new BigNumber(num1).multipliedBy(num2).toString();
    }
};

export const bigNumberDivide = (num1: string | number, num2: string | number): string => {
    return new BigNumber(num1).div(num2).toString();
};

export const bigNumberComparedTo = (num1: string | number, num2: string | number): number => {
    return new BigNumber(num1).comparedTo(num2);
};
