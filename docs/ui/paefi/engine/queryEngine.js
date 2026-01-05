// ui/paefi/engine/queryEngine.js
export class QueryEngine {

    constructor({ queryFn, initialState = {} }) {
        this.queryFn = queryFn;

        this.state = {
            page: 1,
            pageSize: initialState.pageSize || 10,
            filters: {},
            totalItems: 0,
            totalPages: 0
        };

        this.lastResult = null;
    }

    /* Core execution */
    async execute() {
        const { page, pageSize, filters } = this.state;

        const result = await this.queryFn({
            page,
            pageSize,
            filters
        });

        this.state.totalItems = result.totalItems ?? 0;
        this.state.totalPages = Math.max(
            1,
            Math.ceil(this.state.totalItems / this.state.pageSize)
        );

        this.lastResult = result;
        return result;
    }

    /* Pagination */
    async next() {
        if (this.state.page < this.state.totalPages) {
            this.state.page++;
            return this.execute();
        }
        return this.lastResult;
    }

    async prev() {
        if (this.state.page > 1) {
            this.state.page--;
            return this.execute();
        }
        return this.lastResult;
    }

    async goTo(page) {
        const target = Math.max(1, Math.min(page, this.state.totalPages));
        this.state.page = target;
        return this.execute();
    }

    /* Filters */
    async setFilters(filters) {
        this.state.filters = { ...filters };
        this.state.page = 1;
        return this.execute();
    }

    async reset() {
        this.state.page = 1;
        this.state.filters = {};
        return this.execute();
    }

    /* Read-only helpers */
    get pagination() {
        return {
            page: this.state.page,
            pageSize: this.state.pageSize,
            totalItems: this.state.totalItems,
            totalPages: this.state.totalPages
        };
    }
}