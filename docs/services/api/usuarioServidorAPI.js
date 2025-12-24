import { CreateUsuarioServidorDTO } from '../../data/factory/usuarioServidorDTO.js';

export const UsuarioServidorService = (function () {
  'use strict';

  let store = [];

  function init() {
    return $.ajax({
      url: '/mockPAEFI/data/mock/usuariosServidores.json',
      dataType: 'json'
    }).then(data => {
      store = (data.usuariosServidores || []).map(CreateUsuarioServidorDTO);
    });
  }

  function getAll(filters = {}) {
    let result = [...store];

    if (filters.unidadeID) {
      result = result.filter(u => u.unidadeID === filters.unidadeID);
    }

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(u =>
        u.nome.toLowerCase().includes(s) ||
        u.login.toLowerCase().includes(s)
      );
    }

    return result;
  }

  function getPaginated(page, pageSize, filters) {
    const data = getAll(filters);
    const total = data.length;
    const pages = Math.ceil(total / pageSize) || 1;

    page = Math.min(Math.max(page, 1), pages);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: data.slice(start, end),
      total,
      pages,
      page,
      pageSize
    };
  }

  function getById(id) {
    return store.find(u => u.id === id);
  }

  function add(dto) {
    store.push(dto);
    return dto;
  }

  function update(id, payload) {
    const idx = store.findIndex(u => u.id === id);
    if (idx < 0) return null;

    store[idx] = {
      ...store[idx],
      ...payload,
      alteradoEm: new Date().toISOString()
    };
    return store[idx];
  }

  function remove(id) {
    const idx = store.findIndex(u => u.id === id);
    if (idx < 0) return null;

    return store.splice(idx, 1)[0];
  }

  return {
    init,
    getAll,
    getPaginated,
    getById,
    add,
    update,
    remove
  };
})();
