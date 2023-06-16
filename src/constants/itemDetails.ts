export const nftStatusEnum = {
    listed: 2,
    listedDeal: 3,
    idle: 1,
    idleOwnerMyself: 4
};

export const selectOptionsEnum = {
    all: 0,
    list: 1,
    rent: 3
};

export const itemActivityEventEnum = new Map([
    [1, 'List'],
    [2, 'Delist'],
    [3, 'Rent'],
    [4, 'Redeem']
]);
