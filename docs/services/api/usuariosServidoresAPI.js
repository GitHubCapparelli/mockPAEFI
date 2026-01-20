// docs/services/api/usuariosServidoresAPI.js
import { CoreAPI }              from './coreAPI.js';
import { UsuarioServidorDTO }   from '../../data/factory/usuarioServidorDTO.js';
import { HistoricoAPI }         from './historicoAPI.js';

const _token = Symbol('UsuariosServidoresAPI');

export class UsuariosServidoresAPI extends CoreAPI {
  constructor(token) {
    if (token !== _token) throw new Error('Use UsuariosServidoresAPI.CreateInstance() para criar instâncias');
    
    super({
      entity          : 'usuariosServidores',
      dataPath        : '/mockPAEFI/data/mock/usuariosServidores.json',
      jsonRoot        : 'usuariosServidores',
      defaultOrderBy  : 'nome',
      DTO             : UsuarioServidorDTO,
      historicoAPI    : HistoricoAPI
    });    
  }
  static async CreateInstance() {
    const result = new UsuariosServidoresAPI(_token);
    await result.Init();
    return result;
  }

  applyFilters(data, f) {
    return data.filter(u => {
      if (u.excluidoEm) return false;
      if (f.unidadeID && u.unidadeID !== f.unidadeID) return false;
      if (f.especialidade && u.especialidade !== f.especialidade) return false;
      if (f.funcao && u.funcao !== f.funcao) return false;
      return true;
    });
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