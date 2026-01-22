// ui paefi core omClass.js

export class QueryEngine {
  constructor(api) {
      this.api        = api;
      this.page       = 1;
      this.pageSize   = 5;
      this.totalItems = 0;
      this.totalPages = 0;
      
      this.lastResult  = null;
      this.lastFilters = null;
  }

  async CallGetPaginated(filters = this.lastFilters) {
      const response = await this.api.GetPaginated({
          page     : this.page,
          pageSize : this.pageSize,
          filters  : filters
      });
      this.lastResult = response;
      return response;
  }

  async GetPaginated(filters = null) {
    this.page = 1;
    return await this.CallGetPaginated(filters);
  }

  async Navigate(e, page) {
    e.preventDefault();

    const x = Number(page);
    if (!x || x === this.page) return;

    this.page = x;
    return await this.CallGetPaginated();
  }
}

export class CommandEngine {
  constructor(api) {
    this.api        = api;
  }
  Create  = async (request) => this.api.Create(request);
  Update  = async (request) => this.api.Update(request);
  Delete  = async (request) => this.api.Delete(request);
}
