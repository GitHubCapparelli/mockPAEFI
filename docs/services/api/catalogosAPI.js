// docs/services/api/catalogosAPI.js
import { CoreAPI }        from './coreAPI.js';
import { CatalogoDTO }    from '../../data/factory/catalogoDTO.js';
import { HistoricoAPI}    from './historicoAPI';

const _token = Symbol('CatalogosAPI');

export class CatalogosAPI extends CoreAPI {
  constructor(token) {
    if (token !== _token) throw new Error('Use CatalogosAPI.CreateInstance() para criar instâncias');
    
    super({
      entity          : 'catalogos',
      dataPath        : '/mockPAEFI/data/mock/catalogos.json',
      jsonRoot        : 'catalogos',
      defaultOrderBy  : 'nome',
      DTO             : CatalogoDTO,
      historicoAPI    : HistoricoAPI
    });    
  }
  static async CreateInstance() {
    const result = new CatalogosAPI(_token);
    await result.Init();
    return result;
  }

  applyFilters(data, filters) {
    let result = data;
    if (filters) {
      // TODO:...
    }
    result = result.filter(x => !x.excluidoEm);
    return result;
  }

  validateCreate(dto, data) {
    return this.#unique(dto, data);
  }

  validateUpdate(dto, data) {
    return this.#unique(dto, data);
  }

  validateDelete() {
    return true;
  }

  #unique(dto, data) {
    const conflict = data.find(u =>
      u.id !== dto.id &&
      (u.nome === dto.nome));

    if (conflict) {
      dto.errors.push('Dados duplicados (Nome)');
      return false;
    }
    return true;
  }
}