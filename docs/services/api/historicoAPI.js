// docs/services/api/historicoAPI.js
import { CoreAPI }          from './coreAPI.js';
import { HistoricoDTO }     from '../../data/factory/historicoDTO.js';

const _token = Symbol('HistoricoAPI');

export class HistoricoAPI extends CoreAPI {
  constructor(token) {
    if (token !== _token) throw new Error('Use HistoricoAPI.CreateInstance() para criar instâncias');
    
    super({
      entity          : 'historico',
      dataPath        : '/mockPAEFI/data/mock/historico.json',
      jsonRoot        : 'historico',
      defaultOrderBy  : 'dataHora',
      DTO             : HistoricoDTO,
      historicoDTO    : HistoricoDTO
    });    
  }
  static async CreateInstance() {
    const result = new HistoricoAPI(_token);
    await result.Init();
    return result;
  }

  applyFilters(data, filters) {
    let result = data;
    if (filters) {
      if (filters.userID)       result = result.filter(x => x.userID === filters.userID);
      if (filters.catalogoID)   result = result.filter(x => x.catalogoID === filters.catalogoID);
      if (filters.dataHora)     result = result.filter(x => x.dataHora === filters.dataHora);
      if (filters.tipo)         result = result.filter(x => x.tipo === filters.tipo);
      if (filters.acao)         result = result.filter(x => x.acao === filters.acao);
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
//    const conflict = data.find(u =>
//      u.id !== dto.id &&
//      (u.cpf === dto.cpf || u.login === dto.login || u.matricula === dto.matricula));

//    if (conflict) {
//      dto.errors.push('Dados duplicados (CPF/Login/Matrícula)');
//      return false;
//    }
    return true;
  }
}
