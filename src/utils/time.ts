import { formatBigNumber } from './calculate';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

/**
 * @param time millisecond
 */
export const dayjsFormatDate = (time: dayjs.ConfigType, format = 'MMM-DD-YYYY HH:mm:ss') => {
    return dayjs(time).format(format);
};

/**
 * @param time millisecond
 */
export const dayjsFormatDateToDay = (time: dayjs.ConfigType, format = 'MMM-DD-YYYY') => {
    return dayjsFormatDate(time, format);
};

/**
 * @param time millisecond
 */
export const dayjsFormatDateToMonth = (time: dayjs.ConfigType, format = 'MMM YYYY') => {
    return dayjs(time).format(format);
};

/**
 * @param time millisecond
 */
export const dayjsFormatDateToMinutes = (time: dayjs.ConfigType, format = 'HH:mm') => {
    return dayjsFormatDate(time, format);
};

/**
 *
 * @param time seconds
 * @returns 1m ago / 1h ago / 1d ago
 */
export const formatLastUpdated = (time: string | number) => {
    if (time === 0) return '--';
    const obj = dayjs.duration(dayjs().unix() - Number(time), 's') as any;
    const { seconds, days, months, years, minutes, hours } = obj.$d;

    let ago = '';
    if (days || years || months) {
        const formatDays = formatBigNumber(days + months * 30 + years * 365, 0);
        ago = `${formatDays} ${formatDays == '1' ? 'day' : 'days'}`;
    } else if (hours) {
        ago = `${hours}h`;
    } else if (minutes) {
        ago = `${minutes}m`;
    } else if (seconds) {
        ago = `${seconds}s`;
    } else {
        ago = '0s';
    }

    return `${ago} ago`;
};

export const getTimestamp = () => {
    return Math.floor(new Date().getTime() / 1000);
};

export const formatTimestampToDay = (time: number, ceil = true) => {
    if (ceil) return Math.ceil(time / (60 * 60 * 24));
    return Math.floor(time / (60 * 60 * 24));
};

export const formatTimestampInterval = (time1: number, time2: number, showUnit = true) => {
    if (formatTimestampToDay(time1) == formatTimestampToDay(time2, false)) {
        if (formatTimestampToDay(time1) <= 1) {
            return `${formatTimestampToDay(time1)}${showUnit ? ' Day' : ''}`;
        }
        return `${formatTimestampToDay(time1)}${showUnit ? ' Days' : ''}`;
    }
    return `${formatTimestampToDay(time1)} - ${formatTimestampToDay(time2, false)}${
        showUnit ? ' Days' : ''
    }`;
};
