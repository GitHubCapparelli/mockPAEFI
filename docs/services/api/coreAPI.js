// docs/services/api/coreAPI.js

import { InMemory, Session, CurrentUserKey }  from '../storage.js';
import { HistoricoDTO }                       from '../../data/factory/historicoDTO.js';

export class CoreAPI {
  initialized = false;
  initPromise = null;

  constructor(config) {
    this.user = Session.Get(CurrentUserKey);

    Object.assign(this, config);

    if (this.historicoAPI && typeof this.historicoAPI.Create !== 'function') {
      throw new Error('HistoricoAPI inválida ou não inicializada');
    }
  }

  async Init() {
    if (this.initialized) return;

    if (!this.initPromise) {
      this.initPromise = fetch(this.dataPath)
        .then(r => r.json())
        .then(json => {
          const data = Array.isArray(json)
            ? json
            : (json[this.jsonRoot] || json.list || []);

          InMemory.InitStore({ [this.entity]: data });
          this.initialized = true;
        });
    }
    return this.initPromise;
  }

  get store() {
    if (!this.initialized) {
      throw new Error(`${this.entity} not initialized`);
    }
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

    const validator = acao === 'create' ? this.validateCreate :
                      acao === 'update' ? this.validateUpdate :
                                          this.validateDelete;

    if (validator && !validator.call(this, dto, state)) {
      throw new Error(dto.errors.join('; ') || 'Validação de domínio falhou');
    }
  }

  #buildHistoricoDTO({ acao, before, after, metadata }) {
    const historico   = HistoricoDTO.CreateInstance({
      userID          : this.user.id,
      catalogoID      : this.entity,
      dataHora        : new Date().toISOString(),
      tipo            : metadata?.tipo ?? this.entity,
      acao,
      descricao       : metadata?.descricao ?? null,
      justificativa   : metadata?.justificativa ?? null,
      diff            : JSON.stringify({ before, after })
    });

    if (!historico.validateDTO()) throw new Error(historico.errors.join('; '));

    return historico;
  }

  Create(payload, metadata) {
    if (!this.historicoAPI) throw new Error('HistoricoAPI não configurada');

    const previous = [...this.store];
    try {
      const dto = this.DTO.CreateInstance(payload);
      this.#validateDTO('create', dto, previous);

      const persisted = Object.freeze(dto.toJSON());
      const next      = [...previous, persisted];

      const historico = this.#buildHistoricoDTO({
        acao      : 'create',
        before    : null,
        after     : persisted,
        metadata
      });

      InMemory.SetAll(this.entity, next);
      this.historicoAPI.Create(historico.toJSON());

      return dto;

    } catch (err) {
      InMemory.SetAll(this.entity, previous);
      throw err;
    }
  }

  Update(payload, metadata) {
    if (!this.historicoAPI)   throw new Error('HistoricoAPI não configurada');

    const previous = [...this.store];
    try {
      const id = payload?.id;
      if (!id)                throw new Error('ID obrigatório para update');

      const idx = previous.findIndex(x => x.id === id);
      if (idx === -1)         throw new Error('Registro não encontrado');

      const before  = previous[idx];

      const dto     = this.DTO.CreateInstance(payload);
      dto.id        = id;

      this.#validateDTO('update', dto, previous);

      const after   = Object.freeze({ ...before, ...dto.toJSON() });
      const next    = [...previous];
      next[idx]     = after;

      const historico = this.#buildHistoricoDTO({
        acao: 'update',
        before,
        after,
        metadata
      });

      InMemory.SetAll(this.entity, next);
      this.historicoAPI.Create(historico.toJSON());

      return after;

    } catch (err) {
      InMemory.SetAll(this.entity, previous);
      throw err;
    }
  }

  Delete({ id, payload = null }, metadata) {
    if (!this.historicoAPI)   throw new Error('HistoricoAPI não configurada');

    const previous = [...this.store];
    try {
      const idx = previous.findIndex(x => x.id === id);
      if (idx === -1)         throw new Error('Registro não encontrado');

      const before = previous[idx];
      let after = null;
      let next;

      if (payload) {
        const dto = this.DTO.CreateInstance(payload);
        dto.id    = id;

        this.#validateDTO('delete', dto, previous);

        after     = Object.freeze({ ...before, ...dto.toJSON() });
        next      = [...previous];
        next[idx] = after;
        
      } else {
        next      = previous.filter(x => x.id !== id);
      }

      const historico = this.#buildHistoricoDTO({
        acao: 'delete',
        before,
        after,
        metadata
      });

      InMemory.SetAll(this.entity, next);
      this.historicoAPI.Create(historico.toJSON());

      return true;

    } catch (err) {
      InMemory.SetAll(this.entity, previous);
      throw err;
    }
  }
}