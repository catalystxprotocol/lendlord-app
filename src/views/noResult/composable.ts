export const useCollectionIdAndTokenId = () => {
    const route = useRoute();
    const router = useRouter();
    const goCollection = () => {
        router.push(`/collection/${route.params.collectionId}`);
    };
    return {
        route,
        goCollection
    };
};
