// ui paefi core omClass.js

export class QueryEngine {
  constructor(api, onLoaded) {
      this.api        = api;
      this.page       = 1;
      this.pageSize   = 5;
      this.totalItems = 0;
      this.totalPages = 0;
      
      this.lastResult = null;
      this.lastFilters = null;

      this.onLoaded   = onLoaded;

      api.Init();
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

  async GetPaginated(filters) {
    this.page = 1;
    const response = await this.CallGetPaginated(filters);
    this.onLoaded(response);
  }

  async Clear() {
    this.page = 1;
    const response = await this.CallGetPaginated();
    this.onLoaded(response);
  }

  async Navigate(e, page) {
    e.preventDefault();

    const x = Number(page);
    if (!x || x === this.page) return;

    this.page = x;
    const response = await this.CallGetPaginated();
    this.onLoaded(response);
  }
}

export class CommandEngine {
  constructor(api, onExecuted, onError = null) {
    this.api        = api;
    this.onExecuted = onExecuted;
    this.onError    = onError;
  }

  Create      = async (data)     => this.#exec(() => this.api.Create(data));
  Update      = async (id, data) => this.#exec(() => this.api.Update(id, data));
  Delete      = async (id)       => this.#exec(() => this.api.Delete(id));
  SoftDelete  = async (id, data) => this.#exec(() => this.api.SoftDelete(id, data));

  async #exec(fn) {
    try {
      await fn();
      this.onExecuted?.();
      return true;
    } catch (e) {
      this.onError?.(e);
      console.error(e);
      return false;
    }
  }
}
