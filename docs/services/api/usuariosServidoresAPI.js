import { CreateCoreAPI }            from './coreAPI.js';
import { CreateUsuarioServidorDTO } from '../../data/factory/usuarioServidorDTO.js';

export const UsuariosServidoresAPI = CreateCoreAPI({
  entity         : 'usuariosServidores',
  dataPath       : '/mockPAEFI/data/mock/usuariosServidores.json',
  jsonRoot       : 'usuariosServidores',
  defaultOrderBy : 'nome',

  createDTO: CreateUsuarioServidorDTO,

applyFilters(data, filters) {
    let result = data.filter(u => !u.ExcluidoEm);

    if (filters.unidadeID) {
      result = result.filter(u => u.unidadeID === filters.unidadeID);
    }
    if (filters.funcao) {
      result = result.filter(u => u.funcao === filters.funcao);
    }
    if (filters.cargo) {
      result = result.filter(u => u.cargo === filters.cargo);
    }
    if (filters.especialidade) {
      result = result.filter(u => u.especialidade === filters.especialidade);
    }

    return result;
  },

  validateCreate(dto, data) {
    if (data.some(u => u.cpf       === dto.cpf
                    || u.login     === dto.login 
                    || u.matricula === dto.matricula)) {
      throw new Error('Já existe servidor(a) com esse login, matrícula ou CPF');
    }
  }
});
