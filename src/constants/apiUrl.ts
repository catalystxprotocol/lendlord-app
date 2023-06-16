export const urlReplacePlaceholder = '=%=';

const versionTag = {
    v1: '/v1',
    v2: '/v2'
};

export const API_URL = {
    // v1
    collectionSum: `${versionTag.v1}/home/collection_sum`,
    chainConfig: `${versionTag.v1}/chain/configs`,
    userCollectionList: `${versionTag.v1}/user/${urlReplacePlaceholder}/collections`,
    nftList: `${versionTag.v1}/user/${urlReplacePlaceholder}/nfts`,
    nftDetail: `${versionTag.v1}/nft/detail/`,
    nftActivities: `${versionTag.v1}/nft/activities`,
    nftLendInfo: `${versionTag.v1}/nft/lend_info/`,

    // v2
    collectionList: `${versionTag.v2}/collection/list`,
    searchCollection: `${versionTag.v2}/collection/search`,
    collectionInfo: `${versionTag.v2}/collection/info`,
    searchNftId: `${versionTag.v2}/collection/nft_id`,
    nftListFromCollection: `${versionTag.v2}/collection/details`,
    nftActivityFromCollection: `${versionTag.v2}/collection/nft_activity`
};
