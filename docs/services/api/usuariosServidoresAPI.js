// docs/services/api/usuariosServidoresAPI.js
import { CoreAPI }              from './coreAPI.js';
import { UsuarioServidorDTO }   from '../../data/factory/usuarioServidorDTO.js';
import { HistoricoAPI }         from './historicoAPI.js';

const _token = Symbol('UsuariosServidoresAPI');

export class UsuariosServidoresAPI extends CoreAPI {
  constructor(token, historicoAPI) {
    if (token !== _token) throw new Error('Use UsuariosServidoresAPI.CreateInstance() para criar instâncias');
    
    super({
      entity          : 'usuariosServidores',
      dataPath        : '/mockPAEFI/data/mock/usuariosServidores.json',
      jsonRoot        : 'usuariosServidores',
      defaultOrderBy  : 'nome',
      DTO             : UsuarioServidorDTO,
      historicoAPI
    });    
  }
  static async CreateInstance() {
    const historico = await HistoricoAPI.CreateInstance();
    const result    = new UsuariosServidoresAPI(_token, historico);
    await result.Init();
    return result;
  }

  applyFilters(data, filters) {
    let result = data;
    if (filters) {
      if (filters.unidadeID)      result = result.filter(x => x.unidadeID === filters.unidadeID);
      if (filters.funcao)         result = result.filter(x => x.funcao === filters.funcao);
      if (filters.cargo)          result = result.filter(x => x.cargo === filters.cargo);
      if (filters.especialidade)  result = result.filter(x => x.especialidade === filters.especialidade);
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
      (u.cpf === dto.cpf || u.login === dto.login || u.matricula === dto.matricula));

    if (conflict) {
      dto.errors.push('Dados duplicados (CPF/Login/Matrícula)');
      return false;
    }
    return true;
  }
}