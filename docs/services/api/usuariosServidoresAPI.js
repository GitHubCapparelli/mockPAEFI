import { InMemory } from '../storage.js';
import { CreateUsuarioServidorDTO } from '../../data/factory/usuarioServidorDTO.js';

const ENTITY    = 'usuariosServidores';
const DATA_PATH = '/mockPAEFI/data/mock/usuariosServidores.json';

export const UsuariosServidoresAPI = (function () {
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
            else if (Array.isArray(json.usuariosServidores)) list = json.usuariosServidores;

            return list.map(u => CreateUsuarioServidorDTO(u));
        } catch (err) {
            console.error('Error loading usuariosServidores:', err);
            return [];
        }
    }

    async function getAll({ orderBy = 'nome', order = 'asc' } = {}) {
        const source = InMemory.GetAll(ENTITY);
        const result = [...source]; 

        if (orderBy === 'nome') {
            result.sort((a, b) =>
                order === 'asc'
                    ? a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
                    : b.nome.localeCompare(a.nome, 'pt-BR', { sensitivity: 'base' })
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
        data = data.filter(u => !u.excluidoEm);
        
        if (filters.unidadeID)     data = data.filter(u => u.unidadeID === filters.unidadeID);
        if (filters.funcao)        data = data.filter(u => u.funcao === filters.funcao);
        if (filters.cargo)         data = data.filter(u => u.cargo === filters.cargo);
        if (filters.especialidade) data = data.filter(u => u.especialidade === filters.especialidade);

        const totalRecords = data.length;
        const totalPages   = Math.max(1, Math.ceil(totalRecords / pageSize));
        const currentPage  = Math.min(Math.max(page, 1), totalPages);

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;

        return {
            data: data.slice(start, end),
            pagination: { page: currentPage, pageSize, totalRecords, totalPages }
        };
    }

    async function create(rawData) {
        const data = InMemory.GetAll(ENTITY);
        const dto  = CreateUsuarioServidorDTO(rawData);
        if (data.some(u => u.login === dto.login)) {
            throw new Error('Login já existente');
        }

        InMemory.SetAll(ENTITY, [...data, dto]);
        return dto;
    }

    async function update(id, rawData) {
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

    async function softDelete(id, rawData) {
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
