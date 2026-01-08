// ui.paefi.core.objectModel

export class QueryEngine {
  constructor(api, onLoaded) {
      this.api        = api;
      this.page       = 1;
      this.pageSize   = 5;
      this.totalItems = 0;
      this.totalPages = 0;
      this.lastResult = null;
      this.onLoaded   = onLoaded;
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

  async loadData(filters) {
    const response = await this.GetPaginated(filters);
    this.onLoaded(response);
  }
}

export class CommandEngine {
  constructor(api, onExecuted) {
    this.api        = api;
    this.onExecuted = onExecuted;

    api.Init();
  }

  async Create(data) {
    await this.api.Create(data);
    this.onExecuted();
  }

  async Update(id, data) {
    await this.api.Update(id, data);
    this.onExecuted();
  }
  
  async Delete(id, data) {
    await this.api.SoftDelete(id, data);
    this.onExecuted();
  }
}

class baseModal {
  constructor(title, api, onCommand) {
    this.api       = api;
    this.title     = title;
    this.onCommand = onCommand;

    api.Init();
  }
}