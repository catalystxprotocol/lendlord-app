// '12' => '0xc'
export const decimalismToHex = (origin: string): string => {
    if (!origin) return origin;
    return '0x' + Number(origin).toString(16);
};

// '0xc' => 12
export const hexToDecimalism = (origin: string): string => {
    if (!origin.startsWith('0x')) return origin;
    return parseInt(origin).toString();
};
