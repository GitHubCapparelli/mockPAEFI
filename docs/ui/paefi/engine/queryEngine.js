// ui/paefi/engine/queryEngine.js

export function QueryEngine({
    fetch,
    onData,
    onPagination,
    onError,
    pageSize = 10
}) {
    const state = {
        page: 1,
        pageSize,
        filters: {},
        loading: false
    };

    async function load() {
        if (state.loading) return;

        state.loading = true;
        try {
            const result = await fetch({
                page: state.page,
                pageSize: state.pageSize,
                filters: state.filters
            });

            onData?.(result.data);
            onPagination?.(result.pagination);
        } catch (err) {
            console.error('[QueryEngine]', err);
            onError?.(err);
        } finally {
            state.loading = false;
        }
    }

    function setFilters(filters) {
        state.filters = { ...filters };
        state.page = 1;
        load();
    }

    function goToPage(page) {
        if (!page || page < 1 || page === state.page) return;
        state.page = page;
        load();
    }

    function reset() {
        state.page = 1;
        state.filters = {};
        load();
    }

    return {
        load,
        setFilters,
        goToPage,
        reset
    };
}
