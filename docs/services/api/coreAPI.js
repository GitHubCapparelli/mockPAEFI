// docs/services/api/coreAPI.js

import { InMemory, Session, CurrentUserKey } from '../storage.js';

export class CoreAPI {
  initialized = false;
  initPromise = null;

  constructor(config) {
    this.user = Session.Get(CurrentUserKey);

    Object.assign(this, config);

    if (typeof this.historicoAPI === 'function') {
      this.historicoAPI = new this.historicoAPI();
    }
  }

  async Init() {
    if (this.initialized) return;

    if (!this.initPromise) {
      this.initPromise = fetch(this.dataPath)
        .then(r => r.json())
        .then(json => {
          const data = Array.isArray(json) ? json : (json[this.jsonRoot] || json.list || []);

          InMemory.InitStore({ [this.entity]: data });
          this.initialized = true;
        });
    }
    return this.initPromise;
  }

  get store() {
    if (!this.initialized) throw new Error(`${this.entity} not initialized`);
    return InMemory.GetAll(this.entity);
  }

  #validateAction(acao) {
    if (!['create', 'update', 'delete'].includes(acao)) {
      throw new Error(`[CoreAPI] Ação inválida: ${acao}`);
    }
  }

  #validateDTO(acao, dto, state) {
    this.#validateAction(acao);

    dto.prepare(acao, this.user.id);

    if (!dto.validateDTO()) {
      throw new Error(dto.errors.join('; '));
    }

    const validator = acao === 'create' 
                    ? this.validateCreate 
                    : acao === 'update' 
                    ? this.validateUpdate 
                    : this.validateDelete;

    if (validator && !validator.call(this, dto, state)) {
      throw new Error(dto.errors.join('; ') || 'Validação de domínio falhou');
    }
  }

  Create(payload, metadata) {
    if (!this.historicoAPI) throw new Error('HistoricoAPI não configurada');
    
    const previous = [...this.store];
    try {
      const dto = this.DTO.CreateInstance(payload);
      this.#validateDTO('create', dto, previous);

      const next = [...previous, Object.freeze(dto.toJSON())];

      InMemory.SetAll(this.entity, next);
      this.historicoAPI.Create(metadata);

      return dto;
    } catch (err) {
      InMemory.SetAll(this.entity, previous);
      throw err;
    }
  }

  Update(id, payload, metadata) {
    if (!this.historicoAPI) throw new Error('HistoricoAPI não configurada');

    const previous = [...this.store];
    try {
      const idx = previous.findIndex(x => x.id === id);
      if (idx === -1) throw new Error('Registro não encontrado');

      const dto = this.DTO.CreateInstance(payload);
      dto.id = id;

      this.#validateDTO('update', dto, previous);

      const next = [...previous];
      next[idx] = Object.freeze({ ...next[idx], ...dto });

      InMemory.SetAll(this.entity, next);
      this.historicoAPI.Create(metadata);

      return next[idx];
    } catch (err) {
      InMemory.SetAll(this.entity, previous);
      throw err;
    }
  }

  Delete(id, metadata, payload = null) {
    if (!this.historicoAPI) throw new Error('HistoricoAPI não configurada');

    const previous = [...this.store];
    try {
      if (payload) {
        const idx = previous.findIndex(x => x.id === id);
        if (idx === -1) throw new Error('Registro não encontrado');

        const dto = this.DTO.CreateInstance(payload);
        dto.id = id;

        this.#validateDTO('delete', dto, previous);

        const next = [...previous];
        next[idx] = Object.freeze({ ...next[idx], ...dto });

        InMemory.SetAll(this.entity, next);
      } else {
        InMemory.SetAll(this.entity, previous.filter(x => x.id !== id));
      }

      this.historicoAPI.Create(metadata);
      return true;

    } catch (err) {
      InMemory.SetAll(this.entity, previous);
      throw err;
    }
  }
}
