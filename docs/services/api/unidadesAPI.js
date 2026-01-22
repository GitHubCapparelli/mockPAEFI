// docs/services/api/unidadesAPI.js
import { CoreAPI }          from './coreAPI.js';
import { UnidadeDTO }       from '../../data/factory/unidadeDTO.js';
import { HistoricoAPI }     from './historicoAPI.js';
import { Registry }         from '../storage.js';

const _token = Symbol('UnidadesAPI');

export class UnidadesAPI extends CoreAPI {
  constructor(token, historicoAPI) {
    if (token !== _token) throw new Error('Use UnidadesAPI.CreateInstance() para criar instâncias');
    
    super({
      entity          : 'unidades',
      dataPath        : '/mockPAEFI/data/mock/unidades.json',
      jsonRoot        : 'unidades',
      defaultOrderBy  : 'nome',
      DTO             : UnidadeDTO,
      historicoAPI    : historicoAPI;
    });    
  }
  static async CreateInstance() {
    const historico = await Registry.API(HistoricoAPI);
    const result    = new UnidadesAPI(_token, historico);
    await result.Init();
    return result;
  }

  applyFilters(data, filters) {
    let result = data;
    if (filters) {
        if (filters.funcao) result = result.filter(x => x.funcao === filters.funcao);
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
      (u.nome === dto.nome || u.sigla === dto.sigla));

    if (conflict) {
      dto.errors.push('Dados duplicados (Nome/Sigla)');
      return false;
    }
    return true;
  }
}