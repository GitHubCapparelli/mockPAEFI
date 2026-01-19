// docs services api coreAPI

import { InMemory }   from '../storage.js';
import * as API       from './_index.js';

export function CoreAPI({
  entity,
  dataPath,
  jsonRoot,
  defaultOrderBy,
  DTO,
  validateCreate,
  historicoAPI,
  applyFilters = (data, filters) => data
}) {

  // Init
  let initialized = false;
  let initPromise = null;

  async function Init() {
    if (initialized) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      const data = await loadInitialData();
      InMemory.InitStore({ [entity]: data });
      initialized = true;
    })();

    return initPromise;
  }

  async function loadInitialData() {
    try {
      const response  = await fetch(dataPath);
      const json      = await response.json();

      if (Array.isArray(json)) return json;
      if (jsonRoot && Array.isArray(json[jsonRoot])) return json[jsonRoot];
      if (Array.isArray(json.list)) return json.list;

      return [];
    } catch (err) {
      console.error(`Error loading ${entity}:`, err);
      return [];
    }
  }

  function ensureInitialized() {
    if (!initialized) {
      throw new Error(`${entity} API used before init()`);
    }
  }

  // CRUD
  function GetAll({ orderBy = defaultOrderBy, order = 'asc' } = {}) {
    ensureInitialized();

    const response = [...InMemory.GetAll(entity)];

    if (orderBy) {
      response.sort((a, b) =>
        order === 'asc'
          ? String(a[orderBy]).localeCompare(String(b[orderBy]), 'pt-BR', { sensitivity: 'base' })
          : String(b[orderBy]).localeCompare(String(a[orderBy]), 'pt-BR', { sensitivity: 'base' })
      );
    }
    return response;
  }

  function GetById(id) {
    ensureInitialized();
    return InMemory.GetAll(entity).find(x => x.id === id) ?? null;
  }

  function GetPaginated({ page = 1, pageSize = 10, filters = {} }) {
    ensureInitialized();

    let data = applyFilters(GetAll(), filters);

    const totalRecords = data.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
    const currentPage = Math.min(Math.max(page, 1), totalPages);

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: data.slice(start, end),
      pagination: { page: currentPage, pageSize, totalRecords, totalPages }
    };
  }

  function Create(data) {
    ensureInitialized();

    const request = enforceOnRequest(data);
    if (request.error)     return request;

    const tx = beginTransaction();
    try {
      const dto = EntityCreate(request.payload);   
      AddHistory(request.metadata)                

      commit(tx);
      return dto;

    } catch (e) {
      rollback(tx);
      return { error: e.message }; 
    }
  }

  function enforceOnRequest(data) {
    if (!data || !data.payload || !data.metadata) {
      return { error: 'Invalid request structure' };
    }

    return {
      payload  : data.payload,
      metadata : data.metadata
    };
  }

  function AddHistory(metadata) {
    historicoAPI.Create(metadata);
  }

  function Update(id, data) {
    ensureInitialized();

    // validate request (ensure contracts [schemas]...)
    // data.metadata & data.payload

    // these must be atomic (ACID) !!!
    //{
    AddHistory(data.metadata);
    EntityUpdate(id, data.payload);
    //}

    // return response to the UI

  }

  function SoftDelete(id, data) {
    return Update(id, data);
  }

  function HardDelete(id) {
    ensureInitialized();

    const data = InMemory.GetAll(entity);
    const next = data.filter(x => x.id !== id);

    if (next.length === data.length) {
      return null; // not found
    }

    InMemory.SetAll(entity, next);

    // AddHistory(data)  <--- is this it ? doesn't feel so...
    return true;
  }

  function EntityCreate(rawData) {
    ensureInitialized();

    const data = InMemory.GetAll(entity);
    const dto  = DTO.Create(rawData);

    if (validateCreate) {
      validateCreate(dto, data);
    }

    InMemory.SetAll(entity, [...data, dto]);
    return dto;
  }

  function EntityUpdate(id, rawData) {
    const data = InMemory.GetAll(entity);
    const idx = data.findIndex(x => x.id === id);
    if (idx === -1) return null;

    const next = [...data];
    next[idx] = { ...next[idx], ...rawData };

    InMemory.SetAll(entity, next);
    return next[idx];
  }

  return {
    Init,
    GetAll,
    GetById,
    GetPaginated,
    Create,
    Update,
    SoftDelete,
    HardDelete
  };
}


export const AllAPIs = {
  async Init() {
    await Promise.all([
      API.UsuariosServidoresAPI.Init(),
      API.UnidadesAPI.Init(),
      API.CatalogosAPI.Init(),
      API.HistoricoAPI.Init()
    ]);
  }
};
