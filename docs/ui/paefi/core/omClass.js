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
  constructor(api, onExecuted, onError = null) {
    this.api        = api;
    this.onExecuted = onExecuted;
    this.onError    = onError;

    api.Init();
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
      return false;
    }
  }
}

export class Modal {
  constructor({ id, title, onSaveRequested }) {
    this.id             = id;
    this.title          = title;
    this.saveRequested  = onSaveRequested;
    
    this.bodyElement    = null;
    this.init();
  }

  init() {
    this.renderStructure();
    $('#btnConfirm').on('click', () => this.submit());
  }

  renderStructure() {
    const $modalRoot = $('#modal-root').empty();
    const $modal     = $('<div>', { class: 'modal fade', id: this.id });
    const $dialog    = $('<div>', { class: 'modal-dialog modal-lg' });
    const $content   = $('<div>', { class: 'modal-content' });
    
    const $header    = $('<div>', { class: 'modal-header' })
      .append($('<h5>', { class: 'modal-title', text: this.title }) );
    
    const $body      = $('<div>', { class: 'modal-body' })
      .append($('<span>', { class: 'text-mute', text: '[form goes here...]' }) );

    const $footer = $('<div>', { class: 'modal-footer' })
      .append(
        $('<button>', { class: 'btn btn-secondary', type: 'button', 'data-bs-dismiss': 'modal', text: 'Cancelar' })
        ,
        $('<button>', { class: 'btn btn-primary', id: 'btnConfirm', text: 'Salvar' })
    );

    $content.append($header, $body, $footer);
    $dialog.append($content);
    $modal.append($dialog);
    $modalRoot.append($modal);  

    this.bodyElement = $('#modal-body');
    return $body;
  }
  
  open(data = null) {
    this.render(data);
    $(`#${this.id}`).modal('show');
  }
  close()       { $(`#${this.id}`).modal('hide'); }

  collect()     { throw new Error('collect() must be implemented'); }
  render(data)  { throw new Error('render() must be implemented'); }

  async submit(id = null) {
    const payload = this.collect();

  this.saveRequested(payload);

//    const ok = (this.mode === 'create')
//             ? await this.command.Create(payload)
//             : await this.command.Update(id, payload);
//
//    if (ok) this.close();
  }
}
