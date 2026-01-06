// ui.paefi.core.objectModel

export class QueryEngine {

    constructor(api, renderer, fnRefresh) {
        this.api        = api;
        this.page       = 1;
        this.pageSize   = 5;
        this.totalItems = 0;
        this.totalPages = 0;
        this.lastResult = null;
        this.render     = renderer;
        this.refresh    = fnRefresh;
        api.Init();
    }

    async GetPaginated(filters) {
        const response = await this.api.GetPaginated({
            page     : this.page,
            pageSize : this.pageSize,
            filters  : filters
        });
        this.lastResult = response;
        return response;
    }

    async loadData(filters) {
        const response = await this.GetPaginated(filters);
        this.refresh(response);
    }

    async Apply(filters) {
      this.page = 1;
      await this.loadData(filters);
    }

    async Clear() {
      this.page = 1;
      await this.loadData();
    }

    async Navigate(e, page) {
      e.preventDefault();

      const x = Number(page);
      if (!x || x === this.page) return;

      this.page = x;
      await this.loadData();
    }
}