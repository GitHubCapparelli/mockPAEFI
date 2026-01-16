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

  Create      = async (data)     => this.#exec(() => this.api.Create(data));
  Update      = async (id, data) => this.#exec(() => this.api.Update(id, data));
  Delete      = async (id)       => this.#exec(() => this.api.Delete(id));
  SoftDelete  = async (id, data) => this.#exec(() => this.api.SoftDelete(id, data));

  async #exec(fn) {
    try {
      return await fn();
    } catch (e) {
      console.error(e);
      return e;
    }
  }
}
