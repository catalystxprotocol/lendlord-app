export const formatAddress = (address: string, prefixNumber = 6, suffixNumber = 6) => {
    const fixCount = prefixNumber + suffixNumber;
    if (address && address.length > fixCount) {
        return `${address.substring(0, prefixNumber)}...${address.substring(
            address.length - suffixNumber
        )}`;
    } else if (address && address.length <= fixCount) {
        return address;
    }
    return '';
};

export const removePrefixZero = (text: string) => {
    if (!text) return '';
    return text.replace(/^0+/, '');
};
