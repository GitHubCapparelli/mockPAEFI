import { InMemory }         from '../storage.js';
import { CreateUnidadeDTO } from '../../data/factory/unidadeDTO.js';

const ENTITY    = 'unidades';
const DATA_PATH = '/mockPAEFI/data/mock/unidades.json';

export const UnidadesAPI = (function () {
    'use strict';

    async function init() {
        const data = await loadInitialData();
        InMemory.InitStore({ [ENTITY]: data });
        return true;
    }

    async function loadInitialData() {
        try {
            const response = await fetch(DATA_PATH);
            const json = await response.json();

            let list = [];
            if (Array.isArray(json)) list = json;
            else if (Array.isArray(json.list)) list = json.list;
            else if (Array.isArray(json.unidades)) list = json.unidades;

            return list.map(u => CreateUnidadeDTO(u));
        } catch (err) {
            console.error('Error loading usuariosServidores:', err);
            return [];
        }
    }

    async function getAll({ orderBy = 'sigla', order = 'asc' } = {}) {
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

    async function getById(id) {
        const data = InMemory.GetAll(ENTITY);
        return data.find(u => u.id === id) ?? null;
    }

    async function getPaginated({ page = 1, pageSize = 10, filters = {} }) {
        let data = await getAll();

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

    async function create(incluidoPor, rawData) {
        const dto = CreateUnidadeDTO({
            ...rawData,
            criadoPor: incluidoPor
        });

        const data = InMemory.GetAll(ENTITY);

        if (data.some(u => u.sigla === dto.sigla)) {
            throw new Error('Sigla já existente');
        }

        InMemory.SetAll(ENTITY, [...data, dto]);
        return dto;
    }

    async function update(id, alteradoPor, rawData) {
        const data = InMemory.GetAll(ENTITY);
        const idx = data.findIndex(u => u.id === id);
        if (idx === -1) return null;

        const updated = {
            ...data[idx],
            ...rawData,
            alteradoPor: alteradoPor,
            alteradoEm: new Date().toISOString()
        };

        const next = [...data];
        next[idx] = updated;

        InMemory.SetAll(ENTITY, next);
        return updated;
    }

    async function softDelete(id, excluidoPor) {
        const data = InMemory.GetAll(ENTITY);
        const idx = data.findIndex(u => u.id === id);
        if (idx === -1) return null;

        const next = [...data];
        next[idx] = {
            ...next[idx],
            excluidoPor: excluidoPor,
            excluidoEm: new Date().toISOString(),
            exclusaoFisica: false
        };

        InMemory.SetAll(ENTITY, next);
        return next[idx];
    }

    async function remove(id, excluidoPor) {
        const data = InMemory.GetAll(ENTITY);

        const exists = data.some(u => u.id === id);
        if (!exists) return false;

        const next = data.filter(u => u.id !== id);

        InMemory.SetAll(ENTITY, next);
        return true;
    }

    return {
        init,
        getAll,
        getById,
        getPaginated,
        create,
        update,
        softDelete,
        remove
    };
})();
