import { InMemory }              from '../storage.js';
import { UsuariosServidoresAPI } from './usuariosServidoresAPI.js';
import { UnidadesAPI }           from './unidadesAPI.js';

export const CoreAPI = {
  async InitAll() {
    await Promise.all([
      UsuariosServidoresAPI.Init(),
      UnidadesAPI.Init()
    ]);
  }
};

export function CreateCoreAPI({
  entity,
  dataPath,
  jsonRoot,
  defaultOrderBy,
  createDTO,
  validateCreate,
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
      const response = await fetch(dataPath);
      const json = await response.json();

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
    const end   = start + pageSize;

    return {
      data: data.slice(start, end),
      pagination: { page: currentPage, pageSize, totalRecords, totalPages }
    };
  }

  function Create(rawData) {
    ensureInitialized();

    const data = InMemory.GetAll(entity);
    const dto  = createDTO(rawData);

    if (validateCreate) {
      validateCreate(dto, data);
    }

    InMemory.SetAll(entity, [...data, dto]);
    return dto;
  }

  function Update(id, rawData) {
    ensureInitialized();

    const data = InMemory.GetAll(entity);
    const idx  = data.findIndex(x => x.id === id);
    if (idx === -1) return null;

    const next = [...data];
    next[idx]  = { ...next[idx], ...rawData };

    InMemory.SetAll(entity, next);
    return next[idx];
  }

  function SoftDelete(id, rawData) {
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
    return true;
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

