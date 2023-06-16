export const handleHighLightWord = (
    originText: string,
    searchText: string
): { ishighLight: boolean; text: string }[] => {
    const res: { ishighLight: boolean; text: string }[] = [];
    if (!originText || !searchText) {
        return [
            {
                ishighLight: false,
                text: originText
            }
        ];
    }
    let originTextCopy = originText;
    const reg = new RegExp(searchText, 'ig');
    const matchArr = originTextCopy.match(reg);
    if (matchArr) {
        for (let i = 0; i < matchArr.length; i++) {
            const matchText = matchArr[i];
            let splitArray = originTextCopy.split(matchText);
            if (splitArray.length === 1) {
                res.push({
                    ishighLight: false,
                    text: splitArray[0]
                });
                break;
            } else {
                splitArray = [splitArray.shift() || '', splitArray.join(matchText)];
                splitArray.forEach((item, index) => {
                    if (index === 0) {
                        res.push({
                            ishighLight: false,
                            text: item
                        });
                    } else {
                        res.push({
                            ishighLight: true,
                            text: matchText
                        });
                        if (i === matchArr!.length - 1) {
                            res.push({
                                ishighLight: false,
                                text: item
                            });
                        } else {
                            originTextCopy = item;
                        }
                    }
                });
            }
        }
    } else {
        return [
            {
                ishighLight: false,
                text: originText
            }
        ];
    }
    return res;
};
