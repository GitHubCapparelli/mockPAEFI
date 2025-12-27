import { InMemory }                 from '../storage.js';
import { CreateUsuarioServidorDTO } from '../../data/factory/usuarioServidorDTO.js';

const ENTITY    = 'usuariosServidores';
const DATA_PATH = '/mockPAEFI/data/mock/usuariosServidores.json';

export const UsuarioServidorAPI = (function () {
    'use strict';

    async function init() {
        const data = await loadInitialData();   
        InMemory.InitStore({ [ENTITY]: data });
        return true;
    }

    async function loadInitialData() {
        try {
            let users      = [];
            const response = await fetch(DATA_PATH);
            const json     = await response.json();

            if (Array.isArray(json)) {
                users = json;
            } 
            else if (Array.isArray(json.users)) {
                users = json.users;
            }
            else if (Array.isArray(json.usuariosServidores)) {
                users = json.usuariosServidores;
            } 
            else {
                console.warn('Unexpected usuariosServidores JSON shape:', json);
                users = [];
            }
            return users.map(u => CreateUsuarioServidorDTO(u));

        } catch (err) {
            console.error('Error loading initial usuariosServidores:', err);
            return [];
        }
    }

    async function getAll() {
        return InMemory.GetAll(ENTITY);
    }

    async function getById(id) {
        const data = await getAll();
        return data.find(u => u.id === id) || null;
    }

    async function getPaginated({ page = 1, pageSize = 10, filters = {} }) {
        let data = await getAll();

        if (filters.unidadeID) {
            data = data.filter(u => u.unidadeID === filters.unidadeID);
        }

        if (filters.funcao) {
            data = data.filter(u => u.funcao === filters.funcao);
        }

        if (filters.cargo) {
            data = data.filter(u => u.cargo === filters.cargo);
        }

        if (filters.especialidade) {
            data = data.filter(u => u.especialidade === filters.especialidade);
        }

        if (filters.search) {
            const s = filters.search.toLowerCase();
            data = data.filter(u =>
            u.nome.toLowerCase().includes(s) ||
            u.login.toLowerCase().includes(s)
            );
        }

        const totalRecords = data.length;
        const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
        const currentPage = Math.min(Math.max(page, 1), totalPages);

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;

        return {
            data: data.slice(start, end),
            pagination: {
            page: currentPage,
            pageSize,
            totalRecords,
            totalPages
            }
        };
    }

    async function create(rawData) {
        const dto = CreateUsuarioServidorDTO(rawData);
        const data = await getAll();

        data.push(dto);
        InMemory.SetAll(ENTITY, data);

        return dto;
    }

    async function update(id, rawData) {
        const data = await getAll();
        const idx = data.findIndex(u => u.id === id);
        if (idx === -1) return null;

        data[idx] = {
            ...data[idx],
            ...rawData,
            alteradoEm: new Date().toISOString()
        };

        InMemory.SetAll(ENTITY, data);
        return data[idx];
    }

    async function softDelete(id) {
        const data = await getAll();
        const idx = data.findIndex(u => u.id === id);
        if (idx === -1) return null;

        data[idx] = {
            ...data[idx],
            excluidoEm: new Date().toISOString(),
            exclusaoFisica: false
        };

        InMemory.SetAll(ENTITY, data);
        return data[idx];
    }

    async function remove(id) {
        const data = await getAll();
        const idx = data.findIndex(u => u.id === id);
        if (idx === -1) return null;

        const removed = data.splice(idx, 1)[0];
        InMemory.SetAll(ENTITY, data);
        return removed;
    }

    return {
        init,
        getAll,
        getById,
        getPaginated,
        create,
        update,
        remove,
        softDelete     
    };
})();
