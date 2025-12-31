import { InMemory }         from '../storage.js';
import { CreateUnidadeDTO } from '../../data/factory/unidadeDTO.js';

const ENTITY    = 'unidades';
const DATA_PATH = '/mockPAEFI/data/mock/unidades.json';

let initialized = false;
let initPromise = null;

export const UnidadesAPI = (function () {
    'use strict';

    async function init() {
        if (initialized) return;
        if (initPromise) return initPromise;

        initPromise = (async () => {
            const data = await loadInitialData();
            InMemory.InitStore({ [ENTITY]: data });
            initialized = true;
        })();

        return initPromise;
    }

    async function loadInitialData() {
        try {
            const response = await fetch(DATA_PATH);
            const json = await response.json();

            let list = [];
            if (Array.isArray(json)) list = json;
            else if (Array.isArray(json.list)) list = json.list;
            else if (Array.isArray(json.unidades)) list = json.unidades;

            return list;
        } catch (err) {
            console.error('Error loading usuariosServidores:', err);
            return [];
        }
    }

    function getAll({ orderBy = 'sigla', order = 'asc' } = {}) {
        ensureInitialized();
        const source = InMemory.GetAll(ENTITY);
        const result = [...source]; 

        if (orderBy === 'sigla') {
            result.sort((a, b) =>
                order === 'asc'
                    ? a.sigla.localeCompare(b.sigla, 'pt-BR', { sensitivity: 'base' })
                    : b.sigla.localeCompare(a.sigla, 'pt-BR', { sensitivity: 'base' })
            );
        }

        return result;
    }

    function getById(id) {
        ensureInitialized();
        const data = InMemory.GetAll(ENTITY);
        return data.find(u => u.id === id) ?? null;
    }

    function getPaginated({ page = 1, pageSize = 10, filters = {} }) {
        ensureInitialized();
        let data = getAll();

        if (filters.funcao) data = data.filter(u => u.funcao === filters.funcao);

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

    function create(rawData) {
        ensureInitialized();
        const data = InMemory.GetAll(ENTITY);
        const dto  = CreateUnidadeDTO(rawData);
        if (data.some(u => u.sigla === dto.sigla)) {
            throw new Error('Sigla já existente');
        }

        InMemory.SetAll(ENTITY, [...data, dto]);
        return dto;
    }

    function update(id, rawData) {
        ensureInitialized();
        const data = InMemory.GetAll(ENTITY);
        const idx = data.findIndex(u => u.id === id);
        if (idx === -1) return null;

        const updated = {
            ...data[idx],
            ...rawData
        };

        const next = [...data];
        next[idx]  = updated;

        InMemory.SetAll(ENTITY, next);
        return updated;
    }

    function softDelete(id, rawData) {
        ensureInitialized();
        const data = InMemory.GetAll(ENTITY);
        const idx = data.findIndex(u => u.id === id);
        if (idx === -1) return null;

        const next = [...data];
        next[idx] = {
            ...next[idx],
            ...rawData
        };

        InMemory.SetAll(ENTITY, next);
        return next[idx];
    }

    function ensureInitialized() {
        if (!initialized) {
            throw new Error('UnidadesAPI used before init()');
        }
    }

    return {
        init,
        getAll,
        getById,
        getPaginated,
        create,
        update,
        softDelete
    };
})();
