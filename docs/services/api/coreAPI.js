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

  GetAll(request) {
    const result  = [...InMemory.GetAll(this.entity)];
    const orderBy = this.defaultOrderBy;
    const order   = 'asc';

    if (orderBy) {
      result.sort((a, b) =>
        order === 'asc'
          ? String(a[orderBy]).localeCompare(String(b[orderBy]), 'pt-BR', { sensitivity: 'base' })
          : String(b[orderBy]).localeCompare(String(a[orderBy]), 'pt-BR', { sensitivity: 'base' })
      );
    }
    return result;
  }

  GetById(request) {
    const id = request.payload?.id;
    if (!id)   throw new Error('ID obrigatório');

    return InMemory.GetAll(this.entity).find(x => x.id === id) ?? null;
  }

  GetPaginated(request) {
    let data = this.applyFilters(this.GetAll(request), request.filters);

    const totalRecords  = data.length;
    const totalPages    = Math.max(1, Math.ceil(totalRecords / request.pageSize));
    const currentPage   = Math.min(Math.max(page, 1), totalPages);

    const start = (currentPage - 1) * request.pageSize;
    const end   = start + pageSize;

    return {
      data        : data.slice(start, end),
      pagination  : { page: currentPage, request.pageSize, totalRecords, totalPages }
    };
  }

  Create(request) {
    if (!this.historicoAPI) throw new Error('HistoricoAPI não configurada');

    const previous = [...this.store];
    try {
      const dto = this.DTO.CreateInstance(request.payload);
      this.#validateDTO('create', dto, previous);

      if (previous.some(x => x.id === dto.id)) throw new Error('ID duplicado');

      const persisted = Object.freeze(dto.toJSON());
      const next      = [...previous, persisted];

      const historico = this.#buildHistoricoDTO({
        acao      : 'create',
        before    : null,
        after     : persisted,
        metadata  : request.metadata
      });
      
      InMemory.SetAll(this.entity, next);
      this.historicoAPI.Create(historico.toJSON());

      return persisted;

    } catch (err) {
      InMemory.SetAll(this.entity, previous);
      throw err;
    }
  }

  Update(request) {
    if (!this.historicoAPI)   throw new Error('HistoricoAPI não configurada');

    const previous = [...this.store];
    try {
      const id = request.payload?.id;
      if (!id)                throw new Error('ID obrigatório');

      const idx = previous.findIndex(x => x.id === id);
      if (idx === -1)         throw new Error('Registro não encontrado');

      const before  = previous[idx];

      const dto     = this.DTO.CreateInstance(request.payload);
      dto.id        = id;

      this.#validateDTO('update', dto, previous);

      const after   = Object.freeze({ ...before, ...dto.toJSON() });
      const next    = [...previous];
      next[idx]     = after;

      const historico = this.#buildHistoricoDTO({
        acao: 'update',
        before,
        after,
        metadata: request.metadata
      });

      InMemory.SetAll(this.entity, next);
      this.historicoAPI.Create(historico.toJSON());

      return after;

    } catch (err) {
      InMemory.SetAll(this.entity, previous);
      throw err;
    }
  }

  Delete(request) {
    if (!this.historicoAPI)   throw new Error('HistoricoAPI não configurada');

    const previous = [...this.store];
    try {
      const id  = request.payload.data ? request.payload.data.id : request.payload.id;
      const idx = previous.findIndex(x => x.id === id);
      if (idx === -1)         throw new Error('Registro não encontrado');

      const before = previous[idx];
      let after = null;
      let next;

      if (request.payload.data) {         // soft delete
        const dto = this.DTO.CreateInstance(request.payload.data);
        dto.id    = id;

        this.#validateDTO('delete', dto, previous);

        after     = Object.freeze({ ...before, ...dto.toJSON() });
        next      = [...previous];
        next[idx] = after;
        
      } else if (request.payload.id) {    // hard delete
        next      = previous.filter(x => x.id !== request.payload.id);

      } else {
        throw new Error('Delete request should have either data or id on the payload');
      }

      const historico = this.#buildHistoricoDTO({
        acao: 'delete',
        before,
        after,
        metadata : request.metadata
      });

      InMemory.SetAll(this.entity, next);
      this.historicoAPI.Create(historico.toJSON());

      return true;

    } catch (err) {
      InMemory.SetAll(this.entity, previous);
      throw err;
    }
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
      catalogoID      : metadata.catalogoID,
      dataHora        : new Date().toISOString(),
      tipo            : metadata.tipo,
      acao,
      descricao       : metadata?.descricao     ?? null,
      justificativa   : metadata?.justificativa ?? null,
      diff            : JSON.stringify({ before, after })
    });

    if (!historico.validateDTO()) throw new Error(historico.errors.join('; '));

    return historico;
  }
}